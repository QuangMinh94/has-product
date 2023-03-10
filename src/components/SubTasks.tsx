import React, { Suspense, useEffect, useState } from 'react'
import { Avatar, Button, Form, Input, MenuProps, Space, Spin } from 'antd'
import DropdownProps from './Dropdown'
import { Tasks } from '../data/database/Tasks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faSave,
  faUserCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import { Users } from '../data/database/Users'

import type { Dayjs } from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { CustomRoutes } from '../customRoutes'
import { IGNORE_STT_DEFAULT, UPDATE_MODE } from '../util/ConfigText'
import { InputTasks } from '../data/database/InputTasks'
import { UpdateTask } from '../data/tasksService'
import '../assets/css/index.css'
import { Status } from '../data/interface/Status'

const UserListComp = React.lazy(() => import('./UserListComp'))
type SubTaskInput = {
  tasks: Tasks
  onFinish?: (e: any) => void
  onFinishFailed: (error: any) => void
  assigneeData: Users[]
  reporterData: Users[]
  mode?: string
  taskId?: string
  isEditDetail?: boolean
  parentTask?: string
}

const items: MenuProps['items'] = []

const SubTask: React.FC<SubTaskInput> = ({
  tasks,
  assigneeData,
  reporterData,
  onFinish,
  onFinishFailed,
  mode,
  taskId,
  isEditDetail,
  parentTask,
}) => {
  //const taskKey = 'Subtask'
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [subTask, setSubTask] = useState<Tasks>(tasks)
  const [editTaskName, setEditTaskName] = useState(true)
  const [hideSubmitBtn, setHideSubmitBtn] = useState(false)
  const [autoFocus, setAutoFocus] = useState(true)
  const [showEditDetail, setShowEditDetail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)

  useEffect(() => {
    if (tasks.TaskName !== '') {
      setHideSubmitBtn(true)
      setEditTaskName(false)
      setShowEditDetail(true)
      //if (mode !== UPDATE_MODE) {
      form.setFieldsValue({ TaskName: tasks.TaskName })
      //}
    } else {
      setHideSubmitBtn(false)
      setEditTaskName(true)
      setShowEditDetail(false)
    }
  }, [])

  const OnNavigate = (taskId: string) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskId, {
      state: {
        search: '/' + taskId, // query string
        // location state
        parentTask: parentTask,
      },
    })
    navigate(0)
  }

  const onOkEvent = async (date: null | (Dayjs | null)) => {
    setHideSubmitBtn(false)
    if (date !== null) {
      setSubTask({ ...subTask, DueDate: new Date(date.toString()) })
      form.setFieldsValue({ DueDate: new Date(date.toString()) })
    }
    //Save DateTime here
    if (mode === undefined || mode === UPDATE_MODE) {
      const dateStr = date?.toString()
      const inputTask: InputTasks = {
        DueDate: new Date(dateStr ? dateStr : ''),
      }

      await UpdateTask('/api/task/', taskId!, inputTask)
    }
  }

  const handleMenuClick = (e: any) => {
    setSubTask({ ...subTask, Priority: e })
    setHideSubmitBtn(false)

    form.setFieldsValue({ Priority: e })
    console.log('Key ' + e)
    //save priority
  }

  const handleMenuClickAssignee: MenuProps['onClick'] = (e) => {
    setHideSubmitBtn(false)
    const _assignee: Users = {
      _id: e.key,
    }
    const _assigneeList: Users[] = [_assignee]
    setSubTask({ ...subTask, Assignee: _assigneeList })

    form.setFieldsValue({ Assignee: [{ _id: e.key }] })
    console.log('Key assignee' + e.key)
  }

  const handleMenuClickReporter: MenuProps['onClick'] = (e) => {
    setHideSubmitBtn(false)
    const _reporter: Users = {
      _id: e.key,
    }
    setSubTask({ ...subTask, Reporter: _reporter })

    form.setFieldsValue({ Reporter: { _id: e.key } })
    console.log('Key reporter' + e.key)
  }

  const onBlurTaskName = async () => {
    //save to task

    const inputTasks: InputTasks = {
      TaskName: subTask.TaskName,
    }

    await UpdateTask('/api/task/', taskId!, inputTasks)
  }

  const buttonOnClick = () => {
    form.submit()
    setHideSubmitBtn(true)

    //setSubTaskDetail(true)
  }

  const reporters: Users[] = []
  if (tasks.Reporter._id !== undefined) {
    reporters.push(tasks.Reporter)
  }

  return (
    <>
      {loading === false ? (
        <div
          //direction="horizontal"
          style={{
            border: 'solid',
            borderWidth: '1px',
            borderColor: '#d9d9d9',
            paddingRight: '10px',
          }}
          //align="baseline"
        >
          <Form
            form={form}
            name="basic"
            //labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            initialValues={{ remember: true, Layout: 'vertical' }}
            onFinish={(e) => {
              if (onFinish) onFinish(e)
              setShowEditDetail(true)
            }}
            onFinishFailed={(e: any) => {
              //setEditTaskName(true)
              setHideSubmitBtn(false)
              onFinishFailed(e)
            }}
            autoComplete="off"
          >
            <Space direction="horizontal" align="center">
              <Form.Item
                //label="Username"
                name="_id"
              ></Form.Item>
              <Form.Item
                //label="Username"
                name="Status"
                style={{
                  marginBottom: '0px',
                }}
              >
                {(tasks.created !== false && showEditDetail) === true && (
                  <DropdownProps
                    type="Status"
                    text={tasks.Status ? tasks.Status : ''}
                    //button={true}
                    taskId={taskId}
                    id={'details'}
                    ignoreStt={IGNORE_STT_DEFAULT()}
                  />
                )}
              </Form.Item>
              <Form.Item
                //label="Username"
                name="TaskName"
                rules={[
                  { required: true, message: '' },
                  {
                    validator: (_, value) =>
                      value.trim() !== ''
                        ? Promise.resolve()
                        : Promise.reject(new Error('')),
                  },
                ]}
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.additional !== curValues.additional
                }
                style={{
                  width: '20vw',
                  marginBottom: '0px',
                }}
              >
                {editTaskName === true ? (
                  <Input
                    style={{ borderColor: 'transparent' }}
                    autoFocus={autoFocus}
                    defaultValue={subTask.TaskName}
                    value={subTask.TaskName}
                    onChange={(e) => {
                      if (e.target.value !== '') {
                        setHideSubmitBtn(false)
                        setSubTask({
                          ...subTask,
                          TaskName: e.target.value,
                        })
                      } else {
                        setHideSubmitBtn(false)
                        setSubTask({
                          ...subTask,
                          TaskName: subTask.TaskName,
                        })
                      }
                    }}
                    onBlur={() => {
                      if (subTask.TaskName.trim() !== '') {
                        setEditTaskName(false)
                        setSubTask({
                          ...subTask,
                          _id: taskId,
                        })
                        form.setFieldsValue({ _id: taskId })
                        //console.log('Subtask ' + subTask.created)

                        if (subTask.created !== false) onBlurTaskName()
                      }
                    }}
                    placeholder="Task name"
                  />
                ) : (
                  <p onClick={() => setEditTaskName(true)}>
                    {subTask.TaskName}
                  </p>
                )}
              </Form.Item>
              {tasks.created !== false && showEditDetail === true && (
                <FontAwesomeIcon
                  className="edit-icon"
                  icon={faEdit}
                  onClick={() => OnNavigate(taskId!)}
                  style={{}}
                />
              )}
              <Form.Item
                //label="Username"
                name="Assignee"
                style={{
                  marginBottom: '0px',
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <UserListComp
                    userData={assigneeData}
                    maxCount={2}
                    icon={
                      <Avatar
                        style={{
                          borderColor: '#9CA3AF',
                          backgroundColor: 'white',
                        }}
                      >
                        <FontAwesomeIcon icon={faUserPlus} color="#000000" />
                      </Avatar>
                    }
                    onClickMenu={handleMenuClickAssignee}
                    mode={mode}
                    inputUserData={subTask.Assignee}
                    assigneeUpdate={true}
                    taskId={taskId}
                  />
                </Suspense>
              </Form.Item>
              <Form.Item
                //label="Username"
                name="Reporter"
                style={{
                  marginBottom: '0px',
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <UserListComp
                    userData={reporterData}
                    maxCount={3}
                    icon={
                      <Avatar
                        style={{
                          borderColor: '#9CA3AF',
                          backgroundColor: 'white',
                        }}
                      >
                        <FontAwesomeIcon icon={faUserCheck} color="#000000" />
                      </Avatar>
                    }
                    onClickMenu={handleMenuClickReporter}
                    mode={mode}
                    inputUserData={reporters}
                    taskId={taskId}
                  />
                </Suspense>
              </Form.Item>
              <Form.Item
                //label="Username"
                name="Priority"
                style={{
                  marginBottom: '0px',
                }}
              >
                <DropdownProps
                  type={'Priority'}
                  text={tasks.Priority ? tasks.Priority : ''}
                  id={'SubTask'}
                  onClickMenu={handleMenuClick}
                  mode={mode}
                  taskId={taskId}
                />
              </Form.Item>
              <Form.Item
                //label="Username"
                name="DueDate"
                style={{
                  marginBottom: '0px',
                }}
              >
                <CustomDatePicker
                  dueDateInput={
                    subTask.DueDate ? subTask.DueDate.toString() : ''
                  }
                  //onChangeValue={OnChangeDateTime}
                  mode={mode}
                  onOkEvent={onOkEvent}
                />
              </Form.Item>
              <Form.Item
                //label="Username"
                name="ButtonSubmit"
                style={{
                  marginBottom: '0px',
                }}
              >
                {hideSubmitBtn === false && (
                  <Button
                    type="primary"
                    //htmlType="submit"
                    onClick={buttonOnClick}
                  >
                    Save
                  </Button>
                )}
              </Form.Item>
            </Space>
          </Form>
          {errorMsg === true ? <h2>Error</h2> : null}
        </div>
      ) : (
        <Spin />
      )}
    </>
  )
}

export default SubTask
