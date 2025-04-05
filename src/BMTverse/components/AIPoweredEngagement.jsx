import React, { useEffect, useState } from 'react';

import axios from 'axios'; // Importing axios for API calls

const AIPoweredEngagement = () => {
    const [insights, setInsights] = useState([]); // State to hold AI insights

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await axios.get('http://your-ai-api-url'); // Replace with your AI API URL
                setInsights(response.data);
            } catch (error) {
                console.error("Error fetching AI insights:", error);
            }
        };

        fetchInsights();
    }, []);
    
    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-4">AI-Powered Community Engagement</h1> 
            <div>
                {insights.map((insight, index) => (
                    <p key={index}>{insight}</p> // Displaying AI insights
                ))}
            </div>

            <h2 className="text-xl font-semibold">1. Hyper-Personalized Onboarding</h2>
            <p>AI Chatbot "BMT Guide": A conversational agent that adapts to user behavior.</p>
            <p>NFT Avatar Customization: AI suggests NFT traits based on users’ social media or wallet history.</p>

            <h2 className="text-xl font-semibold">2. Dynamic Content & Rewards</h2>
            <p>AI-Generated Quests: Customized missions to earn exclusive rewards.</p>
            <p>Sentiment Analysis Hooks: Detect community mood and auto-trigger events.</p>

            <h2 className="text-xl font-semibold">3. Predictive Community Moderation</h2>
            <p>Toxicity Filter + Meme Amplifier: AI flags negativity and boosts viral-worthy content.</p>
            <p>DAO Proposal Summarizer: AI condenses complex proposals into TL;DRs.</p>

            <h2 className="text-xl font-semibold">4. AI-Powered "Soulbound" Reputation</h2>
            <p>Users earn non-transferable AI badges based on activity.</p>

            <h2 className="text-xl font-semibold">5. Cross-Platform Unification</h2>
            <p>AI "Bridge Butler": Aggregates conversations into a digestible feed.</p>
        </div>
    );
};

export default AIPoweredEngagement;
