
export const clearLocalStorage = () => {
  localStorage.removeItem('session');
  localStorage.removeItem('dashboard-store');
};
