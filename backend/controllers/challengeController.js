const { pool, query } = require("../config/db")
const { analyzeCode } = require('../utils/geminiCodeReview')

// Get all challenges
const getAllChallenges = async (req, res) => {
  try {
    const result = await query(
      `
      SELECT 
        c.challenge_id, 
        c.title, 
        c.description, 
        c.difficulty, 
        c.points,
        c.example_input,
        c.example_output,
        c.constraints,
        c.active,
        u.name as creator_name,
        COALESCE(
          (SELECT status FROM user_challenges 
           WHERE user_id = $1 AND challenge_id = c.challenge_id), 
          'not_started'
        ) as status
      FROM 
        challenges c
      LEFT JOIN 
        users u ON c.creator_id = u.user_id
      WHERE 
        c.active = true
      ORDER BY 
        c.challenge_id
    `,
      [req.user.user_id],
    )

    // Get tags for each challenge
    for (const challenge of result.rows) {
      const tagsResult = await query(
        `
        SELECT t.name, t.category 
        FROM tags t
        JOIN challenge_tags ct ON t.tag_id = ct.tag_id
        WHERE ct.challenge_id = $1
      `,
        [challenge.challenge_id],
      )

      challenge.tags = tagsResult.rows
    }

    res.status(200).json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching challenges:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching challenges",
    })
  }
}

// Get a single challenge by ID
const getChallengeById = async (req, res) => {
  const challengeId = req.params.id

  try {
    // Get challenge details
    const challengeResult = await query(
      `
      SELECT 
        c.challenge_id, 
        c.title, 
        c.description, 
        c.difficulty, 
        c.points,
        c.example_input,
        c.example_output,
        c.constraints,
        c.active,
        u.name as creator_name,
        COALESCE(
          (SELECT status FROM user_challenges 
           WHERE user_id = $1 AND challenge_id = c.challenge_id), 
          'not_started'
        ) as status
      FROM 
        challenges c
      LEFT JOIN 
        users u ON c.creator_id = u.user_id
      WHERE 
        c.challenge_id = $2
    `,
      [req.user.user_id, challengeId],
    )

    if (challengeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      })
    }

    const challenge = challengeResult.rows[0]

    // Get tags for the challenge
    const tagsResult = await query(
      `
      SELECT t.name, t.category 
      FROM tags t
      JOIN challenge_tags ct ON t.tag_id = ct.tag_id
      WHERE ct.challenge_id = $1
    `,
      [challengeId],
    )

    challenge.tags = tagsResult.rows

    // Get user's submissions for this challenge
    const submissionsResult = await query(
      `
      SELECT 
        submission_id, 
        code_content, 
        status, 
        feedback, 
        execution_time_ms,
        created_at
      FROM 
        submissions
      WHERE 
        user_id = $1 AND challenge_id = $2
      ORDER BY 
        created_at DESC
    `,
      [req.user.user_id, challengeId],
    )

    challenge.submissions = submissionsResult.rows

    res.status(200).json({
      success: true,
      data: challenge,
    })
  } catch (error) {
    console.error("Error fetching challenge:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching challenge details",
    })
  }
}

