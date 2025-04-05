import { ethers } from 'ethers';

export const resolveENS = async (address, provider) => {
  if (!ethers.utils.isAddress(address)) return address;
  
  try {
    // Check if it's an ENS name first
    if (address.includes('.eth')) {
      const resolvedAddress = await provider.resolveName(address);
      return resolvedAddress || address;
    }
    
    // Reverse lookup for address
    const name = await provider.lookupAddress(address);
    return name || address;
  } catch (error) {
    console.error("ENS resolution error:", error);
    return address;
  }
};

export const getENSAvatar = async (addressOrName, provider) => {
  try {
    // First resolve to address if it's a name
    const address = addressOrName.includes('.eth') 
      ? await provider.resolveName(addressOrName)
      : addressOrName;
    
    if (!address) return null;
    
    // Check for avatar
    const resolver = await provider.getResolver(address);
    return await resolver?.getAvatar();
  } catch (e) {
    console.error("ENS avatar error:", e);
    return null;
  }
};
