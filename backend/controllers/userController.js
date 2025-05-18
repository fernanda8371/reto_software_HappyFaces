const { query } = require("../config/db")

// 🔍 Buscar usuarios por nombre (para Team Submission)
const searchUsers = async (req, res) => {
  const { q } = req.query

  if (!q || q.length < 2) {
    return res.status(400).json({
      success: false,
      error: "Query parameter 'q' must be at least 2 characters",
    })
  }

  try {
    const result = await query(
      `
      SELECT 
        user_id, 
        name, 
        email, 
        role, 
        company, 
        job_title, 
        total_score, 
        streak_days, 
        created_at
      FROM 
        users
      WHERE 
        LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1)
      ORDER BY 
        name
      LIMIT 10
    `,
      [`%${q}%`],
    )

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No se encontraron usuarios con ese nombre o correo.",
      })
    }

    res.status(200).json({
      success: true,
      data: result.rows.map(user => ({
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        job_title: user.job_title,
        total_score: user.total_score,
        streak_days: user.streak_days,
        created_at: user.created_at,
        avatar: null, // Puedes unir con la tabla de perfiles si tienes
      })),
      message: "Usuarios encontrados.",
    })
  } catch (error) {
    console.error("Error searching users:", error)
    res.status(500).json({
      success: false,
      error: "Error searching users",
      message: error.message || "Ocurrió un error al buscar usuarios.",
    })
  }
}

module.exports = {
  searchUsers,
}
