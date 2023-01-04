import React from "react";
import {Layout} from "antd";
import CustomTab from "../components/CustomTab";
import '../assets/css/index.css'

import CustomHeader from '../components/CustomHeader';
import { CustomRoutes } from "../customRoutes";

const {Content} = Layout;
const MyWork:React.FC = () =>{
  
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
            <h3>{CustomRoutes.MyWork.name}</h3>
            <CustomTab/>
          </div>
        </Content>   
        </>
    )

}

export default MyWork;