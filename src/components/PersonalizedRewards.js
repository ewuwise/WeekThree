import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PersonalizedRewards = () => {
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const response = await axios.get('/api/personalized-rewards');
                setRewards(response.data);
            } catch (error) {
                console.error('Error fetching personalized rewards:', error);
            }
        };

        fetchRewards();
    }, []);

    return (
        <div>
            <h2>Your Personalized Rewards</h2>
            <ul>
                {rewards.map((reward, index) => (
                    <li key={index}>{reward.description} - {reward.value}</li>
                ))}
            </ul>
        </div>
    );
};

export default PersonalizedRewards;
