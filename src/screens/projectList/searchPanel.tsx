import { Input, Form } from "antd";
import { Project } from "types/Project";
import { UserSelect } from "components/userSelect";
import User from "types/User";

interface SearchPanelProps {
  users: User[];
  // 和 project 中的类型保持一致
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: "2rem" }} layout="inline" action="">
      <Form.Item>
        <Input
          type="text"
          placeholder="项目名"
          value={param.name}
          onChange={(e) =>
            setParam({
              ...param,
              name: e.target.value,
            })
          }
        />
      </Form.Item>
      {/* 当下拉框选择内容时，触发onChange事件记录当前的id */}
      {/* 实质：通过id查找 */}
      <Form.Item>
        <UserSelect
          defaultOptionName="负责人"
          value={param.personId}
          onChange={(value) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        />
      </Form.Item>
    </Form>
  );
};
