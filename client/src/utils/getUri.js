export const getRedirectUri = (params) =>
  `${import.meta.env.NODE_ENV === "dev" ? "http://localhost:5173" : import.meta.env.VITE_CLIENT_URL}${params}`;

export const getApiUri = (params) =>
  `${import.meta.env.NODE_ENV === "dev" ? "http://localhost:3000" : import.meta.env.VITE_SERVER_URL}${params}`;