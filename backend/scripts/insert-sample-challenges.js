const { pool } = require("../config/db")

async function insertSampleChallenges() {
  const client = await pool.connect()

  try {
    // Start a transaction
    await client.query("BEGIN")

    // Get admin user ID (or create one if it doesn't exist)
    const adminResult = await client.query(`
      SELECT user_id FROM users WHERE role = 'admin' LIMIT 1
    `)

    let adminId
    if (adminResult.rows.length === 0) {
      // Create an admin user if none exists
      const adminInsert = await client.query(`
        INSERT INTO users (firebase_uid, email, name, role)
        VALUES ('admin_uid', 'admin@example.com', 'Admin User', 'admin')
        RETURNING user_id
      `)
      adminId = adminInsert.rows[0].user_id
    } else {
      adminId = adminResult.rows[0].user_id
    }

    // Sample challenges
    const challenges = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "easy",
        points: 2,
        example_input: "[2,7,11,15]\n9",
        example_output: "[0,1]",
        constraints:
          "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
      },
      {
        title: "Longest Common Substring",
        description:
          "Given two strings, find the longest common substring. Return the length of the longest common substring.",
        difficulty: "medium",
        points: 3,
        example_input: "ABCDGH\nABEDFHR",
        example_output: "2",
        constraints: "1 <= |str1|, |str2| <= 1000\nStrings only contain uppercase letters.",
      },
      {
        title: "Number of Islands",
        description:
          "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
        difficulty: "medium",
        points: 3,
        example_input:
          '[\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        example_output: "1",
        constraints: "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is '0' or '1'.",
      },
      {
        title: "Trapping Rain Water",
        description:
          "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        difficulty: "hard",
        points: 5,
        example_input: "[0,1,0,2,1,0,1,3,2,1,2,1]",
        example_output: "6",
        constraints: "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
      },
      {
        title: "Palindrome Number",
        description:
          "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.",
        difficulty: "easy",
        points: 2,
        example_input: "121",
        example_output: "true",
        constraints: "-2^31 <= x <= 2^31 - 1",
      },
    ]

    // Insert challenges
    for (const challenge of challenges) {
      const result = await client.query(
        `
        INSERT INTO challenges (
          title, description, difficulty, points, creator_id, 
          example_input, example_output, constraints, active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING challenge_id
      `,
        [
          challenge.title,
          challenge.description,
          challenge.difficulty,
          challenge.points,
          adminId,
          challenge.example_input,
          challenge.example_output,
          challenge.constraints,
          true,
        ],
      )

      const challengeId = result.rows[0].challenge_id

      // Add tags based on challenge type
      let tags = []
      if (challenge.title.includes("Sum")) {
        tags = ["arrays", "hash-table"]
      } else if (challenge.title.includes("String") || challenge.title.includes("Substring")) {
        tags = ["strings", "dynamic-programming"]
      } else if (challenge.title.includes("Islands")) {
        tags = ["graph", "depth-first-search"]
      } else if (challenge.title.includes("Water")) {
        tags = ["arrays", "two-pointers", "dynamic-programming"]
      } else if (challenge.title.includes("Palindrome")) {
        tags = ["math", "strings"]
      }

      // Insert tags for the challenge
      for (const tag of tags) {
        // Get tag ID
        const tagResult = await client.query(
          `
          SELECT tag_id FROM tags WHERE name = $1
        `,
          [tag],
        )

        if (tagResult.rows.length > 0) {
          const tagId = tagResult.rows[0].tag_id

          // Link tag to challenge
          await client.query(
            `
            INSERT INTO challenge_tags (challenge_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `,
            [challengeId, tagId],
          )
        }
      }
    }

    // Commit the transaction
    await client.query("COMMIT")

    console.log("Sample challenges inserted successfully")
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error inserting sample challenges:", error)
  } finally {
    client.release()
    pool.end()
  }
}

insertSampleChallenges()
