// Ethers.js CDN setup for web3 functionality
export const initializeEthers = async () => {
  let ethers;
  
  // Check if ethers is already loaded via script tag
  if (window.ethers) {
    ethers = window.ethers;
  } 
  // Otherwise use dynamic import
  else {
    const module = await import('https://cdn.ethers.io/lib/ethers-5.2.esm.min.js');
    ethers = module.ethers;
  }
  
  // Initialize provider and signer
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  return {
    ethers,
    provider,
    signer
  };
};
