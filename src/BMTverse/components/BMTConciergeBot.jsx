import React from 'react';

const BMTConciergeBot = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">BMT Concierge Bot</h1>
            <h2 className="text-xl font-semibold">Features:</h2>
            <ul className="list-disc pl-5">
                <li>Sentiment Triggers: Auto-respond to keywords.</li>
                <li>Reward System: Users earn points for constructive posts.</li>
                <li>Meme Battles: Generate memes based on trending topics.</li>
                <li>AI "Suggestion Box": Users submit ideas for DAO proposals.</li>
            </ul>
            <h2 className="text-xl font-semibold mt-4">Metrics to Track:</h2>
            <ul className="list-disc pl-5">
                <li>Engagement rate</li>
                <li>Sentiment shift</li>
                <li>Reward redemption</li>
            </ul>
        </div>
    );
};

export default BMTConciergeBot;
