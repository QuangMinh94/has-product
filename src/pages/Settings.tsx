import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Image } from "antd";
import UserListComp from '../components/UserListComp';
import SubTask from '../components/SubTasks';
import PriorityDropdown from '../components/PriorityDropdown';


const SettingPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <PriorityDropdown type="Priority" text='Low'/>
    </>
  );
};

export default SettingPage;