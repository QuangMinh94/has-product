import React, { useCallback, useEffect, useState } from 'react'
import { Button, Space, theme } from 'antd'
import { storeIndex } from '../redux'
import { CakeView } from '../redux/features/cake/cakeView'
import { IceCreamView } from '../redux/features/icecream/iceCreamView'
import { UserView } from '../redux/features/user/userView'

const SettingPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Space direction="vertical">
      <CakeView />
      <IceCreamView />
    </Space>
  )
}

export default SettingPage
