import { useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject } from "utils";

export const useSetUrlSearchParam = () => {
  // 通过这个单独得 hook 来 set search param
  // 把输入框的内容映射到 url 地址上
  const [searchParams, setSearchParams] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;

    return setSearchParams(o);
  };
};
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  // 返回页面 url 中的 query
  // 设置一个泛型 K 用来接收传入的参数类型
  // 对于泛型的理解，我们这里接收的参数的形参叫做 keys，它的类型是一个 K[],
  //  当我们传入值是，那个值的值会作为 参数 keys 传入，类型会作为 K[]被接收
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  // 返回一个数组，第一个是 值，第二个是改变值得方法，相当于这里重写了一个 useState
  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      [keys, searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      // 把 fromEntries 转化为一个对象
      return setSearchParams(params);
    },
  ] as const;
};
