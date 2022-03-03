import { Project } from "types/Project";
import { useHttp } from "./http";
import { useMutation, useQuery, QueryKey } from "react-query";
import {
  useEditConfig,
  useAddConfig,
  useDeleteConfig,
} from "./useOptimisticOptions";
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};
// 获取项目详情
export const useProject = (id?: number) => {
  const client = useHttp();
  // 第三个参数为配置参数，用来规定一些东西，比如这里就规定了 enable 用来指定 id 必传
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id),
    }
  );
};
//  处理收藏的请求
// 由于 hook 只能在最顶部调用，不能在组件内部调用，因此这里不能传递参数
export const useEditProject = (queryKey: QueryKey) => {
  // 引入两个方法
  // 这里暴露其他的属性，供后面的使用
  const client = useHttp();
  // 实现乐观更新
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
    // 第二个参数设置刷新
  );
};
// 处理添加请求
export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    useAddConfig(queryKey)
  );
};
// 删除
export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    // 这里我没有出现问题，视频出现了问题
    // 直接（id:number)
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
