import React from 'react';

const MemeCommand = () => {
    const handleMemeSubmission = async (prompt) => {
        // Logic to handle meme submission and reward distribution
        const memeUrls = [generate_meme(prompt + `v${Math.random()}`)]; // Example logic
        await distributeRewards(memeUrls);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">/meme Command</h1>
            <h2 className="text-xl font-semibold">Stack:</h2>
            <ul className="list-disc pl-5">
                <li>Backend: Discord.py + OpenAI API (DALL-E 3)</li>
                <li>Database: Firebase (store meme hashes + votes)</li>
                <li>Web3: Pinata/IPFS (NFT metadata)</li>
            </ul>


            <h2 className="text-xl font-semibold mt-4">Creative Edge:</h2>
            <button onClick={() => handleMemeSubmission("Your meme prompt here")}>Submit Meme</button>

            <pre className="bg-gray-100 p-4 rounded">
                {`@bot.command(name='meme')
async def meme(ctx, *, prompt):
    # 1. Generate 3 DALL-E variants
    meme_urls = [generate_meme(prompt + f"v{i}") for i in range(3)]
    
    # 2. Post meme grid with reactions (1️⃣, 2️⃣, 3️⃣)
    msg = await ctx.send(f"**{ctx.author.name}’s Meme Battle**:\nVote for your favorite!")
    for i, url in enumerate(meme_urls):
        await msg.add_reaction(f"{i+1}️⃣")
    
    # 3. After 24h, tally votes → mint winner as NFT
    winning_meme = get_winner(msg.id)
    await ctx.send(f"**🏆 Winner!** Minting your NFT... {winning_meme}")
    mint_nft(winning_meme, ctx.author.id)  # Uses connected wallet`}
            </pre>

            <h2 className="text-xl font-semibold mt-4">Twist:</h2>
            <p>Add !meme lore to let users write backstories for memes (stored in NFT metadata).</p>

            <p>Add !meme lore to let users write backstories for memes (stored in NFT metadata).</p>
        </div>
    );
};

export default MemeCommand;
