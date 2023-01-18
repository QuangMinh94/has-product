import React, { useEffect, useState } from 'react'
import { Input, Space, Tabs } from 'antd'
import TaskList from './table/TaskList'
import { Task } from '../data/entity/task'
import TaskListOverDue from './table/TaskListOverdue'
import { Tasks } from '../data/database/Tasks'
import Search from 'antd/es/input/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { ToLowerCaseNonAccentVietnamese } from '../util/FormatText'

interface TaskInput {
  assigneeTask: Tasks[]
  otherTask: Tasks[]
  assigneeTaskNum: number
  otherTaskNum: number
}

const App: React.FC<TaskInput> = ({
  assigneeTask,
  otherTask,
  assigneeTaskNum,
  otherTaskNum,
}) => {
  const [tabKey, setTabKey] = useState('1')
  const [searchValue, setSearchValue] = useState('')
  const [srcAssigneeTask, setSrcAssigneeTask] = useState<Tasks[]>(assigneeTask)
  const [srcOtherTask, setSrcOtherTask] = useState<Tasks[]>(otherTask)
  const [inputValue, setInputValue] = useState('')
  const [collapseShowMore, setCollapseShowMore] = useState(true)
  const [assigneeTaskNumSrc, setAssigneeTaskNum] = useState(assigneeTaskNum)
  const [otherTaskNumSrc, setOtherTaskNum] = useState(otherTaskNum)

  useEffect(() => {
    if (srcAssigneeTask.length === 0) {
      setSrcAssigneeTask(assigneeTask)
      setAssigneeTaskNum(assigneeTaskNum)
      setSrcOtherTask(otherTask)
      setOtherTaskNum(otherTaskNum)
      //console.log('Me effect')
    }
  }, [assigneeTask])

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let value = inputValue
    let filteredTask: Tasks[] = []
    if (value !== '') {
      if (tabKey === '1') {
        filteredTask = assigneeTask.filter((x) =>
          ToLowerCaseNonAccentVietnamese(x.TaskName).includes(
            ToLowerCaseNonAccentVietnamese(value),
          ),
        )
        //setSrcAssigneeTask([])
        setSrcAssigneeTask(filteredTask)
        setAssigneeTaskNum(filteredTask.length)
      } else {
        filteredTask = srcOtherTask.filter((x) =>
          ToLowerCaseNonAccentVietnamese(x.TaskName).includes(
            ToLowerCaseNonAccentVietnamese(value),
          ),
        )
        setSrcOtherTask(filteredTask)
        setOtherTaskNum(filteredTask.length)
      }
    } else {
      if (tabKey === '1') {
        setSrcAssigneeTask(assigneeTask)
        setAssigneeTaskNum(assigneeTaskNum)
      } else {
        setSrcOtherTask(otherTask)
        setOtherTaskNum(otherTaskNum)
      }
    }
  }

  const resetTabData = (key: string) => {
    if (key === '1') {
      setSrcAssigneeTask(assigneeTask)
      setAssigneeTaskNum(assigneeTaskNum)
      setCollapseShowMore(false)
    } else {
      setSrcOtherTask(otherTask)
      setOtherTaskNum(otherTaskNum)
    }
  }

  const OnChange = (key: string) => {
    setTabKey(key)
    resetTabData(key)
    setInputValue('')
    InputChange('')
  }

  const InputChange = (key: string) => {
    setInputValue(key)
    if (key === '') {
      if (tabKey === '1') {
        setSrcAssigneeTask(assigneeTask)
        setAssigneeTaskNum(assigneeTaskNum)
      } else {
        setSrcOtherTask(otherTask)
        setOtherTaskNum(otherTaskNum)
      }
    }
  }

  return (
    <>
      {/* <Search
        placeholder="input search text"
        onSearch={onSearch}
        value={inputValue}
        allowClear
        style={{ width: 200, margin: '-2% 0 0 89%' }}
        onChange={(e) => setInputValue(e.target.value)}
      /> */}
      <Input
        prefix={<FontAwesomeIcon icon={faSearch} />}
        placeholder="Search..."
        onPressEnter={(e) => onSearch(e)}
        style={{ width: '11%', margin: '-2% 0 0 89%' }}
        value={inputValue}
        onBlur={(e) => InputChange(e.target.value)}
        allowClear
      />
      <Tabs
        defaultActiveKey="1"
        onChange={OnChange}
        items={[
          {
            label: (
              <Space align="center">
                My task
                <p
                  style={{
                    padding: '0px 4px 0px 4px',
                    border: '1px solid',
                    borderRadius: '10px',
                    fontSize: '11px',
                  }}
                >
                  {assigneeTaskNumSrc}
                </p>
              </Space>
            ),
            key: '1',
            children: (
              <TaskList
                inputData={srcAssigneeTask}
                showMore={true}
                increment={3}
                collapseShowMore={collapseShowMore}
              />
            ),
          },
          {
            label: (
              <Space align="center">
                Report to me
                <p
                  style={{
                    padding: '0px 4px 0px 4px',
                    border: '1px solid',
                    borderRadius: '10px',
                    fontSize: '11px',
                  }}
                >
                  {otherTaskNumSrc}
                </p>
              </Space>
            ),
            key: '2',
            children: (
              <TaskListOverDue
                inputData={srcOtherTask}
                showMore={false}
                increment={3}
              />
            ),
          },
        ]}
      />
    </>
  )
}

export default App
