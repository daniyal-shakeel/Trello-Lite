export const getRedirectUri = (params) =>
  `${import.meta.env.VITE_CLIENT_URL}${params}`;

export const getApiUri = (params) =>
  `${import.meta.env.VITE_SERVER_URL}${params}`;