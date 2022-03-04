import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { Button, Dropdown, Menu } from "antd";
import styled from "@emotion/styled";
import { useAuth } from "context/authContext";
import { Row, ButtonNoPadding } from "components/lib";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { resetRoute } from "utils";
import { ProjectModel } from "screens/projectList/projectModel";
import { ProjectScreen } from "screens/project";
import { ProjectListScreen } from "screens/projectList";
import { ProjectPopover } from "components/projectPopover";
import { UserPopover } from "components/userPopover";
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr 6rem;
  height: 100vh;
`;
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const Main = styled.main`
  display: flex;
  overflow: hidden;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"logout"}>
            <Button type={"link"} onClick={logout}>
              退出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button
        onClick={(e) => e.preventDefault()}
        type={"link"}
      >{`hi,${user?.name}`}</Button>
    </Dropdown>
  );
};
const PageHeader = () => (
  <Header between={true}>
    <HeaderLeft gap={true}>
      <ButtonNoPadding type={"link"} onClick={resetRoute}>
        <SoftwareLogo width={"18rem"} color={"rgb(38,132,255)"} />
      </ButtonNoPadding>
      <ButtonNoPadding />
      {/* 收藏列表 */}
      <ProjectPopover />
      {/* 用户列表 */}
      <UserPopover />
    </HeaderLeft>
    <HeaderRight>
      <User />
    </HeaderRight>
  </Header>
);
export const AuthenticatedApp = () => (
  <Container>
    <Router>
      <PageHeader />
      <Main>
        <Routes>
          <Route path={"/projects"} element={<ProjectListScreen />}></Route>
          <Route
            path={"/projects/:projectId/*"}
            element={<ProjectScreen />}
          ></Route>
          <Navigate to={"/projects"} />
        </Routes>
      </Main>
      <ProjectModel />
    </Router>
  </Container>
);
