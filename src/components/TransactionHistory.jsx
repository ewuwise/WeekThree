import {
  getENSAvatar,
  resolveENS
} from '../utils/ens';
import {
  queryTransfersFrom,
  queryTransfersTo
} from '../BMTverse/wallet';
import { useEffect, useState } from 'react';

import { useWeb3 } from '../context/Web3Context';

const TransactionHistory = () => {
  const { account, library } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    minAmount: '',
    timeRange: 'all',
    type: 'all' // burn/mint/transfer
  });
  const [isLoading, setIsLoading] = useState(false);
  const [displayNames, setDisplayNames] = useState({});
  const [avatars, setAvatars] = useState({});

  const fetchTransactions = async () => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      // Get transfers from the last 2000 blocks (~8 hours)
      const fromBlock = Math.max(0, await library.getBlockNumber() - 2000);
      
      // Query both incoming and outgoing transfers
      const outgoing = await queryTransfersFrom(account, fromBlock);
      const incoming = await queryTransfersTo(account, fromBlock);
      
      // Combine and sort by block number
      const allTransfers = [...outgoing, ...incoming]
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .map(tx => ({
          ...tx,
          direction: tx.from.toLowerCase() === account.toLowerCase() ? 'out' : 'in',
          timestamp: new Date().toLocaleString() // Will be updated with actual timestamp
        }));
      
      setTransactions(allTransfers);
      
      // Get actual block timestamps
      const blocks = await Promise.all(
        allTransfers.map(tx => library.getBlock(tx.blockNumber))
      );
      
      setTransactions(prev => prev.map((tx, i) => ({
        ...tx,
        timestamp: new Date(blocks[i].timestamp * 1000).toLocaleString()
      })));
      
    } catch (error) {
      console.error("Failed to fetch transfer history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const resolveNames = async () => {
      const names = {};
      for (const tx of transactions) {
        names[tx.to] = await resolveENS(tx.to, library);
        names[tx.from] = await resolveENS(tx.from, library);
      }
      setDisplayNames(names);
    };
    
    const fetchAvatars = async () => {
      const avatarMap = {};
      for (const tx of transactions) {
        avatarMap[tx.from] = await getENSAvatar(tx.from, library);
        avatarMap[tx.to] = await getENSAvatar(tx.to, library);
      }
      setAvatars(avatarMap);
    };

    if (transactions.length > 0) {
      resolveNames();
      fetchAvatars();
    }

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000); // Refresh every 30s
    
    return () => clearInterval(interval);
  }, [account, transactions]);

  const filteredTransactions = transactions.filter(tx => {
    // Amount filter
    if (filters.minAmount && parseFloat(tx.amount) < parseFloat(filters.minAmount)) {
      return false;
    }
    
    // Time filter
    const txDate = new Date(tx.timestamp);
    const now = new Date();
    const dayAgo = new Date(now - 86400000);
    const weekAgo = new Date(now - 604800000);
    
    if (filters.timeRange === 'day' && txDate < dayAgo) return false;
    if (filters.timeRange === 'week' && txDate < weekAgo) return false;
    
    // Type filter
    if (filters.type === 'burn' && tx.direction !== 'out') return false;
    if (filters.type === 'mint' && tx.direction !== 'in') return false;
    
    return true;
  });

  return (
    <div className="tx-history">
      <div className="filters">
        <select 
          value={filters.timeRange}
          onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
        >
          <option value="all">All Time</option>
          <option value="day">Last 24h</option>
          <option value="week">Last 7 Days</option>
        </select>
        
        <input
          type="number"
          placeholder="Min Amount (BMT)"
          value={filters.minAmount}
          onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
        />
        
        <select
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="all">All Types</option>
          <option value="burn">Burns Only</option>
          <option value="mint">Mints Only</option>
        </select>
      </div>

      <h3>Your BMT Token Transactions</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>To</th>
              <th>Value (BMT)</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, i) => (
              <tr key={i}>
                <td>
                  <a 
                    href={`https://etherscan.io/tx/${tx.hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {tx.hash.slice(0, 10)}...
                  </a>
                </td>
                <td>
                  {avatars[tx.to]?.url ? (
                    <img 
                      src={avatars[tx.to].url} 
                      alt="ENS Avatar" 
                      className="ens-avatar"
                    />
                  ) : (
                    <div className="default-avatar">
                      {tx.to?.slice(2, 4)}
                    </div>
                  )}
                  {displayNames[tx.to] || tx.to?.slice(0, 8)}...
                </td>
                <td className={tx.direction === 'out' ? 'outgoing' : 'incoming'}>
                  {tx.direction === 'out' ? '-' : '+'}{tx.amount} BMT
                </td>
                <td>{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;
