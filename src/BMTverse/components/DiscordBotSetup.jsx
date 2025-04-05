import React from 'react';

const DiscordBotSetup = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Setting Up Your Discord Bot</h1>
            <h2 className="text-xl font-semibold">Key Steps to Set Up Your Bot</h2>
            
            <h3 className="text-lg font-semibold mt-4">1. Application Naming</h3>
            <p>Name: BMTverse AI (branded) or BMT Meme Machine (fun).</p>
            <p>Avoid generic names like "Bot" or "Discord Bot."</p>

            <h3 className="text-lg font-semibold mt-4">2. Bot Token & Permissions</h3>
            <p>Token: Found under Bot → Reset Token (keep this secret!).</p>
            <p>Enable Intents:</p>
            <ul className="list-disc pl-5">
                <li>Presence Intent</li>
                <li>Server Members Intent</li>
                <li>Message Content Intent (for commands like !meme)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">3. OAuth2 Invite Link</h3>
            <pre className="bg-gray-100 p-4 rounded">
                {`https://discord.com/oauth2/authorize?client_id=YOUR_APP_ID&permissions=YOUR_PERMISSIONS&scope=bot%20applications.commands`}
            </pre>

            <h3 className="text-lg font-semibold mt-4">4. Branding (Optional but Recommended)</h3>
            <p>Icon: Upload a 512x512px logo (e.g., BMTverse mascot).</p>
            <p>Description: "AI-powered meme battles, roasts, and $BMT rewards!"</p>

            <h2 className="text-xl font-semibold mt-4">Why These Settings Matter</h2>
            <p>Intents: Allow your bot to read messages, track votes, and analyze sentiment.</p>
            <p>Permissions: Ensure the bot can post memes, react to votes, and DM users.</p>
            <p>Naming: Makes your bot recognizable in the server member list.</p>

            <h2 className="text-xl font-semibold mt-4">Next Steps</h2>
            <p>Test the Bot: Invite it to a test server and try !meme.</p>
            <p>Debug: If commands fail, check:</p>
            <ul className="list-disc pl-5">
                <li>Token validity</li>
                <li>Intents enabled</li>
                <li>Bot has proper roles in your server</li>
            </ul>
        </div>
    );
};

export default DiscordBotSetup;
