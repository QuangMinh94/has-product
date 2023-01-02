import React from 'react';
import type { MenuProps } from 'antd';
import {  Menu,Image,theme} from 'antd';
import { faHome ,faArchive,faProjectDiagram,faDollarSign,faTasks,faUser,faCogs} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { CustomRoutes } from '../customRoutes';

const { useToken } = theme;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Home', '1', <Link to={CustomRoutes.HomePage.path}><FontAwesomeIcon icon={faHome}/></Link>),
  getItem('Work', '2', <FontAwesomeIcon icon={faTasks} />, [
    getItem('Công việc của tôi', '3',<Link to={CustomRoutes.MyWork.path}><FontAwesomeIcon icon={faArchive}/></Link>),
    getItem('My Space', '4',<Link to={CustomRoutes.About.path}><FontAwesomeIcon icon={faProjectDiagram}/></Link>),
    getItem('HAS BA', '5',<FontAwesomeIcon icon={faProjectDiagram}/>),
  ]),
  getItem('User', '6', <FontAwesomeIcon icon={faUser} />),
  getItem('Team', '7', <FontAwesomeIcon icon={faDollarSign} />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FontAwesomeIcon icon={faCogs} />),
];

const SideMenu: React.FC = () => {
  const {token} = useToken();
  return (
    <>
    <Menu theme='dark' style={{backgroundColor: token.colorPrimary}} defaultSelectedKeys={['1']} mode="vertical" items={items} />    
    </>
  );
};

export default SideMenu;