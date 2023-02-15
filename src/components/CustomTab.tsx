import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Space, Tabs } from 'antd'
import TaskList from './table/TaskList'
import { Task } from '../data/entity/task'
import TaskListOverDue from './table/TaskListOverdue'
import { Tasks } from '../data/database/Tasks'
import Search from 'antd/es/input/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { ToLowerCaseNonAccentVietnamese } from '../util/FormatText'
import _ from 'lodash'

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
  const [srcAssigneeTask, setSrcAssigneeTask] = useState<Tasks[]>(assigneeTask)
  const [srcOtherTask, setSrcOtherTask] = useState<Tasks[]>(otherTask)
  const [inputValue, setInputValue] = useState('')
  const [collapseShowMore, setCollapseShowMore] = useState(true)
  const [assigneeTaskNumSrc, setAssigneeTaskNum] = useState(assigneeTaskNum)
  const [otherTaskNumSrc, setOtherTaskNum] = useState(otherTaskNum)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //console.log(inputValue)
      // Send Axios request here
      if (inputValue === '') {
        if (tabKey === '1') {
          setSrcAssigneeTask(assigneeTask)
          setAssigneeTaskNum(assigneeTaskNum)
        } else {
          setSrcOtherTask(otherTask)
          setOtherTaskNum(otherTaskNum)
        }
      }
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [inputValue])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //console.log(inputValue)
      // Send Axios request here
    }, 100)

    return () => clearTimeout(delayDebounceFn)
  }, [loading])

  const OnSearchDebounce = _.debounce((e: string) => InputChange(e), 1)

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
    setLoading(false)
  }

  return (
    <>
      <Input
        prefix={<FontAwesomeIcon icon={faSearch} />}
        placeholder="Tim task"
        onPressEnter={(e) => onSearch(e)}
        style={{ width: '12%', margin: '-2% 0 0 88%', borderRadius: '0' }}
        value={inputValue}
        //defaultValue={inputValue}
        //onChange={(e) => setInputValue(e.target.value)}
        onChange={(e) => {
          setLoading(true)
          OnSearchDebounce(e.target.value)
        }}
        //onBlur={(e) => InputChange(e.target.value)}
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
