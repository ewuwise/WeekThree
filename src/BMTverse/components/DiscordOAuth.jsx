import React from 'react';

const DiscordOAuth = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Discord OAuth2 Integration</h1>
            <h2 className="text-xl font-semibold">Authorization URL for Bot:</h2>

            <pre className="bg-gray-100 p-4 rounded">
                {`https://discord.com/oauth2/authorize?client_id=YOUR_APP_ID&permissions=YOUR_PERMISSIONS&scope=bot%20applications.commands`}

            </pre>
            <h2 className="text-xl font-semibold mt-4">Steps to Implement:</h2>
            <ol className="list-decimal pl-5">
                <li>Replace <code>YOUR_APP_ID</code> with your Discord application ID and <code>YOUR_PERMISSIONS</code> with the required permissions.</li>

                <li>Set the required permissions in the <code>PERMISSIONS</code> field.</li>
                <li>Use this URL to invite the bot to your server.</li>
            </ol>
            <h2 className="text-xl font-semibold mt-4">Permissions:</h2>
            <p>Ensure to select the appropriate permissions based on the bot's functionality, such as sending messages, managing roles, etc.</p>
        </div>
    );
};

export default DiscordOAuth;
