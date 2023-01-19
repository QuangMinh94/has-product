import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  FloatButton,
  Form,
  Input,
  Layout,
  Modal,
  Space,
} from 'antd'
import CustomTab from '../components/CustomTab'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTasks } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/index.css'

import CustomHeader from '../components/CustomHeader'
import { CustomRoutes } from '../customRoutes'
import { GetNotDoneTasksAssignee, GetNotDoneTasksReporter } from '../data/tasks'
import { Tasks } from '../data/database/Tasks'
import Description from '../components/description'
import CustomFloatButton from '../components/FloatButton'
import { Outlet } from 'react-router-dom'
import { getCookie } from 'typescript-cookie'

const { Content } = Layout

const { Search } = Input

const ClickMe = () => {
  alert('Click me')
}
const MyWork: React.FC = () => {
  const _id = getCookie('user_id') as string
  const [todayData, setTodayData] = useState<Tasks[]>([])
  const [otherData, setOtherData] = useState<Tasks[]>([])

  //setData("")
  useEffect(() => {
    GetNotDoneTasksAssignee('/api/task/getnotdonetask/', _id as string)
      .then((r: Tasks[]) => {
        setTodayData(r)
        //console.log("Data "+data)
        //myData = data;
        //console.log(dataRef.current)
      })
      .catch((err) => console.log(err))

    GetNotDoneTasksReporter('/api/task/getnotdonetask/', _id as string)
      .then((r: Tasks[]) => {
        setOtherData(r)
        //console.log("Data "+data)
        //myData = data;
        //console.log(dataRef.current)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <>
      <CustomFloatButton />
      {/* <CustomHeader pageName={CustomRoutes.MyWork.name} /> */}
      <Content className="inner-content">
        <div
          style={{
            padding: 24,
            minHeight: 360,
            //background: colorBgContainer,
          }}
        >
          <h3>{CustomRoutes.MyWork.name}</h3>
          <CustomTab
            assigneeTask={todayData}
            assigneeTaskNum={todayData.length === 0 ? 0 : todayData.length}
            otherTask={otherData}
            otherTaskNum={otherData.length === 0 ? 0 : otherData.length}
          />
        </div>
      </Content>
      <Outlet />
    </>
  )
}

export default MyWork
