import React, { useCallback, useEffect, useState } from 'react'
import { Button, Space, theme } from 'antd'
import { IndexRedux } from '../redux'

type SubTaskComData = {
  key: React.Key
  index: number
}

const SubTaskCom = () => {}

const SettingPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  IndexRedux()

  return <h1>Hello</h1>
}

export default SettingPage
