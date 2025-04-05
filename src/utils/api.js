import axios from 'axios';

// Existing API functions

// New API function to fetch personalized rewards
export const fetchPersonalizedRewards = async () => {
    try {
        const response = await axios.get('/api/personalized-rewards');
        return response.data;
    } catch (error) {
        console.error('Error fetching personalized rewards:', error);
        throw error;
    }
};
