import React, { useState } from "react";
import { ConfigProvider, Breadcrumb, Layout, Menu, theme, Image } from "antd";
import SideMenu from "../src/components/SideMenu";

import CustomHeader from "./components/CustomHeader";

import MainRoutes from "./routes";
import HomePage from "./pages/HomePage";
import { Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorPrimary: "#0E7490", 
            },
          },
          token:{
            colorPrimary: "#0E7490",
            fontFamily:'Roboto',
            
          },
          
        }}
      >
        <MainRoutes />
       
      </ConfigProvider>
    </>
  );
};

export default App;
