import { getToken } from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Search for users to add as teammates
export const fetchUsers = async (searchTerm = '') => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Updated endpoint to match our new route
    const response = await fetch(`${API_URL}/users/search?term=${encodeURIComponent(searchTerm)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error searching for users');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching for users:', error);
    throw error;
  }
};

// Submit a team solution
export const submitTeamSolution = async ({ challengeId, code, language, teammates, notes }) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Extract just the user IDs from teammates objects
    const teammateIds = teammates.map(teammate => teammate.user_id);
    
    const response = await fetch(`${API_URL}/challenges/${challengeId}/submit-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        code,
        language,
        collaborators: teammateIds,
        notes
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error submitting team solution');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error submitting team solution:', error);
    throw error;
  }
};