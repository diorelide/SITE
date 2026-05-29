import { ref, readonly } from 'vue';

const user = ref(null);
const token = ref(null);

export function useAuth() {
  const setUser = (newUser, newToken) => {
    user.value = newUser;
    token.value = newToken;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const loadFromStorage = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Проверяем, что у пользователя есть роль
        if (parsedUser && (parsedUser.role === 'driver' || parsedUser.role === 'tourist')) {
          token.value = storedToken;
          user.value = parsedUser;
        } else {
          // Если роль некорректная, сбрасываем
          logout();
        }
      } catch (e) {
        logout();
      }
    } else {
      logout();
    }
  };

  const isDriver = () => user.value?.role === 'driver';
  const isTourist = () => user.value?.role === 'tourist';

  return {
    user: readonly(user),
    token: readonly(token),
    isDriver,
    isTourist,
    setUser,
    logout,
    loadFromStorage,
  };
}