import React from "react";
import { Breadcrumb, Layout, Menu, theme, Image } from "antd";
import CustomTab from "../components/CustomTab";
import '../assets/css/index.css'

import CustomHeader from '../components/CustomHeader';
import { CustomRoutes } from "../customRoutes";

const { Header, Content, Footer, Sider } = Layout;
const MyWork: React.FC = () =>{
    return(
        <>
        <CustomHeader pageName={CustomRoutes.MyWork.name}/>
        <Content className="inner-content">
          <div
            style={{
              padding: 24,
              minHeight: 360,
              //background: colorBgContainer,
            }}
          >
            <CustomTab/>
          </div>
        </Content>   
        </>
    )

}

export default MyWork;