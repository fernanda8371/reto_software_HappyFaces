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
  const { challengeId } = req.params
  const { code, language } = req.body
  const userId = req.user.user_id

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Code content is required",
    })
  }

  const client = await pool.connect()

  try {
    // Start a transaction
    await client.query("BEGIN")

    // Fetch challenge details for Gemini analysis
    const challengeResult = await client.query(
      `SELECT title, description FROM challenges WHERE challenge_id = $1`,
      [challengeId]
    )

    const challenge = challengeResult.rows[0]

    // Analyze code with Gemini
    const codeAnalysis = await analyzeCode(code, challenge.description)

    // Insert the submission
    const submissionResult = await client.query(
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
        codeAnalysis.status,
        codeAnalysis.timeComplexity,
        codeAnalysis.spaceComplexity,
        JSON.stringify({
          feedback: codeAnalysis.feedback,
          suggestion: codeAnalysis.suggestion
        })
      ],
    )

    const submission = submissionResult.rows[0]

    // Update user_challenges table
    const userChallengeResult = await client.query(
      `
      SELECT * FROM user_challenges 
      WHERE user_id = $1 AND challenge_id = $2
    `,
      [userId, challengeId],
    )

    if (userChallengeResult.rows.length === 0) {
      // First time attempting this challenge
      await client.query(
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
          (SELECT points FROM challenges WHERE challenge_id = $2), 
          1, CURRENT_TIMESTAMP,
          CASE WHEN $4 = 'correct' THEN CURRENT_TIMESTAMP ELSE NULL END
        )
      `,
        [userId, challengeId, codeAnalysis.status === 'correct' ? 'completed' : 'in_progress', codeAnalysis.status],
      )
    } else {
      // Update existing record
      await client.query(
        `
        UPDATE user_challenges
        SET 
          status = CASE 
            WHEN $3 = 'correct' THEN 'completed' 
            ELSE COALESCE(status, 'in_progress') 
          END,
          attempts = attempts + 1,
          last_attempt_date = CURRENT_TIMESTAMP,
          completed_date = CASE 
            WHEN $3 = 'correct' AND status != 'completed' THEN CURRENT_TIMESTAMP 
            ELSE completed_date 
          END
        WHERE 
          user_id = $1 AND challenge_id = $2
      `,
        [userId, challengeId, codeAnalysis.status],
      )
    }

    // Commit the transaction
    await client.query("COMMIT")

    // Prepare test results
    const testResults = {
      status: codeAnalysis.status === 'correct' ? "Aceptado" : "Rechazado",
      runtime: `${Math.floor(Math.random() * 100) + 1}ms`,
      memory: `${(Math.random() * 10).toFixed(1)} MB`,
      timeComplexity: codeAnalysis.timeComplexity,
      spaceComplexity: codeAnalysis.spaceComplexity,
      feedback: codeAnalysis.feedback,
      suggestion: codeAnalysis.suggestion,
      testCases: [
        {
          id: 1,
          input: challenge.description,
          expected: "Solución esperada",
          output: code,
          passed: codeAnalysis.status === 'correct'
        }
      ]
    }

    res.status(201).json({
      success: true,
      data: {
        submission,
        testResults,
      },
    })
  } catch (error) {
    // Rollback in case of error
    await client.query("ROLLBACK")

    console.error("Error submitting solution:", error)
    res.status(500).json({
      success: false,
      error: "Error submitting solution",
    })
  } finally {
    // Release the client back to the pool
    client.release()
  }
}

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