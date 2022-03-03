import React from "react";
import { Link } from "react-router-dom";
import { Navigate, Route, Routes, useLocation } from "react-router";
import styled from "@emotion/styled";
import { Menu } from "antd";
import { KanbanScreen } from "screens/kanban";
import { EpicScreen } from "screens/epic";

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;
const Main = styled.div`
  display: flex;
  box-shadow: -5px 0 -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 20rem 1fr;
`;
const useRouteType = () => {
  // 	返回当前的location 对象
  const utils = useLocation().pathname.split("/");
  // 得到最后的值，用来判断是看板还是任务组
  return utils[utils.length - 1];
};
export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={[routeType]}>
          <Menu.Item key="kanban">
            <Link to="kanban">看板</Link>
          </Menu.Item>
          <Menu.Item key="epic">
            <Link to="epic">任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path="/kanban" element={<KanbanScreen />} />
          <Route path="/epic" element={<EpicScreen />} />
        </Routes>
      </Main>
    </Container>
  );
};
