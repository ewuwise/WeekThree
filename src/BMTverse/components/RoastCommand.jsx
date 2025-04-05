import React from 'react';

const RoastCommand = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">!roast Command</h1>
            <h2 className="text-xl font-semibold">Roast List:</h2>
            <pre className="bg-gray-100 p-4 rounded">
                {`ROASTS = [
    "Your takes are so cold, they’re lowering global warming. Here’s a ‘Shillproof Vest’ NFT for protection. 🔥",
    "I’d call you a whale, but even whales have self-respect. Want a ‘Bagholder Badge’ NFT? 🎒",
    "You’re crying over gas fees? My grandma moves faster on dial-up. Here’s a ‘404 Patience Not Found’ NFT. 🐌",
    "You’re not ‘early’—you’re just lost. Mint this ‘Exit Liquidity VIP Pass’ and embrace your destiny. 🎟️",
    "Your code has more forks than a Denny’s. This ‘Ctrl+C Medal’ NFT is the only award you’ll ever win. 🏅"
]`}
            </pre>

            <h2 className="text-xl font-semibold mt-4">Command Implementation:</h2>
            <pre className="bg-gray-100 p-4 rounded">
                {`@bot.command(name='roast')
async def roast(ctx):
    target = ctx.author.mention  # Roast the command user
    await ctx.send(f"{target}, {random.choice(ROASTS)}")`}
            </pre>

            <h2 className="text-xl font-semibold mt-4">Testing:</h2>
            <p>Type !roast in Discord → Bot fires a savage burn.</p>
        </div>
    );
};

export default RoastCommand;
