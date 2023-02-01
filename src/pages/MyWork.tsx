import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import CustomTab from '../components/CustomTab'
import '../assets/css/index.css'

import { CustomRoutes } from '../customRoutes'
import { GetNotDoneTasksAssignee, GetNotDoneTasksReporter } from '../data/tasks'
import { Tasks } from '../data/database/Tasks'
import CustomFloatButton from '../components/FloatButton'
import { Outlet } from 'react-router-dom'
import { getCookie } from 'typescript-cookie'

const { Content } = Layout

const MyWork: React.FC = () => {
  const _id = getCookie('user_id') as string
  const [todayData, setTodayData] = useState<Tasks[]>([])
  const [loading, setLoading] = useState(true)
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
        setLoading(false)
        //console.log("Data "+data)
        //myData = data;
        //console.log(dataRef.current)
      })
      .catch((err) => console.log(err))
  }, [_id])

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
          {loading === false ? (
            <CustomTab
              assigneeTask={todayData}
              assigneeTaskNum={todayData.length}
              otherTask={otherData}
              otherTaskNum={otherData.length}
            />
          ) : (
            <h1>Please wait</h1>
          )}
        </div>
      </Content>
      <Outlet />
    </>
  )
}

export default MyWork
