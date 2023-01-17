import React from 'react'
import type { MenuProps } from 'antd'
import { Menu, Image, theme } from 'antd'
import {
  faHome,
  faArchive,
  faProjectDiagram,
  faDollarSign,
  faTasks,
  faUser,
  faCogs,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { CustomRoutes } from '../customRoutes'
import '../assets/css/index.css'

const { useToken } = theme
const { SubMenu } = Menu

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: React.ReactNode,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem(
    'Home',
    '1',
    <Link to={CustomRoutes.HomePage.path}>
      <FontAwesomeIcon icon={faHome} />
    </Link>,
  ),
  getItem('Work', '2', <FontAwesomeIcon icon={faTasks} />, [
    getItem(
      'Công việc của tôi',
      CustomRoutes.MyWork.name,
      <Link to={CustomRoutes.MyWork.path}>
        <FontAwesomeIcon icon={faArchive} />
      </Link>,
    ),
    getItem(
      'My Space',
      '4',
      <Link to={CustomRoutes.About.path}>
        <FontAwesomeIcon icon={faProjectDiagram} />
      </Link>,
      [
        getItem('HAS BA', '5', <FontAwesomeIcon icon={faProjectDiagram} />, [
          getItem(
            'Công việc chung',
            '6',
            <FontAwesomeIcon icon={faProjectDiagram} />,
          ),
          getItem(
            'RPA Scheduler',
            '7',
            <FontAwesomeIcon icon={faProjectDiagram} />,
          ),
        ]),
        getItem('HAS Sales', '8', <FontAwesomeIcon icon={faProjectDiagram} />),
      ],
    ),
  ]),
  getItem('User', '9', <FontAwesomeIcon icon={faUser} />),
  getItem('Team', '10', <FontAwesomeIcon icon={faDollarSign} />, [
    getItem('Team 1', '6'),
    getItem('Team 2', '8'),
  ]),
  getItem('Files', '11', <FontAwesomeIcon icon={faCogs} />),
]

const SideMenu: React.FC = () => {
  const { token } = useToken()
  return (
    <>
      <Menu
        theme="dark"
        style={{ backgroundColor: token.colorPrimary }}
        defaultSelectedKeys={['1']}
        mode="vertical"
        items={items}
      ></Menu>
    </>
  )
}

export default SideMenu
