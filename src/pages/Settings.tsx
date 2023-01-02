import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Image } from "antd";
import { Outlet } from 'react-router-dom';
import CustomHeader from '../components/CustomHeader';
import { CustomRoutes } from '../customRoutes';

const { Header, Content, Footer, Sider } = Layout;

const SettingPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <CustomHeader pageName={CustomRoutes.Setting.path} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            This is setting page
          </div>
        </Content>
    </>
  );
};

export default SettingPage;