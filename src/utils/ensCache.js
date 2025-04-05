const STORAGE_KEY = "bmt-ens-cache";

const cache = {
  names: new Map(),
  avatars: new Map(),
  ttl: 1000 * 60 * 60 * 24 // 24 hours
};

const loadCache = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      names: new Map(saved.names || []),
      avatars: new Map(saved.avatars || []),
      ttl: 1000 * 60 * 60 * 24 // 24 hours
    };
  } catch (e) {
    return { names: new Map(), avatars: new Map(), ttl: 1000 * 60 * 60 * 24 };
  }
};

const saveCache = debounce(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    names: Array.from(cache.names.entries()),
    avatars: Array.from(cache.avatars.entries())
  }));
}, 1000);


export const getCachedENSName = async (address, provider) => {
  if (cache.names.has(address)) {
    const { name, timestamp } = cache.names.get(address);
    if (Date.now() - timestamp < cache.ttl) return name;
  }
  
  const name = await provider.lookupAddress(address) || address;
  cache.names.set(address, { name, timestamp: Date.now() });
  saveCache();
  return name;
};

  if (cache.names.has(address)) {
    const { name, timestamp } = cache.names.get(address);
    if (Date.now() - timestamp < cache.ttl) return name;
  }
  
  const name = await provider.lookupAddress(address) || address;
  cache.names.set(address, { name, timestamp: Date.now() });
  return name;
};

export const getCachedENSAvatar = async (address, provider) => {
  if (cache.avatars.has(address)) {
    const { avatar, timestamp } = cache.avatars.get(address);
    if (Date.now() - timestamp < cache.ttl) return avatar;
  }
  
  const avatar = await getENSAvatar(address, provider);
  cache.avatars.set(address, { avatar, timestamp: Date.now() });
  return avatar;
};
