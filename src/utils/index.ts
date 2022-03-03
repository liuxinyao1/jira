import Title from 'antd/lib/skeleton/Title';
import { useState, useEffect, useRef } from 'react';

// unknow 传入同 any 使用有限制
export const isFalsy = (value: unknown) => value === 0 ? false : !value;
export const isVoid = (value: unknown) => value === undefined || value === null || value === '';
// 清除 value 为空的键值对
export const cleanObject = (object: { [key: string]: unknown }) => {
    /* 
    * interface resultProps {
    *     [key: string]: string
    * }
    */
    const result = {
        ...object
    } 
    Object.keys(result).forEach((cur) => {
        const val = result[cur];
        if (isVoid(val)) {
            delete result[cur];
        }
    })
    return result;
}
//组件挂载时执行一次
export const useMount = (callback: () => void) => {
    useEffect(() => {
        callback();
        // 依赖项中加入 callback 造成无限循环
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export const useDebounce = <V>(value: V, delay?: number): any => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay])
    return debouncedValue;
}
// 添加 title
export const useDocumentTitle = (title: string, keepOnUnmount: boolean = true) => {
    const oldTitle = useRef(document.title).current;
    // 利用 useRef 自定义 hook 它会一直帮我们保存好这个 title值，不会改变，
    useEffect(() => {
        document.title = title;
    }, [title]);
    // 页面卸载时，重新设置为原来的 title
    useEffect(() => {
        // 利用闭包不指定依赖得到的永远是旧title ，是代码初次运行时的 oldTitle
        // 不利于别人阅读
        return () => {
            if (!keepOnUnmount) {
                document.title = oldTitle;
            }
        }
    }, [keepOnUnmount, oldTitle]);
}
// 返回组件的挂载状态， 若未挂载或者已卸载，返回 false
export const useMountedRef = () => {
    const mountedRef = useRef(false);
    // 监听组件状态
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        }
    });
    return mountedRef;
}
// 重定向路由
export const resetRoute = () => window.location.href = window.location.origin;