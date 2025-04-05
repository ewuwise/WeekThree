import React, { useState } from 'react';

import { useWeb3Context } from '../context/Web3Context';

const BurnToMint = () => {
    const { contract } = useWeb3Context();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleBurn = async () => {
        setLoading(true);
        setMessage('');
        try {
            const tx = await contract.burnToMintNFT(amount, "ipfs://QmXYZ123");
            await tx.wait();
            setMessage('NFT minted successfully!');
        } catch (error) {
            setMessage('Error minting NFT: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Burn to Mint NFT</h2>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Amount to burn" 
            />
            <button onClick={handleBurn} disabled={loading}>
                {loading ? 'Processing...' : 'Burn and Mint NFT'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default BurnToMint;
