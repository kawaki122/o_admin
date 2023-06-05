import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useLocation, Link } from "react-router-dom";

import { routeKeys } from "../utils/constants";
import { useState } from "react";
const { Header, Sider, Content } = Layout;

function SideLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">OMedia</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[routeKeys[location.pathname]]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <Link to={"/dashboard"}>Dashboard</Link>,
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/location"}>Locations</Link>,
            },
            {
              key: "3",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/city"}>City</Link>,
            },
            {
              key: "4",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/brand"}>Brand</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 12,
            minHeight: window.innerHeight - 112,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default SideLayout;
