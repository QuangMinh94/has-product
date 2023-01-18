import { Breadcrumb, Layout, Menu, theme, Image } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, Route, useLocation, useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import hptIcon from '../assets/img/hpt-icon.svg'
import { CustomRoutes } from '../customRoutes'
import CustomHeader from '../components/CustomHeader'
import { Users } from '../data/database/Users'
import { getCookie } from 'typescript-cookie'

const { Header, Content, Footer, Sider } = Layout

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  //const location = useLocation()
  const [collapsed, setCollapsed] = useState(true)
  useEffect(() => {
    //if (sessionStorage.getItem('user_id') === null) {
    if (getCookie('user_id') === undefined) {
      navigate(CustomRoutes.Signin.path)
    } else {
      //navigate(CustomRoutes.MyWork.path)
    }
  })

  const userData =
    getCookie('userInfo') !== undefined
      ? (JSON.parse(getCookie('userInfo') as string) as Users)
      : {}

  const {
    token: { colorBgContainer },
  } = theme.useToken()
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Side Menu */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ height: 32, margin: 16 }}>
            <Image src={hptIcon} />
          </div>
          <SideMenu />
        </Sider>
        {/* Inner Container */}
        <Layout className="site-layout">
          <CustomHeader
            pageName={CustomRoutes.MyWork.name}
            userData={userData}
          />
          <Outlet />
          {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer> */}
        </Layout>

        {/* <MainRoutes/> */}
      </Layout>
    </>
  )
}

export default HomePage
