const cache = new Map();

/**
 * @param {string} key
 * @param {any} value
 * @param {number} ttl - time to live in ms
 */
export const setCache = (key, value, ttl = 10 * 60 * 1000) => {
  const expiry = Date.now() + ttl;
  cache.set(key, { value, expiry });
};

export const getCache = (key) => {
  const cached = cache.get(key);

  if (!cached) return null;

  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }

  return cached.value;
};
