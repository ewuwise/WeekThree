import React, { useEffect, useState } from 'react';

import PersonalizedRewards from './PersonalizedRewards';
import { useWeb3 } from '../context/Web3Context';

const TokenDashboard = () => {
    const { account, getBlockNumber, getBalance, formatEther } = useWeb3();
    const [blockNumber, setBlockNumber] = useState(0);
    const [balance, setBalance] = useState('0');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Get current block number
                const block = await getBlockNumber();
                setBlockNumber(block);

                // Get account balance if connected
                if (account) {
                    const weiBalance = await getBalance(account);
                    setBalance(formatEther(weiBalance));
                }
            } catch (error) {
                console.error('Error fetching blockchain data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [account, getBlockNumber, getBalance, formatEther]);

    return (
        <div className="token-dashboard">
            <h1>Token Dashboard</h1>
            
            <div className="blockchain-data">
                {isLoading ? (
                    <p>Loading blockchain data...</p>
                ) : (
                    <>
                        <div className="data-item">
                            <h3>Current Block</h3>
                            <p>{blockNumber.toLocaleString()}</p>
                        </div>
                        {account && (
                            <div className="data-item">
                                <h3>Your Balance</h3>
                                <p>{balance} ETH</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <PersonalizedRewards />
        </div>
    );
};

export default TokenDashboard;
