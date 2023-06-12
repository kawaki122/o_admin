import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useLocation, Link } from "react-router-dom";
import { routeKeys } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/dbConfig";
import { setCities } from "../store/slices/citySlice";
import { setBrands } from "../store/slices/brandSlice";
import { setCampaigns } from "../store/slices/campaignSlice";
const { Header, Sider, Content } = Layout;

function SideLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    Promise.all([
      getDocs(collection(db, "cities")),
      getDocs(collection(db, "brands")),
      getDocs(collection(db, "campaigns")),
    ])
      .then((response) => {
        const [citySnapshot, brandSnapshot, campaignSnapshot] = response;
        dispatch(
          setCities(
            citySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              key: doc.id,
            }))
          )
        );
        dispatch(
          setBrands(
            brandSnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              key: doc.id,
            }))
          )
        );
        dispatch(
          setCampaigns(
            campaignSnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              key: doc.id,
            }))
          )
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }, [dispatch]);

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
              label: <Link to={"/campaign"}>Campaigns</Link>,
            },
            {
              key: "4",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/city"}>City</Link>,
            },
            {
              key: "5",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/brand"}>Brand</Link>,
            },
            {
              key: "6",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/rider"}>Riders</Link>,
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
