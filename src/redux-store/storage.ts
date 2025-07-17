import { WebStorage } from 'redux-persist';

const createNoopStorage = (): WebStorage => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage: WebStorage = (() => {
  if (typeof window === 'undefined') {
    return createNoopStorage();
  }
  
  try {
    const { createWebStorage } = require('redux-persist/lib/storage');
    return createWebStorage('local');
  } catch (error) {
    console.warn('Failed to create web storage, falling back to noop storage', error);
    return createNoopStorage();
  }
})();

export default storage;
