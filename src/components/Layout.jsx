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
import { setLocations } from "../store/slices/locationSlice";
import { setRiders } from "../store/slices/riderSlice";
import { setTasks } from "../store/slices/taskSlice";
import dayjs from "dayjs";
const LocalizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(LocalizedFormat)
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
      getDocs(collection(db, "locations")),
      getDocs(collection(db, "riders")),
      getDocs(collection(db, "tasks")),
    ])
      .then((response) => {
        const [
          citySnapshot,
          brandSnapshot,
          campaignSnapshot,
          locationSnapshot,
          riderSnapshot,
          taskSnapshot,
        ] = response;
        const camps = campaignSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          key: doc.id,
        }))
        const locs = locationSnapshot.docs.map((doc) => {
          const camp = camps.find(
            (item) => item.id === doc.data().campaign
          );
          return {
          ...doc.data(),
          id: doc.id,
          key: doc.id,
          brand: camp?.brand,
        }})
        const riders = riderSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          key: doc.id,
        }))
        const tasks = taskSnapshot.docs.map((doc) => {
          const data = doc.data()
          const rider = riders.find(item => item.id === data.rider)
          return {
          ...data,
          id: doc.id,
          key: doc.id,
          created: dayjs(data.created).format("MMMM D, YYYY"),
          rider: rider ? rider : data.rider,
        }
      })
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
            camps
          )
        );
        dispatch(
          setLocations(
            locs
          )
        );
        dispatch(
          setRiders(
            riders
          )
        );
        dispatch(
          setTasks(
            tasks
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
              label: <Link to={"/"}>Dashboard</Link>,
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
            {
              key: "7",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/task"}>Task</Link>,
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
