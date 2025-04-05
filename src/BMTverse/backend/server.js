const express = require('express');
const { exec } = require('child_process'); // Import exec to run shell commands
const app = express();
const port = 3000;

app.use(express.json());

app.post('/verify', async (req, res) => {
    const { wallet, discordId } = req.body;
    // Logic to verify wallet and assign Discord role
    if (await verifyWallet(wallet)) {
        await addDiscordRole(discordId, 'Verified');
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Wallet verification failed.' });
    }
});

// Start the bot using PM2
exec('pm2 start bot.py --interpreter python3', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error starting bot: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Bot started: ${stdout}`);
});

app.get('/api/token-metrics', (req, res) => {
    // Placeholder for token metrics data
    res.json({
        totalSupply: 1000000,
        burnRate: 0.05,
        mintingRewards: 100
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
