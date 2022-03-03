import qs from "qs";
import { useCallback } from "react";
import * as auth from "authProvider";
import { useAuth } from "context/authContext";

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET", // 默认 get 后面的 customConfig 会覆盖掉
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "content-Type": data ? "application/json" : "",
    },
    // 解构其他属性 覆盖默认值
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    //拼接请求路径
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {}); // 请求的 body 为传入数据
  }

  return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (res) => {
    if (res.status === 401) {
      await auth.logout();
      window.location.reload(); //刷新页面
      return Promise.reject({ message: "请重新登录" });
    }
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export const useHttp = () => {
  const { user } = useAuth();
  // Parameters 在后面会讲到
  // 先解构数组得到2个值，再将数组解构出来这样可以实现，接收值，而不是数组
  // 这是一个箭头函数，接受两个值，一个是 endpoint 一个是 config ，返回的是一个 fetch 对象
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
};
