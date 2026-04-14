const TOKEN_STORAGE_KEY = 'BMOS-ACCESS-TOKEN';

export const normalizeToken = (token?: string | null) => {
  if (!token)
    return '';

  return token
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)[0] || '';
};

export const getStoredToken = () => {
  const rawToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const normalizedToken = normalizeToken(rawToken);

  if (rawToken !== normalizedToken) {
    if (normalizedToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken);
    }
    else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  return normalizedToken;
};
export const setStoredToken = (token?: string | null) => {
  const normalizedToken = normalizeToken(token);

  if (normalizedToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken);
  }
  else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  return normalizedToken;
};
