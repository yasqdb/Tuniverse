export const saveUser = (user) => {
  localStorage.setItem("token", user.token);
  localStorage.setItem("userId", user._id);
};

export const getToken = () => localStorage.getItem("token");

export const getUserId = () => localStorage.getItem("userId");

export const logout = () => localStorage.clear();
