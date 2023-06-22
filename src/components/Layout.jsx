import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  NotificationOutlined,
  BarsOutlined,
  TagsOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, message, theme } from "antd";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { routeKeys } from "../utils/constants";
import { useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCity, faPersonBiking } from "@fortawesome/free-solid-svg-icons";
import { handleLogout } from "../utils/helpers";
const LocalizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(LocalizedFormat);
const { Header, Sider, Content } = Layout;

function SideLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleDropSelect = (e) => {
    if(Number(e.key) === 2) {
      handleLogout().then(() => {
        navigate("/login")
      }).catch(() => {
        messageApi.open({
          type: 'error',
          content: "Logout failed",
        });
        console.log("Error logong out")
      })
    }
  }

  return (
    <Layout>
      {contextHolder}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">OMedia</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[routeKeys[location.pathname]]}
          items={[
            {
              key: "1",
              icon: <BarChartOutlined />,
              label: <Link to={"/"}>Dashboard</Link>,
            },
            {
              key: "2",
              icon: <EnvironmentOutlined />,
              label: <Link to={"/location"}>Locations</Link>,
            },
            {
              key: "3",
              icon: <NotificationOutlined />,
              label: <Link to={"/campaign"}>Campaigns</Link>,
            },
            {
              key: "4",
              icon: <FontAwesomeIcon icon={faCity} color="gray" />,
              label: <Link to={"/city"}>Cities</Link>,
            },
            {
              key: "5",
              icon: <TagsOutlined />,
              label: <Link to={"/brand"}>Brands</Link>,
            },
            {
              key: "6",
              icon: <FontAwesomeIcon icon={faPersonBiking} color="gray" />,
              label: <Link to={"/rider"}>Riders</Link>,
            },
            {
              key: "7",
              icon: <BarsOutlined />,
              label: <Link to={"/task"}>Tasks</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
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
          <Space style={{marginRight: '30px'}}>
            <Dropdown
              menu={{
                items: [
                  { key: "1", label: "My Profile" },
                  { key: "2", label: "Logout", icon: <LogoutOutlined /> },
                ],
                onClick: handleDropSelect
              }}
              placement="bottomRight"
            >
              <Avatar size={30} icon={<UserOutlined />} />
            </Dropdown>
          </Space>
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
