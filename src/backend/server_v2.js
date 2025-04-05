const express = require('express');
const bodyParser = require('body-parser');
const personalizedRewardsRouter = require('./personalizedRewards');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Use the personalized rewards router
app.use('/api', personalizedRewardsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
