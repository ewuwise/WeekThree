import './MessageSigner.css';

import { ethers } from 'ethers';
import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const MessageSigner = () => {
  const { 
    account,
    signMessage,
    signTypedData,
    verifyMessage,
    lastSignature,
    lastVerifiedAddress
  } = useWeb3();

  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verifiedAddress, setVerifiedAddress] = useState('');
  const [typedData, setTypedData] = useState({
    domain: {
      name: 'BMTverse',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    },
    types: {
      Message: [
        { name: 'content', type: 'string' }
      ]
    },
    value: {
      content: 'Sample typed data message'
    }
  });

  const handleSignMessage = async () => {
    if (!message) return;
    const sig = await signMessage(message);
    setSignature(sig);
    setVerifiedAddress('');
  };

  const handleVerifyMessage = async () => {
    if (!message || !signature) return;
    const address = await verifyMessage(message, signature);
    setVerifiedAddress(address);
  };

  const handleSignTypedData = async () => {
    const sig = await signTypedData(typedData.domain, typedData.types, typedData.value);
    setSignature(sig);
    setVerifiedAddress('');
  };

  if (!account) {
    return <div className="message-signer-notice">Connect your wallet to sign messages</div>;
  }

  return (
    <div className="message-signer">
      <h3>Message Signing</h3>
      
      <div className="message-input">
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message to sign"
        />
        <button onClick={handleSignMessage}>Sign Message</button>
      </div>

      <div className="typed-data-section">
        <h4>Typed Data (EIP-712)</h4>
        <button onClick={handleSignTypedData}>Sign Typed Data</button>
      </div>

      {signature && (
        <div className="signature-result">
          <h4>Signature:</h4>
          <p className="signature">{signature}</p>
          <button onClick={handleVerifyMessage}>Verify</button>
        </div>
      )}

      {verifiedAddress && (
        <div className="verification-result">
          <h4>Verified Address:</h4>
          <p>{verifiedAddress}</p>
          <p>{verifiedAddress.toLowerCase() === account.toLowerCase() 
            ? '✅ Signature matches connected wallet'
            : '❌ Signature does not match'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageSigner;
