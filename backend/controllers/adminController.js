const { query } = require("../config/db")

// Get all users
const getAllUsers = async (req, res) => {
  try {
    console.log("Getting all users from database")

    const result = await query(`
      SELECT 
        user_id, 
        email, 
        name, 
        role, 
        company, 
        job_title, 
        total_score, 
        streak_days, 
        created_at
      FROM 
        users
      ORDER BY 
        name
    `)

    console.log(`Found ${result.rows.length} users`)

    res.status(200).json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching users",
      message: error.message,
    })
  }
}

// Get a single user by ID
const getUserById = async (req, res) => {
  const userId = req.params.id

  try {
    const result = await query(
      `
      SELECT 
        user_id, 
        email, 
        name, 
        role, 
        company, 
        job_title, 
        total_score, 
        streak_days, 
        created_at
      FROM 
        users
      WHERE 
        user_id = $1
    `,
      [userId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching user details",
      message: error.message,
    })
  }
}

// Create a new user
const createUser = async (req, res) => {
  const { email, name, password, role, company, job_title } = req.body

  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      error: "Email, name, and password are required",
    })
  }

  try {
    // Check if email already exists
    const emailCheck = await query(
      `
      SELECT email FROM users WHERE email = $1
    `,
      [email],
    )

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Email already in use",
      })
    }

    // Create a new user
    const result = await query(
      `
      INSERT INTO users (
        firebase_uid,
        email, 
        name, 
        role, 
        company, 
        job_title
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        user_id, 
        email, 
        name, 
        role, 
        company, 
        job_title, 
        created_at
    `,
      [
        `admin_created_${Date.now()}`, // Placeholder for firebase_uid
        email,
        name,
        role || "employee",
        company || "Tech Mahindra",
        job_title || null,
      ],
    )

    res.status(201).json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({
      success: false,
      error: "Error creating user",
      message: error.message,
    })
  }
}

// Update a user
const updateUser = async (req, res) => {
  const userId = req.params.id
  const { email, name, role, company, job_title } = req.body

  if (!email || !name) {
    return res.status(400).json({
      success: false,
      error: "Email and name are required",
    })
  }

  try {
    // Check if user exists
    const userCheck = await query(
      `
      SELECT user_id FROM users WHERE user_id = $1
    `,
      [userId],
    )

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Update user
    const result = await query(
      `
      UPDATE users
      SET 
        email = $1, 
        name = $2, 
        role = $3, 
        company = $4, 
        job_title = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        user_id = $6
      RETURNING 
        user_id, 
        email, 
        name, 
        role, 
        company, 
        job_title, 
        updated_at
    `,
      [email, name, role || "employee", company || "Tech Mahindra", job_title || null, userId],
    )

    res.status(200).json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({
      success: false,
      error: "Error updating user",
      message: error.message,
    })
  }
}

// Delete a user
const deleteUser = async (req, res) => {
  const userId = req.params.id

  try {
    // Check if user exists
    const userCheck = await query(
      `
      SELECT user_id FROM users WHERE user_id = $1
    `,
      [userId],
    )

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    // Delete user
    await query(
      `
      DELETE FROM users
      WHERE user_id = $1
    `,
      [userId],
    )

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({
      success: false,
      error: "Error deleting user",
      message: error.message,
    })
  }
}

// Get all challenges
const getAllChallenges = async (req, res) => {
  try {
    const result = await query(`
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
        c.created_at,
        u.user_id as creator_id,
        u.name as creator_name
      FROM 
        challenges c
      LEFT JOIN 
        users u ON c.creator_id = u.user_id
      ORDER BY 
        c.challenge_id
    `)

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
      message: error.message,
    })
  }
}

// Get a single challenge by ID
const getChallengeById = async (req, res) => {
  const challengeId = req.params.id

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
        c.created_at,
        u.user_id as creator_id,
        u.name as creator_name
      FROM 
        challenges c
      LEFT JOIN 
        users u ON c.creator_id = u.user_id
      WHERE 
        c.challenge_id = $1
    `,
      [challengeId],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      })
    }

    const challenge = result.rows[0]

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

    res.status(200).json({
      success: true,
      data: challenge,
    })
  } catch (error) {
    console.error("Error fetching challenge:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching challenge details",
      message: error.message,
    })
  }
}

// Create a new challenge
const createChallenge = async (req, res) => {
  const { title, description, difficulty, points, example_input, example_output, constraints, active, tags } = req.body
  const creatorId = req.user.user_id

  if (!title || !description || !difficulty) {
    return res.status(400).json({
      success: false,
      error: "Title, description, and difficulty are required",
    })
  }

  try {
    // Start a transaction
    await query("BEGIN")

    // Create a new challenge
    const result = await query(
      `
      INSERT INTO challenges (
        title, 
        description, 
        difficulty, 
        points, 
        creator_id, 
        example_input, 
        example_output, 
        constraints, 
        active
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        title,
        description,
        difficulty,
        points || (difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 5),
        creatorId,
        example_input || null,
        example_output || null,
        constraints || null,
        active !== undefined ? active : true,
      ],
    )

    const challenge = result.rows[0]

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Check if tag exists
        const tagResult = await query(
          `
          SELECT tag_id FROM tags WHERE name = $1
        `,
          [tagName],
        )

        let tagId
        if (tagResult.rows.length === 0) {
          // Create new tag
          const newTagResult = await query(
            `
            INSERT INTO tags (name, category)
            VALUES ($1, $2)
            RETURNING tag_id
          `,
            [tagName, "custom"],
          )

          tagId = newTagResult.rows[0].tag_id
        } else {
          tagId = tagResult.rows[0].tag_id
        }

        // Link tag to challenge
        await query(
          `
          INSERT INTO challenge_tags (challenge_id, tag_id)
          VALUES ($1, $2)
        `,
          [challenge.challenge_id, tagId],
        )
      }
    }

    // Commit the transaction
    await query("COMMIT")

    // Get the challenge with tags
    const finalResult = await getChallengeById(req, {
      status: (code) => ({
        json: (data) => {
          res.status(201).json(data)
        },
      }),
    })
  } catch (error) {
    // Rollback in case of error
    await query("ROLLBACK")

    console.error("Error creating challenge:", error)
    res.status(500).json({
      success: false,
      error: "Error creating challenge",
      message: error.message,
    })
  }
}

