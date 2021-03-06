import User from "types/User";

const apiUrl = process.env.REACT_APP_API_URL;
const localStorageKey = "__auth_provider_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);
// 处理响应，重新设置 token 键
export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || "");
  return user;
};
//用户登录 调用函数设置 token
export const login = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    } else {
      throw Promise.reject(await res.json);
    }
  });
};
//用户注册，同时注册一个 token
export const register = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    } else {
      throw Promise.reject(await res.json());
    }
  });
};

export const logout = async () =>
  window.localStorage.removeItem(localStorageKey);
