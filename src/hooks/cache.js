// cache.js
let cache = {};

export const getCache = (key) => cache[key];

export const setCache = (key, data) => {
    cache[key] = data;
};

export const clearCache = () => {
    cache = {};
};
