import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils";

interface State<T> {
  error: Error | null;
  data: T | null;
  state: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: State<null> = {
  state: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};
//判断 mountRef 组件是否被卸载
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

// initialState 接受用户传入的 state
export const useAsync = <T>(
  initialState?: State<T>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, initialConfig }; // 设置初始状态
  const [state, dispatch] = useReducer(
    (state: State<T>, action: Partial<State<T>>) => ({ ...state, ...action }),
    {
      // 默认值
      ...defaultInitialState,
      // 传入值
      ...initialState,
    }
  );
  const safeDispatch = useSafeDispatch(dispatch);
  // retry 状态控制 通过返回函数来初始化 有惰性 state
  const [retry, setRetry] = useState(() => () => {});
  // 正常响应 数据处理
  const setData = useCallback(
    (data: T) =>
      safeDispatch({
        data,
        state: "success",
        error: null,
      }),
    [safeDispatch]
  );
  // 有错误 处理
  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        state: "error",
        data: null,
      }),
    [safeDispatch]
  );
  // 主入口 run 触发异步请求
  const run = useCallback(
    (promise: Promise<T>, runConfig?: { retry: () => Promise<T> }) => {
      if (!promise || !promise.then) {
        // 验证传入数据类型是否为 Promise
        throw new Error("只能传入 Promise 类型数据");
      }
      // 重新刷新一次 返回上一次 run 执行时的函数
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      // 如果是 promise 则设置状态，开始 loading
      // 在这里 setState 会造成无限循环
      // 在 reducer 中会合并以前的状态和现在的状态
      safeDispatch({ state: "loading" });

      return promise
        .then(
          (data) => {
            setData(data);
            return data;
          },
          async (err) => {
            console.log("error");
            return Promise.reject(await err);
          }
        )
        .catch((err) => {
          setError(err);
          if (config.throwOnError) {
            return Promise.reject(err);
          }
          return Promise.reject(err);
        });
    },
    [config.throwOnError, safeDispatch, setData, setError]
  );
  // 返回指定的数据接口
  return {
    //请求状态
    isIdle: state.state === "idle",
    isLoading: state.state === "loading",
    isError: state.state === "error",
    isSuccess: state.state === "success",
    run, // 接收一个promise 对象，返回执行结果
    setData,
    setError,
    retry, // 被调用重新执行 run，让 state 更新
    ...state,
  };
};
