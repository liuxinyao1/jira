import { List, Popover, Typography } from "antd";
import styled from "@emotion/styled";
import { useUsers } from "utils/user";

const ContentContainer = styled.div`
    min-width: 30rem;
`;
export const UserPopover = () => {
  const { data: users, refetch } = useUsers()
    // 筛选出收藏的项目
  const content = <ContentContainer>
      <Typography.Text type={"secondary"} >用户列表</Typography.Text>
      <List>
          {
              users?.map(user => <List.Item key={user.id}>
                  <List.Item.Meta title={user.name} />
              </List.Item>)
          }
      </List>
  </ContentContainer>  
  return <Popover 
    onVisibleChange={() => refetch()}
    placement='bottom'
    content={content} 
  >
    <span>用户</span>
  </Popover>
};
