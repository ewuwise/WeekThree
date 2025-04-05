import React from 'react';

const MemeCommandImplementation = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">/meme Command Implementation</h1>
            <h2 className="text-xl font-semibold">Step 1: Setup & Dependencies</h2>
            <pre className="bg-gray-100 p-4 rounded">
                {`pip install discord.py openai requests python-dotenv firebase-admin`}
            </pre>
            <h2 className="text-xl font-semibold mt-4">.env File:</h2>
            <pre className="bg-gray-100 p-4 rounded">
                {`DISCORD_TOKEN=your_bot_token_here
OPENAI_API_KEY=your_openai_key_here
FIREBASE_CREDS=path/to/firebase.json`}
            </pre>

            <h2 className="text-xl font-semibold mt-4">Step 2: Bot Code (bot.py)</h2>
            <pre className="bg-gray-100 p-4 rounded">
                {`import os
import discord
from discord.ext import commands
import openai
import firebase_admin
from firebase_admin import db
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Initialize Firebase (for meme storage)
cred = firebase_admin.credentials.Certificate(os.getenv("FIREBASE_CREDS"))
firebase_admin.initialize_app(cred, {'databaseURL': 'your_firebase_db_url'})

# Initialize OpenAI + Discord
openai.api_key = os.getenv("OPENAI_API_KEY")
bot = commands.Bot(command_prefix="!", intents=discord.Intents.all())

# Generate DALL-E memes
def generate_meme(prompt):
    response = openai.Image.create(
        prompt=f"Funny crypto meme about: {prompt}. Style: Pepe, Wojak, Trollface.",
        n=1,
        size="1024x1024"
    )
    return response['data'][0]['url']

# /meme command
@bot.command(name='meme')
async def meme(ctx, *, prompt):
    # Generate 3 variants
    meme_urls = [generate_meme(prompt + f" variant {i+1}") for i in range(3)]
    
    # Post meme grid
    embed = discord.Embed(title=f"**{ctx.author.name}'s Meme Battle**", description=f"*'{prompt}'*")
    for i, url in enumerate(meme_urls):
        embed.add_field(name=f"Option {i+1}", value="⬇️", inline=True)
        embed.set_image(url=url)
    
    msg = await ctx.send(embed=embed)
    
    # Add reactions for voting
    for emoji in ["1️⃣", "2️⃣", "3️⃣"]:
        await msg.add_reaction(emoji)
    
    # Store meme data in Firebase
    ref = db.reference(f'memes/{msg.id}')
    ref.set({
        'author': ctx.author.id,
        'prompt': prompt,
        'urls': meme_urls,
        'votes': {1: 0, 2: 0, 3: 0}
    })

# On reaction (vote tally)
@bot.event
async def on_reaction_add(reaction, user):
    if user.bot:
        return
    
    # Check if reaction is on a meme battle message
    ref = db.reference(f'memes/{reaction.message.id}')
    meme_data = ref.get()
    
    if meme_data:
        vote = int(reaction.emoji[0])  # 1️⃣ → 1
        ref.update({f'votes/{vote}': meme_data['votes'].get(vote, 0) + 1})

# Winner check (run daily)
async def declare_winner(message_id):
    ref = db.reference(f'memes/{message_id}')
    meme_data = ref.get()
    if meme_data:
        winning_idx = max(meme_data['votes'], key=meme_data['votes'].get)
        winning_url = meme_data['urls'][winning_idx - 1]
        channel = bot.get_channel(meme_data['channel_id'])
        await channel.send(
            f"**🏆 Winner!** <@{meme_data['author']}>’s meme #{winning_idx} won!\n"
            f"Minting NFT... (Coming soon!)\n{winning_url}"
        )

bot.run(os.getenv("DISCORD_TOKEN"))`}
            </pre>

            <h2 className="text-xl font-semibold mt-4">Step 3: Add Roasts</h2>
            <pre className="bg-gray-100 p-4 rounded">
                {`ROASTS = [
    "Your takes are so cold, they’re lowering global warming. Here’s a ‘Shillproof Vest’ NFT for protection. 🔥",
    "I’d call you a whale, but even whales have self-respect. Want a ‘Bagholder Badge’ NFT to commemorate this moment? 🎒",
    "You’re crying over gas fees? My grandma moves faster on dial-up. Here’s a ‘404 Patience Not Found’ NFT. 🐌",
    "You’re not ‘early’—you’re just lost. Mint this ‘Exit Liquidity VIP Pass’ and embrace your destiny. 🎟️",
    "Your code has more forks than a Denny’s. This ‘Ctrl+C Medal’ NFT is the only award you’ll ever win. 🏅"
]`}
            </pre>
        </div>
    );
};

export default MemeCommandImplementation;
