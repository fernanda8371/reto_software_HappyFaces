const { query } = require("../config/db")

// Get leaderboard data
const getLeaderboard = async (req, res) => {
  try {
    // Query to get top users ordered by total_score
    const result = await query(`
      SELECT 
        user_id, 
        name, 
        email, 
        total_score, 
        streak_days,
        company,
        job_title
      FROM 
        users 
      ORDER BY 
        total_score DESC 
      LIMIT 20
    `)

    // Format the response
    const leaderboardData = result.rows.map((user, index) => ({
      rank: index + 1,
      userId: user.user_id,
      username: user.name,
      email: user.email,
      score: user.total_score || 0,
      streakDays: user.streak_days || 0,
      department: user.job_title || "N/A",
      team: user.company || "Tech Mahindra",
      city: "N/A",
      avatar: null, // We'll add avatar support later
    }))

    res.status(200).json({
      success: true,
      data: leaderboardData,
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching leaderboard data",
    })
  }
}

// Get user's rank and stats
const getUserRank = async (req, res) => {
  const userId = req.params.userId

  try {
    // Get user's data
    const userResult = await query(
      `
      SELECT 
        name, 
        email, 
        total_score,
        streak_days,
        company,
        job_title
      FROM 
        users 
      WHERE 
        user_id = $1
    `,
      [userId],
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    const userData = userResult.rows[0]

    // Get user's rank
    const rankResult = await query(
      `
      SELECT COUNT(*) + 1 as rank
      FROM users
      WHERE total_score > $1
    `,
      [userData.total_score || 0],
    )

    const userRank = rankResult.rows[0].rank

    res.status(200).json({
      success: true,
      data: {
        rank: userRank,
        username: userData.name,
        email: userData.email,
        score: userData.total_score || 0,
        streakDays: userData.streak_days || 0,
        department: userData.job_title || "N/A",
        team: userData.company || "Tech Mahindra",
        city: "N/A",
      },
    })
  } catch (error) {
    console.error("Error fetching user rank:", error)
    res.status(500).json({
      success: false,
      error: "Error fetching user rank data",
    })
  }
}

module.exports = {
  getLeaderboard,
  getUserRank,
}
