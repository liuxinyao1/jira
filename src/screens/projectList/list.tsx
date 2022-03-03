import { Dropdown, Menu, Modal, Table, TableProps } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Project } from "types/Project";
import User from "types/User";
import { Pin } from "components/pin";
import { useEditProject, useDeleteProject } from "utils/project";
import { useProjectModel, useProjectsQueryKey } from "./util";
import { ButtonNoPadding } from "components/lib";

interface ListProps extends TableProps<Project> {
  users: User[];
  refresh?: () => void;
}

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModel();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "你确定删除项目吗？",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={editProject(project.id)} key={"edit"}>
            <ButtonNoPadding type={"link"}>编辑</ButtonNoPadding>
          </Menu.Item>
          <Menu.Item
            onClick={() => confirmDeleteProject(project.id)}
            key={"delete"}
          >
            <ButtonNoPadding type={"link"}>删除</ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"} />
    </Dropdown>
  );
};
// type PropsType = Omit<ListProps, 'users'>
// 人员列表表单
// List 组件中传入的类型就是 TableProps 类型，也就是说，props的类型是tableprops
export const List = ({ users, ...props }: ListProps) => {
  // 引入自定义 hook 中的方法
  // 编辑收藏状态，mutate 为同步乐观更新
  const { mutate } = useEditProject(useProjectsQueryKey());
  // 指定修改的pin id 即可
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  return (
    <Table
      rowKey={"id"}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            // 这里需要发送编辑请求
            return (
              <Pin
                checked={project.pin}
                // 利用柯里化技术，首先传入 id ,在传入pin ，最后执行 mutate
                onCheckedChange={
                  // mutate({ id: project.id, pin })
                  pinProject(project.id)
                }
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            // overlay 是默认显示的东西,Menu是菜单，下拉菜单
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};
