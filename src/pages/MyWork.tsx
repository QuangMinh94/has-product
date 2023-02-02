import React, { useCallback, useEffect, useState } from 'react'
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

  const fetchData = useCallback(async () => {
    const data = await GetNotDoneTasksAssignee(
      '/api/task/getnotdonetask/',
      _id as string,
    )
    const dataOther = await GetNotDoneTasksReporter(
      '/api/task/getnotdonetask/',
      _id as string,
    )
    setTodayData(data)
    setOtherData(dataOther)
    setLoading(false)
  }, [])
  //setData("")
  useEffect(() => {
    fetchData()

    /* GetNotDoneTasksAssignee('/api/task/getnotdonetask/', _id as string)
      .then((r: Tasks[]) => {
        setTodayData(r)
        //console.log("Data "+data)
        //myData = data;
        //console.log(dataRef.current)
      })
      .catch((err) => console.log(err)) */

    /*  GetNotDoneTasksReporter('/api/task/getnotdonetask/', _id as string)
      .then((r: Tasks[]) => {
        setOtherData(r)
        setLoading(false)
        //console.log("Data "+data)
        //myData = data;
        //console.log(dataRef.current)
      })
      .catch((err) => console.log(err)) */
  }, [fetchData])

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
