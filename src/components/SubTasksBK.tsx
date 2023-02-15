import React, { Suspense, useEffect, useState } from 'react'
import { Button, Form, Input, MenuProps, Space, Spin } from 'antd'
import DropdownProps from './Dropdown'
import { Tasks } from '../data/database/Tasks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faSave, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import { Users } from '../data/database/Users'

import type { Dayjs } from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { CustomRoutes } from '../customRoutes'
import { UPDATE_MODE } from '../util/ConfigText'
import { InputTasks } from '../data/database/InputTasks'
import { UpdateTask } from '../data/tasks'
import { assign } from 'lodash'
import UserIcon from './UserIcon'
import { useAppDispatch, useAppSelector } from '../redux/app/hook'
import { Params } from '../data/entity/task'
import { getCookie } from 'typescript-cookie/dist/src/api'
import UserListComp from './UserListComp'
import { userMenu } from '../data/userMenu'

type SubTaskInput = {
  tasks: Tasks
  onFinish?: (e: any) => void
  onFinishFailed: (error: any) => void
  assigneeData: Users[]
  reporterData: Users[]
  mode?: string
  taskId?: string
  isEditDetail?: boolean
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
}) => {
  //const taskKey = 'Subtask'
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [subTask, setSubTask] = useState<Tasks>(tasks)
  const [editTaskName, setEditTaskName] = useState(true)
  const [hideSubmitBtn, setHideSubmitBtn] = useState(false)
  const [autoFocus, setAutoFocus] = useState(true)
  const [showEditDetail, setShowEditDetail] = useState(false)
  const [assigneeMenu, setAssigneeMenu] = useState<MenuProps['items']>([])
  const [reporterMenu, setReporterMenu] = useState<MenuProps['items']>([])
  const [assigneeDataInner, setAssigneeDataInner] =
    useState<Users[]>(assigneeData)

  const [reporterDataInner, setReporterDataInner] =
    useState<Users[]>(reporterData)

  useEffect(() => {
    if (tasks.TaskName !== '') {
      setHideSubmitBtn(true)
      setEditTaskName(false)
      form.setFieldsValue({ TaskName: tasks.TaskName })
      //setAutoFocus(false)
    } else {
      setHideSubmitBtn(false)
      setEditTaskName(true)
      //setAutoFocus(true)
    }
  }, [])

  useEffect(() => {
    setAssigneeDataInner(assigneeData)
    const userMenuAssignee: MenuProps['items'] = userMenu(assigneeData)
    setAssigneeMenu(userMenuAssignee)

    setReporterDataInner(reporterData)
    const userMenuRep: MenuProps['items'] = userMenu(reporterData)
    setReporterMenu(userMenuRep)
  }, [assigneeData])

  const OnNavigate = (taskData: Tasks) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskData._id, {
      state: {
        search: '/' + taskData._id, // query string
        // location state
        //taskData: taskData,
      },
    })
  }

  const OnChangeDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubTask({ ...subTask, DueDate: new Date(e.target.value) })
    setHideSubmitBtn(false)
    form.setFieldsValue({ DueDate: new Date(e.target.value) })
    console.log('DateTime ' + e.target.value)
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

      await UpdateTask('/api/task/' + taskId, inputTask)
    }
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSubTask({ ...subTask, Priority: e.key })
    setHideSubmitBtn(false)

    form.setFieldsValue({ Priority: e.key })
    console.log('Key ' + e.key)
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

  const buttonOnClick = () => {
    form.submit()
    setHideSubmitBtn(true)
    setShowEditDetail(true)
    //setSubTaskDetail(true)
  }

  const reporters: Users[] = []
  reporters.push(tasks.Reporter)

  return (
    <>
      <div
        //direction="horizontal"
        style={{
          border: 'solid',
          borderWidth: '1px',
          borderColor: '#d9d9d9',
          //padding: '10px 10px -10px 10px',
        }}
        //align="baseline"
      >
        <Form
          form={form}
          name="basic"
          //labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          initialValues={{ remember: true, Layout: 'vertical' }}
          onFinish={onFinish}
          onFinishFailed={(e: any) => {
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
              name="TaskName"
              rules={[
                { required: true, message: 'Please input your task name!' },
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
                  autoFocus={autoFocus}
                  defaultValue={subTask.TaskName}
                  value={subTask.TaskName}
                  onChange={(e) => {
                    setHideSubmitBtn(false)
                    setSubTask({
                      ...subTask,
                      TaskName: e.target.value,
                    })
                  }}
                  onBlur={() => {
                    if (subTask.TaskName !== '') {
                      setEditTaskName(false)
                      setSubTask({
                        ...subTask,
                        _id: taskId,
                      })
                      form.setFieldsValue({ _id: taskId })
                    }
                  }}
                  placeholder="Task name"
                ></Input>
              ) : (
                <p onClick={() => setEditTaskName(true)}>{subTask.TaskName}</p>
              )}
            </Form.Item>
            {isEditDetail === true && showEditDetail === true && (
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => OnNavigate(tasks)}
              />
            )}
            <Form.Item
              //label="Username"
              name="Assignee"
              style={{
                marginBottom: '0px',
              }}
            >
              <UserListComp
                key={taskId}
                userData={assigneeDataInner}
                maxCount={2}
                icon={<FontAwesomeIcon icon={faUserPlus} />}
                onClickMenu={handleMenuClickAssignee}
                mode={mode}
                inputUserData={subTask.Assignee}
                userItems={assigneeMenu}
                taskId={taskId}
              />
            </Form.Item>
            <Form.Item
              //label="Username"
              name="Reporter"
              style={{
                marginBottom: '0px',
              }}
            >
              <UserListComp
                key={taskId}
                userData={reporterDataInner}
                maxCount={3}
                icon={<FontAwesomeIcon icon={faUserPlus} />}
                onClickMenu={handleMenuClickReporter}
                mode={mode}
                inputUserData={reporters}
                userItems={reporterMenu}
                taskId={taskId}
              />
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
                dueDateInput={subTask.DueDate ? subTask.DueDate.toString() : ''}
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
                  icon={<FontAwesomeIcon icon={faSave} />}
                  //htmlType="submit"
                  onClick={buttonOnClick}
                />
              )}
            </Form.Item>
          </Space>
        </Form>
      </div>
    </>
  )
}

export default SubTask
