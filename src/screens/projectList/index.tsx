import React from "react";
import { Button } from "antd";
import styled from "@emotion/styled";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useDocumentTitle } from "utils";
import { ErrorBox, Row } from "components/lib";
import { useDebounce } from "utils";
import { List } from "./list";
import { SearchPanel } from "./searchPanel";
import { useProjectsSearchParams, useProjectModel } from "./util";

const Container = styled.div`
  padding: 3.2rem;
  flex: 1;
  overflow-y: scroll;
`;
export const ProjectListScreen = () => {
  useDocumentTitle("项目列表", false);
  const [param, setParam] = useProjectsSearchParams();
  const { open } = useProjectModel();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();
  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <Button onClick={open}>创建项目</Button>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {/* 如果error 采用 antd 组件 */}
      {/* 未解决error丢失问题 初步判断是由异步事件引起 */}
      <ErrorBox error={error} />
      {/* 采用一个组件来解决 */}
      {/* {error ? <Typography.Text type={'danger'}>{error?.message + '错误'}</Typography.Text> : null} */}
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};
