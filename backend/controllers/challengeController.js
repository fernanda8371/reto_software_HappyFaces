const { query } = require("../config/db")

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

// Update the submitSolution function to store the actual code content
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

  try {
    // Start a transaction
    await query("BEGIN")

    // Insert the submission
    const submissionResult = await query(
      `
      INSERT INTO submissions (
        user_id, 
        challenge_id, 
        code_content, 
        status
      ) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [userId, challengeId, code, "correct"],
    ) // For now, we'll mark all submissions as correct

    const submission = submissionResult.rows[0]

    // Update user_challenges table
    const userChallengeResult = await query(
      `
      SELECT * FROM user_challenges 
      WHERE user_id = $1 AND challenge_id = $2
    `,
      [userId, challengeId],
    )

    if (userChallengeResult.rows.length === 0) {
      // First time attempting this challenge
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
          (SELECT points FROM challenges WHERE challenge_id = $2), 
          1, CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `,
        [userId, challengeId, "completed"],
      )
    } else {
      // Update existing record
      await query(
        `
        UPDATE user_challenges
        SET 
          status = 'completed',
          attempts = attempts + 1,
          last_attempt_date = CURRENT_TIMESTAMP,
          completed_date = CASE WHEN status != 'completed' THEN CURRENT_TIMESTAMP ELSE completed_date END
        WHERE 
          user_id = $1 AND challenge_id = $2
      `,
        [userId, challengeId],
      )
    }

    // Commit the transaction
    await query("COMMIT")

    // Get the challenge details to get example input/output for test cases
    const challengeResult = await query(
      `SELECT example_input, example_output FROM challenges WHERE challenge_id = $1`,
      [challengeId],
    )

    const challenge = challengeResult.rows[0]

    // Create test cases based on the example input/output
    const testCases = []

    if (challenge && challenge.example_input && challenge.example_output) {
      testCases.push({
        id: 1,
        input: challenge.example_input,
        expected: challenge.example_output,
        output: challenge.example_output,
        passed: true,
      })

      // Add a couple more mock test cases
      testCases.push({
        id: 2,
        input: "Test input 2",
        expected: "Expected output 2",
        output: "Expected output 2",
        passed: true,
      })

      testCases.push({
        id: 3,
        input: "Test input 3",
        expected: "Expected output 3",
        output: "Expected output 3",
        passed: true,
      })
    } else {
      // Fallback test cases if no example input/output
      testCases.push(
        { id: 1, input: "Test input 1", expected: "Expected output 1", output: "Expected output 1", passed: true },
        { id: 2, input: "Test input 2", expected: "Expected output 2", output: "Expected output 2", passed: true },
        { id: 3, input: "Test input 3", expected: "Expected output 3", output: "Expected output 3", passed: true },
      )
    }

    // Return the submission with test results
    const mockTestResults = {
      status: "Aceptado",
      runtime: `${Math.floor(Math.random() * 100) + 1}ms`,
      memory: `${(Math.random() * 10).toFixed(1)} MB`,
      testCases: testCases,
    }

    res.status(201).json({
      success: true,
      data: {
        submission,
        testResults: mockTestResults,
      },
    })
  } catch (error) {
    // Rollback in case of error
    await query("ROLLBACK")

    console.error("Error submitting solution:", error)
    res.status(500).json({
      success: false,
      error: "Error submitting solution",
    })
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
