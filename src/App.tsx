import React from 'react'
import { ConfigProvider } from 'antd'

import MainRoutes from './routes'

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorPrimary: '#0E7490',
            },
            Layout: {
              colorPrimary: '#0E7490',
            },
          },
          token: {
            colorPrimary: '#0E7490',
            fontFamily: 'Roboto',
          },
        }}
      >
        <MainRoutes />
      </ConfigProvider>
    </>
  )
}

export default App
