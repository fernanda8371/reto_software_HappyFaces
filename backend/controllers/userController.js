// backend/controllers/userController.js
const { query } = require('../config/db');

// Search for users
const searchUsers = async (req, res) => {
  const { term = '' } = req.query;
  const currentUserId = req.user.user_id;
  
  try {
    // Search for users by name or email with the search term
    // Exclude the current user from the results
    const result = await query(`
      SELECT 
        user_id, 
        name, 
        email,
        avatar_url,
        company,
        job_title
      FROM 
        users
      WHERE 
        (LOWER(name) LIKE $1 OR LOWER(email) LIKE $1)
        AND user_id != $2
      LIMIT 10
    `, [`%${term.toLowerCase()}%`, currentUserId]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({
      success: false,
      error: 'Error searching for users'
    });
  }
};

// Export the functions
module.exports = {
  searchUsers
};