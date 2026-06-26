const AUTH_KEY = "roommate_ai_auth";

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch {
    return null;
  }
};

export const getStoredToken = () => getStoredAuth()?.token || null;

export const setStoredAuth = (auth) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};
