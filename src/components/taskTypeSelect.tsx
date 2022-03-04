import { IdSelect } from "./idSelect";
import { useTaskTypes } from "utils/taskType";

export const TaskTypeSelect = (props: React.ComponentProps<typeof IdSelect>) => {
    // 获取task类型
    const { data: taskTypes } = useTaskTypes()
    return <IdSelect options={taskTypes || []} {...props}></IdSelect>
}