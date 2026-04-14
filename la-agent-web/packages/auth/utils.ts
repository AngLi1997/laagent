export const getItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};
export const setItem = (key: string, val: string) => {
  try {
    localStorage.setItem(key, val);
  } catch (error) {}
};
