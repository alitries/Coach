const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

export const fetchRecreationalActivities = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(`${BASE_URL}/find_activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    throw error;
  }
};