// Update the submitSolution function to integrate with Gemini
const submitSolution = async (req, res) => {
  const { challengeId } = req.params;
  const { code, language } = req.body;
  const userId = req.user.user_id;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Code content is required",
    });
  }

  try {
    // Start a transaction
    await query("BEGIN");

    // Get challenge details first to know difficulty and points
    const challengeDetails = await query(
      `SELECT title, description, difficulty, points, example_input, example_output 
       FROM challenges WHERE challenge_id = $1`,
      [challengeId]
    );
    
    if (challengeDetails.rows.length === 0) {
      await query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      });
    }
    
    const challenge = challengeDetails.rows[0];
    
    // Use Gemini to analyze the code
    const codeAnalysis = await analyzeCode(code, challenge.description);
    
    // Determine status based on Gemini's analysis
    const submissionStatus = codeAnalysis.status; // 'correct' or 'incorrect'
    
    // Insert the submission with analysis results
    const submissionResult = await query(
      `
      INSERT INTO submissions (
        user_id, 
        challenge_id, 
        code_content, 
        status,
        time_complexity,
        space_complexity,
        feedback
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        userId, 
        challengeId, 
        code, 
        submissionStatus,
        codeAnalysis.timeComplexity || null,
        codeAnalysis.spaceComplexity || null,
        `${codeAnalysis.feedback || ''}\n${codeAnalysis.suggestion || ''}`
      ]
    );

    const submission = submissionResult.rows[0];

    // Update user_challenges table only if the submission is correct
    if (submissionStatus === "correct") {
      const userChallengeResult = await query(
        `
        SELECT * FROM user_challenges 
        WHERE user_id = $1 AND challenge_id = $2
        `,
        [userId, challengeId]
      );

      if (userChallengeResult.rows.length === 0) {
        // First time completing this challenge - assign full points
        await query(
          `
          INSERT INTO user_challenges (
            user_id, 
            challenge_id, 
            status, 
            score, 
            attempts, 
            last_attempt_date,
            completed_date
          )
          VALUES (
            $1, $2, $3, 
            $4, 
            1, CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
          `,
          [userId, challengeId, "completed", challenge.points]
        );
      } else if (userChallengeResult.rows[0].status !== 'completed') {
        // User has attempted before but not completed - assign points now
        await query(
          `
          UPDATE user_challenges
          SET 
            status = 'completed',
            score = $3,
            attempts = attempts + 1,
            last_attempt_date = CURRENT_TIMESTAMP,
            completed_date = CURRENT_TIMESTAMP
          WHERE 
            user_id = $1 AND challenge_id = $2
          `,
          [userId, challengeId, challenge.points]
        );
      } else {
        // User has already completed this challenge before - just update attempts
        await query(
          `
          UPDATE user_challenges
          SET 
            attempts = attempts + 1,
            last_attempt_date = CURRENT_TIMESTAMP
          WHERE 
            user_id = $1 AND challenge_id = $2
          `,
          [userId, challengeId]
        );
      }
    } else {
      // If incorrect, update the user_challenge or create it with 'in_progress' status
      const userChallengeResult = await query(
        `
        SELECT * FROM user_challenges 
        WHERE user_id = $1 AND challenge_id = $2
        `,
        [userId, challengeId]
      );

      if (userChallengeResult.rows.length === 0) {
        // First attempt at this challenge
        await query(
          `
          INSERT INTO user_challenges (
            user_id, 
            challenge_id, 
            status, 
            score, 
            attempts, 
            last_attempt_date
          )
          VALUES (
            $1, $2, 'in_progress', 
            0, 
            1, CURRENT_TIMESTAMP
          )
          `,
          [userId, challengeId]
        );
      } else {
        // Increment attempt count
        await query(
          `
          UPDATE user_challenges
          SET 
            status = CASE WHEN status = 'not_started' THEN 'in_progress' ELSE status END,
            attempts = attempts + 1,
            last_attempt_date = CURRENT_TIMESTAMP
          WHERE 
            user_id = $1 AND challenge_id = $2
          `,
          [userId, challengeId]
        );
      }
    }

    // Commit the transaction
    await query("COMMIT");

    // Create test cases for the response (puedes adaptar esta parte según sea necesario)
    const testCases = [
      {
        id: 1,
        input: challenge.example_input || "Sample input",
        expected: challenge.example_output || "Expected output",
        output: submissionStatus === "correct" ? challenge.example_output : "Your output differs",
        passed: submissionStatus === "correct"
      }
    ];

    // Return the submission with analysis results and test results
    res.status(201).json({
      success: true,
      data: {
        submission,
        testResults: {
          status: submissionStatus === "correct" ? "Aceptado" : "Incorrecto",
          timeComplexity: codeAnalysis.timeComplexity || "N/A",
          spaceComplexity: codeAnalysis.spaceComplexity || "N/A",
          feedback: codeAnalysis.feedback || "",
          suggestion: codeAnalysis.suggestion || "",
          testCases: testCases,
        },
      },
    });
  } catch (error) {
    // Rollback in case of error
    await query("ROLLBACK");

    console.error("Error submitting solution:", error);
    res.status(500).json({
      success: false,
      error: "Error submitting solution",
    });
  }
};

// Get user's progress on challenges
const getUserChallengesProgress = async (req, res) => {
  try {
    const result = await query(
      `
      SELECT 
        c.challenge_id,
        c.title,
        c.difficulty,
        c.points,
        COALESCE(uc.status, 'not_started') as status,
        COALESCE(uc.attempts, 0) as attempts,
        uc.last_attempt_date,
        uc.completed_date
      FROM 
        challenges c
      LEFT JOIN 
        user_challenges uc ON c.challenge_id = uc.challenge_id AND uc.user_id = $1
      WHERE 
        c.active = true
      ORDER BY 
        CASE 
          WHEN COALESCE(uc.status, 'not_started') = 'in_progress' THEN 1
          WHEN COALESCE(uc.status, 'not_started') = 'not_started' THEN 2
          ELSE 3
        END,
        uc.last_attempt_date DESC NULLS LAST
    `,
      [req.user.user_id],
    )

    // Calculate statistics
    const stats = {
      totalChallenges: result.rows.length,
      completed: result.rows.filter((c) => c.status === "completed").length,
      inProgress: result.rows.filter((c) => c.status === "in_progress").length,
      notStarted: result.rows.filter((c) => c.status === "not_started").length,
      totalPoints: result.rows.reduce((sum, c) => (c.status === "completed" ? sum + c.points : sum), 0),
    }

    res.status(200).json({
      success: true,
      data: {
        challenges: result.rows,
        stats,
      },
    })
  } catch (error) {
    console.error("Error fetching user challenges progress:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching user challenges progress",
    })
  }
}

module.exports = {
  getAllChallenges,
  getChallengeById,
  submitSolution,
  getUserChallengesProgress,
}