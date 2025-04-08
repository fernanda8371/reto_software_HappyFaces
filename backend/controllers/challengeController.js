const { query } = require('../config/db');

// Obtener todos los desafíos
const getAllChallenges = async (req, res) => {
  try {
    const result = await query(
      'SELECT challenge_id, title, description, difficulty, categories FROM challenges ORDER BY difficulty, title'
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting challenges:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener un desafío por ID
const getChallengeById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await query(
      'SELECT * FROM challenges WHERE challenge_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error getting challenge:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Crear un nuevo desafío (solo admin)
const createChallenge = async (req, res) => {
  const { title, description, difficulty, starter_code, test_cases, categories } = req.body;
  
  try {
    const result = await query(
      'INSERT INTO challenges (title, description, difficulty, starter_code, test_cases, categories) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, difficulty, starter_code, test_cases, categories]
    );
    
    res.status(201).json({
      message: 'Challenge created successfully',
      challenge: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Actualizar un desafío (solo admin)
const updateChallenge = async (req, res) => {
  const { id } = req.params;
  const { title, description, difficulty, starter_code, test_cases, categories } = req.body;
  
  try {
    const result = await query(
      'UPDATE challenges SET title = $1, description = $2, difficulty = $3, starter_code = $4, test_cases = $5, categories = $6, updated_at = CURRENT_TIMESTAMP WHERE challenge_id = $7 RETURNING *',
      [title, description, difficulty, starter_code, test_cases, categories, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.status(200).json({
      message: 'Challenge updated successfully',
      challenge: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Eliminar un desafío (solo admin)
const deleteChallenge = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Primero verificar si hay registros relacionados en user_challenges
    const relatedRecords = await query(
      'SELECT COUNT(*) FROM user_challenges WHERE challenge_id = $1',
      [id]
    );
    
    if (parseInt(relatedRecords.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete challenge because it has user attempts' 
      });
    }
    
    const result = await query(
      'DELETE FROM challenges WHERE challenge_id = $1 RETURNING challenge_id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.status(200).json({
      message: 'Challenge deleted successfully',
      challengeId: result.rows[0].challenge_id
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Enviar solución a un desafío
const submitSolution = async (req, res) => {
  const { id } = req.params;
  const { code } = req.body;
  const userId = req.user.user_id;
  
  try {
    // Obtener el desafío
    const challengeResult = await query(
      'SELECT * FROM challenges WHERE challenge_id = $1',
      [id]
    );
    
    if (challengeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Aquí iría la lógica para evaluar el código del usuario
    // (Esto sería más complejo en una implementación real, posiblemente usando
    // un servicio externo o un entorno aislado para ejecutar el código)
    const testsPassed = true; // Simulación de evaluación
    const score = 10; // Puntuación basada en la dificultad
    
    // Verificar si el usuario ya ha intentado este desafío
    const userChallengeResult = await query(
      'SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2',
      [userId, id]
    );
    
    if (userChallengeResult.rows.length === 0) {
      // Primer intento
      await query(
        'INSERT INTO user_challenges (user_id, challenge_id, user_code, completed, score, attempts, completed_at) VALUES ($1, $2, $3, $4, $5, 1, $6)',
        [userId, id, code, testsPassed, testsPassed ? score : 0, testsPassed ? 'CURRENT_TIMESTAMP' : null]
      );
    } else {
      // Actualizar intento existente
      await query(
        'UPDATE user_challenges SET user_code = $1, completed = $2, score = $3, attempts = attempts + 1, completed_at = $4 WHERE user_id = $5 AND challenge_id = $6',
        [code, testsPassed, testsPassed ? score : userChallengeResult.rows[0].score, testsPassed && !userChallengeResult.rows[0].completed ? 'CURRENT_TIMESTAMP' : userChallengeResult.rows[0].completed_at, userId, id]
      );
    }
    
    // Si el usuario completó el desafío, actualizar su puntuación total
    if (testsPassed) {
      await query(
        'UPDATE users SET total_score = total_score + $1 WHERE user_id = $2',
        [score, userId]
      );
    }
    
    res.status(200).json({
      success: testsPassed,
      score: testsPassed ? score : 0,
      message: testsPassed ? 'Challenge completed successfully!' : 'Some tests failed. Try again!'
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener desafíos de un usuario
const getUserChallenges = async (req, res) => {
  const userId = req.params.userId || req.user.user_id;
  
  try {
    const result = await query(
      `SELECT 
        uc.user_challenge_id, 
        uc.challenge_id, 
        c.title, 
        c.difficulty, 
        uc.completed, 
        uc.score, 
        uc.attempts, 
        uc.completed_at 
      FROM 
        user_challenges uc 
      JOIN 
        challenges c ON uc.challenge_id = c.challenge_id 
      WHERE 
        uc.user_id = $1
      ORDER BY 
        uc.completed_at DESC`,
      [userId]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting user challenges:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  submitSolution,
  getUserChallenges
};