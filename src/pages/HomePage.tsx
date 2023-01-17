import { Breadcrumb, Layout, Menu, theme, Image } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, Route, useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import hptIcon from '../assets/img/hpt-icon.svg'
import { CustomRoutes } from '../customRoutes'

const { Header, Content, Footer, Sider } = Layout

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  useEffect(() => {
    if (sessionStorage.getItem('user_id') === null) {
      navigate(CustomRoutes.Signin.path)
    }
  })

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