// Update a challenge
const updateChallenge = async (req, res) => {
  const challengeId = req.params.id
  const { title, description, difficulty, points, example_input, example_output, constraints, active, tags } = req.body

  if (!title || !description || !difficulty) {
    return res.status(400).json({
      success: false,
      error: "Title, description, and difficulty are required",
    })
  }

  try {
    // Check if challenge exists
    const challengeCheck = await query(
      `
      SELECT challenge_id FROM challenges WHERE challenge_id = $1
    `,
      [challengeId],
    )

    if (challengeCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      })
    }

    // Start a transaction
    await query("BEGIN")

    // Update challenge
    const result = await query(
      `
      UPDATE challenges
      SET 
        title = $1, 
        description = $2, 
        difficulty = $3, 
        points = $4, 
        example_input = $5, 
        example_output = $6, 
        constraints = $7, 
        active = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        challenge_id = $9
      RETURNING *
    `,
      [
        title,
        description,
        difficulty,
        points || (difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 5),
        example_input || null,
        example_output || null,
        constraints || null,
        active !== undefined ? active : true,
        challengeId,
      ],
    )

    // Update tags if provided
    if (tags) {
      // Remove existing tags
      await query(
        `
        DELETE FROM challenge_tags
        WHERE challenge_id = $1
      `,
        [challengeId],
      )

      // Add new tags
      for (const tagName of tags) {
        // Check if tag exists
        const tagResult = await query(
          `
          SELECT tag_id FROM tags WHERE name = $1
        `,
          [tagName],
        )

        let tagId
        if (tagResult.rows.length === 0) {
          // Create new tag
          const newTagResult = await query(
            `
            INSERT INTO tags (name, category)
            VALUES ($1, $2)
            RETURNING tag_id
          `,
            [tagName, "custom"],
          )

          tagId = newTagResult.rows[0].tag_id
        } else {
          tagId = tagResult.rows[0].tag_id
        }

        // Link tag to challenge
        await query(
          `
          INSERT INTO challenge_tags (challenge_id, tag_id)
          VALUES ($1, $2)
        `,
          [challengeId, tagId],
        )
      }
    }

    // Commit the transaction
    await query("COMMIT")

    // Get the updated challenge with tags
    const finalResult = await getChallengeById(req, {
      status: (code) => ({
        json: (data) => {
          res.status(200).json(data)
        },
      }),
    })
  } catch (error) {
    // Rollback in case of error
    await query("ROLLBACK")

    console.error("Error updating challenge:", error)
    res.status(500).json({
      success: false,
      error: "Error updating challenge",
      message: error.message,
    })
  }
}

// Delete a challenge
const deleteChallenge = async (req, res) => {
  const challengeId = req.params.id

  try {
    // Check if challenge exists
    const challengeCheck = await query(
      `
      SELECT challenge_id FROM challenges WHERE challenge_id = $1
    `,
      [challengeId],
    )

    if (challengeCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      })
    }

    // Start a transaction
    await query("BEGIN")

    // Delete challenge tags
    await query(
      `
      DELETE FROM challenge_tags
      WHERE challenge_id = $1
    `,
      [challengeId],
    )

    // Delete user challenges
    await query(
      `
      DELETE FROM user_challenges
      WHERE challenge_id = $1
    `,
      [challengeId],
    )

    // Delete submissions
    await query(
      `
      DELETE FROM submissions
      WHERE challenge_id = $1
    `,
      [challengeId],
    )

    // Delete challenge
    await query(
      `
      DELETE FROM challenges
      WHERE challenge_id = $1
    `,
      [challengeId],
    )

    // Commit the transaction
    await query("COMMIT")

    res.status(200).json({
      success: true,
      message: "Challenge deleted successfully",
    })
  } catch (error) {
    // Rollback in case of error
    await query("ROLLBACK")

    console.error("Error deleting challenge:", error)
    res.status(500).json({
      success: false,
      error: "Error deleting challenge",
      message: error.message,
    })
  }
}

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM tags
      ORDER BY category, name
    `)

    res.status(200).json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching tags:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching tags",
      message: error.message,
    })
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getAllTags,
}
