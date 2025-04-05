const express = require('express');
const router = express.Router();

// Mock data for personalized rewards
const rewardsData = [
    { userId: 1, rewards: [{ description: 'Reward 1', value: 100 }, { description: 'Reward 2', value: 200 }] },
    { userId: 2, rewards: [{ description: 'Reward 3', value: 150 }, { description: 'Reward 4', value: 250 }] },
];

// Endpoint to fetch personalized rewards
router.get('/personalized-rewards', (req, res) => {
    const userId = parseInt(req.query.userId);
    const userRewards = rewardsData.find(user => user.userId === userId);
    
    if (userRewards) {
        res.json(userRewards.rewards);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
