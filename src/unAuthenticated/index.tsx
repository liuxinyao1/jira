import { LoginScreen } from "./login";
import { RegisterScreen } from "./register";
import { useState } from "react";
import { Button, Card, Divider } from "antd";
import styled from "@emotion/styled";
// 引入本地资源
import logo from "assets/logo.svg";
import left from "assets/left.svg";
import right from "assets/right.svg";
import { useDocumentTitle } from "../utils/index";
import { ErrorBox } from "../components/lib";

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(94, 108, 132);
`;
const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: left bottom, right bottom;
  background-size: calc(((100vw -40rem) / 2) - 3.2rem),
    calc(((100vw -40rem) / 2) - 3.2rem), cover;
  background-image: url(${left}), url(${right});
`;
const Header = styled.header`
  background: url(${logo}) no-repeat center;
  padding: 5rem 0;
  background-size: 8rem;
  width: 100%;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;
// 组件加样式，给Card组件更改样式
const ShadowCard = styled(Card)`
  width: 40rem;
  min-height: 56rem;
  padding: 3.2rem 4rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
`;

export const UnauthenticatedApp = () => {
  // 标识当前是注册还是登录，false 表示当前是登录状态
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // 自定义 hook 用来设置文档标题
  useDocumentTitle("jira 任务管理系统", false);
  return (
    <Container style={{ display: "flex", justifyContent: "center" }}>
      <Header />
      <Background />
      <ShadowCard>
        <Title>{isRegister ? "请注册" : "请登录"}</Title>
        <ErrorBox error={error} />
        {/* 判断展示登录页面还是注册页面 */}
        {isRegister ? (
          <RegisterScreen onError={setError} />
        ) : (
          <LoginScreen onError={setError} />
        )}
        <Divider />
        {/* 点击切换状态 */}
        <Button type={"link"} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "已经有账号了？直接登录" : "没有账号？注册新账号"}
        </Button>
      </ShadowCard>
    </Container>
  );
};
export const LongButton = styled(Button)`
  width: 100%;
`;
