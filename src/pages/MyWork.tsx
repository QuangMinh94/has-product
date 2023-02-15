import React, { useCallback, useEffect, useState } from 'react'
import { Layout } from 'antd'
import CustomTab from '../components/CustomTab'
import '../assets/css/index.css'

import { CustomRoutes } from '../customRoutes'
import { GetNotDoneTasksAssignee, GetNotDoneTasksReporter } from '../data/tasks'
import { Tasks } from '../data/database/Tasks'
import CustomFloatButton from '../components/QuickCreate'
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

    const inputObjFilter = data.filter(
      (dataEle) =>
        dataEle.Status.toLowerCase() !== 'Completed'.toLowerCase() &&
        dataEle.Status.toLowerCase() !== 'Done'.toLowerCase(),
    )

    const dataOther = await GetNotDoneTasksReporter(
      '/api/task/getnotdonetask/',
      _id as string,
    )

    const inputObjFilterOther = dataOther.filter(
      (dataOtherEle) =>
        dataOtherEle.Status.toLowerCase() !== 'Completed'.toLowerCase() &&
        dataOtherEle.Status.toLowerCase() !== 'Done'.toLowerCase(),
    )

    setTodayData(inputObjFilter)
    setOtherData(inputObjFilterOther)
    setLoading(false)
  }, [])
  //setData("")
  useEffect(() => {
    fetchData()
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
      {/* <Outlet /> */}
    </>
  )
}

export default MyWork
