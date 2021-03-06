import React, { ReactNode } from "react";
import { useQueryClient } from "react-query";
import User from "types/User";
import * as auth from "authProvider";
import { useMount } from "utils/index";
import { useAsync } from "utils/useAsync";
import { http } from "utils/http";
import { FullPageLoading, FullPageErrorFallback } from "components/lib";

// 定义 auth表单的接口
interface AuthForm {
  username: string;
  password: string;
}
// 创建 user 的 context 容器
const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
// 设置在 devtools 中的名字
AuthContext.displayName = "AuthContext";
// 定义一个初始化 user 的函数
// 保持用户登录状态，在组件挂载的时候就调用
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken(); // 从本地取出 token
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};
// 在这里我们需要明确 context 的用法
// 1. 使用 context 下的 provider 来包裹子元素，通过 value 值来传递数据给子元素
// 2. 在这里我们采用的是接收一个 children 的方式，这样传入进来的 children 节点都能够使用到 authContext 中的共享数据
// 3. 这里看起来比较复杂其实是因为 ts 需要有严格的类型限制，这里需要对每个函数，值，进行类型设置，所以看起来很复杂
// 4. 我们通过调用 AuthProvider 方法，来接收一个 node 参数，返回一个 provider
// 5. 这样我们只要通过调用这个方法，就能让传入的节点拥有 authContext 的共享数据
// 6. 在这个函数里封装了一个useMount方法，当组件挂载时会调用进行初始化页面
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 设置一个user变量 ，由于user 的类型由初始化的类型而定，但不能是 null ，我们需要进行类型断言
  // const [user, setUser] = useState<User | null>(null)
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  const queryClient = useQueryClient();
  // 设置三个函数 登录 注册 登出
  // setUser 是一个简写的方式 原先是：user => setUser(user)
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      // 清除数据缓存
      queryClient.clear();
    });
  // 当组件挂载时，初始化 user
  useMount(() => {
    run(bootstrapUser());
  });
  // 当初始化和加载中的时候显示loading
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }
  // 返回一个 context 容器
  // 这个组件挂载了一个
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, logout, register }}
    />
  );
};
// 包装成一个自定义的 hook ，用来创建一个 AuthContext 容器
// 在调用这个 hook 的时候，就相当于在子节点中声明一个 context
// 也就是说只要我们调用这个 useAuth 就能获取数据了
export const useAuth = () => {
  // 由于在使用 context 时，需要在子节点中声明一下这个 context
  const context = React.useContext(AuthContext);
  // 如果这个 context 不存在
  if (!context) {
    throw new Error("useAuth必须在 context 中使用");
  }
  // 返回这个 context 数据中心
  return context;
};
