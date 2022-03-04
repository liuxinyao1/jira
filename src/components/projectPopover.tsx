import styled from "@emotion/styled";
import { useProjects } from "utils/project";
import { ButtonNoPadding } from "./lib";
import { useProjectModel } from "screens/projectList/util";
import { Divider, List, Popover, Typography } from "antd";

const ContentContainer = styled.div`
  min-width: 30rem;
`;
export const ProjectPopover = () => {
  const { open } = useProjectModel();
  const { data: projects, refetch } = useProjects();
  // 筛选出收藏的项目
  const pinnedProjects = projects?.filter(cur => cur.pin);
  const content = <ContentContainer>
    <Typography.Text type = 'secondary'>收藏项目</Typography.Text>
    <List>
      {
        pinnedProjects?.map(item => <List.Item key = { item.id }>
          <List.Item.Meta title = { item.name } />
        </List.Item>)
      }
    </List>
    <Divider />
    <ButtonNoPadding type = 'link' onClick = { open }>创建项目</ButtonNoPadding>
  </ContentContainer>
  return <Popover
      placement = "bottom"
      content = { content }
      onVisibleChange={() => refetch()}
  >
    <span>项目</span>
  </Popover>;
};
