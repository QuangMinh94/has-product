import React, { Suspense, useCallback, useEffect, useState } from 'react'
import {
  Col,
  Layout,
  Row,
  Space,
  Upload,
  message,
  Avatar,
  Input,
  notification,
  Spin,
  Button,
} from 'antd'
import Breadcrumbs from '../components/Breadcrumbs'
import '../assets/css/layout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DropdownProps from '../components/Dropdown'
import UserListComp from '../components/UserListComp'
import { TabsProps, UploadProps, Modal } from 'antd'
import { Tasks } from '../data/database/Tasks'
import { Users } from '../data/database/Users'
import type { Dayjs } from 'dayjs'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  faPlus,
  faStar,
  faUserCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { CustomRoutes } from '../customRoutes'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { GetTasksById, InsertTask, UpdateTask } from '../data/tasks'
import { InputTasks } from '../data/database/InputTasks'
import _ from 'lodash'
import {
  DEFAULT_STT,
  IGNORE_STT_DEFAULT,
  INSERT_MODE,
  UPDATE_FAIL,
  UPDATE_MODE,
} from '../util/ConfigText'
import CustomFloatButton from '../components/QuickCreate'
import { GetUserByType } from '../data/allUsers'
import { getCookie } from 'typescript-cookie'
import CustomDatePicker from '../components/CustomDatePicker'
import { SubTaskCompProp, SubTaskProp } from '../data/entity/SubTaskProp'
import ObjectID from 'bson-objectid'
import SubTask from '../components/SubTasks'

interface TaskData {
  taskData?: Tasks
  openModal: boolean
}

const { Header, Content } = Layout

const { Dragger } = Upload

const props: UploadProps = {
  name: 'file',
  multiple: true,
  //action: '',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  },
}

const ModalBreadCrumb = () => {
  return <Breadcrumbs main={'Home'} sub={CustomRoutes.TaskDetails.name} />
}

function getUnique(array: any[], key: any) {
  if (typeof key !== 'function') {
    const property = key
    key = function (item: any) {
      return item[property]
    }
  }
  return Array.from(
    array
      .reduce(function (map, item) {
        const k = key(item)
        if (!map.has(k)) map.set(k, item)
        return map
      }, new Map())
      .values(),
  )
}

const TaskDetails: React.FC<TaskData> = ({ openModal }) => {
  const taskId = useParams()
  const navigate = useNavigate()

  const location = useLocation()
  const parentTask = location.state.parentTask
  //const taskData = location.state.taskData as Tasks // Read values passed on state
  let assignee: Users[] = []
  const [loading, setLoading] = useState(true)
  const [editorValue, setEditorValue] = useState('')
  const [taskData, setTaskData] = useState<Tasks>({
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    DueDate: new Date(),
    Assignee: assignee,
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: '',
    Reporter: {},
    GroupPath: '',
  })

  const [haveParentTask, setHaveParentTask] = useState(false)
  const [open, setOpen] = useState(openModal)
  const [editTaskName, setEditTaskName] = useState(false)
  const [assigneeData, setAssigneeData] = useState<Users[]>([])
  const [reporterData, setReporterData] = useState<Users[]>([])
  const [getUsers, setGetUsers] = useState(false)
  const [saveBtn, setSaveBtn] = useState(false)
  const subTask: Tasks[] = []
  const [subTasksComp, setSubTaskComp] = useState<SubTaskCompProp[]>([])
  const [subTaskIdList, setSubTaskIdList] = useState<string[]>([])
  const [openSubTaskBtn, setOpenSubTaskBtn] = useState(true)
  const _assignUser: Users[] = []
  const [myTask, setMyTask] = useState<Tasks>({
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    StartDate: new Date(),
    Assignee: _assignUser,
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: '',
    Reporter: {},
    GroupPath: '',
  })

  const BackToMainTask = (taskId: string) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskId, {
      state: {
        search: '/' + taskData._id, // query string
        // location state
        //parentTask: parentTask,
      },
    })
    navigate(0)
  }

  const fetchData = useCallback(async () => {
    if (parentTask) setHaveParentTask(true)
    setGetUsers(true)

    const data = await GetTasksById(
      '/api/task/getonetask/',
      taskId.id as string,
    )
    setTaskData(data[0])
    let desc = ''
    try {
      desc = JSON.parse(data[0].Description)
    } catch (e) {}
    setEditorValue(desc)
    //console.log('My data ' + JSON.stringify(data[0].Subtask))

    const dataAssignee = await GetUserByType(
      '/api/users/getReporterOrAssignee',
      'assignee',
      getCookie('user_id')?.toString(),
    )

    setAssigneeData(dataAssignee)

    const dataRp = await GetUserByType(
      '/api/users/getReporterOrAssignee',
      'reporter',
      getCookie('user_id')?.toString(),
    )
    setReporterData(dataRp)

    //console.log('All data ' + JSON.stringify(data[0].Subtask!))
    setLoading(false)
  }, [])

  useEffect(() => {
    const _taskData: Tasks = { ...taskData }
    let _subTaskComp: SubTaskCompProp[] = []
    if (assigneeData.length > 0 && reporterData.length > 0) {
      if (subTasksComp.length === 0) {
        for (let index = 0; index < _taskData.Subtask!.length; index++) {
          _taskData.Subtask![index].created = true
          _subTaskComp.push({
            id: _taskData.Subtask![index]._id,
            content: (
              <SubTaskCom
                key={_subTaskComp.length}
                index={_subTaskComp.length}
                subTaskId={_taskData.Subtask![index]._id}
                task={_taskData.Subtask![index]}
                parentTask={_taskData._id}
              />
            ),
          })
        }
      }
    }

    setSubTaskComp(subTasksComp.concat(getUnique(_subTaskComp, 'id') as any[]))
  }, [assigneeData, reporterData])

  useEffect(() => {
    subTasksComp.length = 0
    fetchData()

    setGetUsers(false)
  }, [fetchData])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //console.log(editorValue)
      // Send Axios request here
      const inputTask: InputTasks = {
        Description: JSON.stringify(editorValue),
      }
      UpdateTask('/api/task/', taskData._id!, inputTask).then((r) => {
        /* notification.open({
          message: 'Notification',
          description: 'Update successfully',
          duration: 2,
          onClick: () => {
            //console.log('Notification Clicked!')
          },
        }) */
      })
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [editorValue, taskData._id])

  const SaveEditor = async () => {
    setSaveBtn(false)
    const inputTask: InputTasks = {
      Description: JSON.stringify(editorValue),
    }
    await UpdateTask('/api/task/', taskData._id!, inputTask)
  }

  const onChangeEditor = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    //setEditorValue(parse(editor.getHTML()) as string)
    setEditorValue(editor.getContents())
  }

  const onOkEvent = async (date: null | (Dayjs | null)) => {
    const dateStr = date?.toString()
    setTaskData({ ...taskData, DueDate: new Date(dateStr ? dateStr : '') })
    //Save DateTime here
    const inputTask: InputTasks = {
      DueDate: new Date(dateStr ? dateStr : ''),
    }

    await UpdateTask('/api/task/', taskData._id!, inputTask).catch((error) => {
      setLoading(false)
      notification.open({
        message: 'Notification',
        description: UPDATE_FAIL,
        duration: 2,
        onClick: () => {},
      })
    })
  }

  const OnBlurTaskName = async (e: any) => {
    setEditTaskName(false)
    const inputTask: InputTasks = {
      TaskName: e.target.value,
    }

    setTaskData({ ...taskData, TaskName: e.target.value })
    //update task
    await UpdateTask('/api/task/', taskData._id!, inputTask)
      .then((r) => {
        /*  notification.open({
            message: 'Notification',
            description: UPDATE_SUCCESS,
            duration: 2,
            onClick: () => {
              //console.log('Notification Clicked!')
            },
          }) */
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        notification.open({
          message: 'Notification',
          description: UPDATE_FAIL,
          duration: 2,
          onClick: () => {
            //console.log('Notification Clicked!')
          },
        })
      })
  }

  const showModal = () => {
    setOpen(true)
  }

  const hideModal = () => {
    setOpen(false)
    navigate(CustomRoutes.MyWork.path)
    navigate(0)
  }

  let reporter: Users[] = []
  reporter.push(taskData.Reporter)

  const SubTaskCom: React.FC<SubTaskProp> = ({
    index,
    subTaskId,
    task,
    parentTask,
  }) => {
    const onFinish = async (values: any) => {
      console.log('Sucess ' + JSON.stringify(values))
      const _task: Tasks = JSON.parse(JSON.stringify(values))
      _task.Status = DEFAULT_STT
      _task.CreateDate = new Date()
      _task.StartDate = new Date()
      if (_task.DueDate === undefined) {
        _task.DueDate = new Date('')
      }

      if (_task.Reporter === undefined) {
        const user: Users = {
          _id: getCookie('user_id')?.toString(),
        }
        _task.Reporter = user
      }

      if (_task.Assignee === undefined || _task.Assignee.length === 0) {
        const user: Users = {
          _id: getCookie('user_id')?.toString(),
        }
        _task.Assignee = [user]
      }

      if (_task.Priority === undefined) {
        _task.Priority = 'Medium'
      }

      //subTask.push(_task)
      const subTaskFilter = subTask.filter((e) => e._id === _task._id)
      if (subTaskFilter.length === 0) {
        //insert
        console.log('Insert the id')

        subTask.push(_task)

        //setSubTask([...subTask, _task])
      } else {
        //update
        console.log('Update the id')
        for (let indexS = 0; indexS < subTask.length; indexS++) {
          if (subTask[indexS]._id === _task._id) {
            /* setSubTask(
              update(subTask, {
                $splice: [[indexS, 1, _task]],
              }),
            ) */
            subTask[indexS] = _task
            break
          }
        }
      }

      //setMyTask({ ...myTask, Subtask: subTask })
      setOpenSubTaskBtn(true)

      //insert Subtask here,make a shallow copy
      const mainTask: Tasks = { ...taskData }

      const subTaskIdList: string[] = []
      subTaskIdList.push(_task._id!)
      mainTask.Subtask = subTaskIdList

      //get parent to first
      let inputTasks: Tasks[] = []
      inputTasks.push(_task)
      inputTasks.unshift(mainTask)

      await InsertTask(
        'api/task/addTaskWithSubtask',
        JSON.stringify(inputTasks),
      )
    }

    const onFinishFailed = (values: any) => {
      console.log('Failed ' + JSON.stringify(values))
    }

    //console.log('Subtask ' + taskData.Subtask?.length)
    return (
      <SubTask
        key={subTaskId}
        tasks={task!}
        //onChange={(e) => console.log('All data ' + e.target.value)}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        assigneeData={assigneeData}
        reporterData={reporterData}
        mode={UPDATE_MODE}
        taskId={subTaskId}
        isEditDetail={true}
        parentTask={parentTask}
      />
    )
  }

  const AddTask = () => {
    console.log('Hello ' + subTasksComp.length)
    const subId = ObjectID().toHexString()
    setSubTaskIdList([...subTaskIdList, subId])
    setSubTaskComp(
      subTasksComp.concat({
        id: subId,
        content: (
          <SubTaskCom
            key={subTasksComp.length}
            index={subTasksComp.length}
            subTaskId={subId}
            task={myTask}
          />
        ),
      }),
    )
    setOpenSubTaskBtn(false)
  }

  return (
    <>
      <Modal
        //title="Basic Modal"
        open={open}
        //onOk={this.handleOk}
        onCancel={hideModal}
        width="92%"
        footer={[]}
      >
        {loading === false ? (
          <Layout>
            <Header style={{ height: '20%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <ModalBreadCrumb />
                {haveParentTask === true && (
                  <Button
                    type="primary"
                    onClick={() => BackToMainTask(parentTask)}
                  >
                    Back to main tasks
                  </Button>
                )}
                <Row gutter={5}>
                  <Col className="gutter-row" span={16}>
                    <Space direction="horizontal">
                      <DropdownProps
                        type="Status"
                        text={taskData?.Status}
                        button={true}
                        taskId={taskData?._id}
                        id={'details'}
                        ignoreStt={IGNORE_STT_DEFAULT()}
                      />
                      {editTaskName === false ? (
                        <p
                          className="bold-weight"
                          onClick={() => setEditTaskName(true)}
                        >
                          {taskData?.TaskName}
                        </p>
                      ) : (
                        <Input
                          defaultValue={taskData.TaskName}
                          onBlur={OnBlurTaskName}
                          autoFocus
                        />
                      )}
                    </Space>
                  </Col>
                  <Col
                    className="gutter-row"
                    span={1}
                    style={{ flex: 'revert' }}
                  >
                    <FontAwesomeIcon icon={faStar} color="#FACC15" />
                  </Col>
                  <Col
                    className="gutter-row"
                    span={4}
                    style={{ flex: 'revert', marginRight: '10px' }}
                  >
                    <CustomDatePicker
                      dueDateInput={taskData.DueDate?.toString()!}
                      //onChangeValue={OnChangeDateTime}
                      mode={UPDATE_MODE}
                      onOkEvent={onOkEvent}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    span={1}
                    style={{ flex: 'revert' }}
                  >
                    <DropdownProps
                      type={'Priority'}
                      text={taskData?.Priority ? taskData?.Priority : ''}
                      taskId={taskData?._id}
                      id={'details'}
                    />
                  </Col>
                  {getUsers === false ? (
                    <>
                      <Col
                        className="gutter-row"
                        span={4}
                        style={{ flex: 'revert' }}
                      >
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
                              <FontAwesomeIcon
                                icon={faUserPlus}
                                color="#000000"
                              />
                            </Avatar>
                          }
                          tooltipText="Assignee"
                          inputUserData={taskData?.Assignee}
                          mode={UPDATE_MODE}
                          assigneeUpdate={true}
                          taskId={taskData._id}
                        />
                        {/*  <IconGroup
                  inputList={taskData?.Assignee as Users[]}
                  maxCount={5}
                /> */}
                      </Col>
                      <Col
                        className="gutter-row"
                        span={1}
                        style={{ flex: 'revert' }}
                      >
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
                              <FontAwesomeIcon
                                icon={faUserCheck}
                                color="#000000"
                              />
                            </Avatar>
                          }
                          tooltipText="Reporter"
                          inputUserData={reporter}
                          mode={UPDATE_MODE}
                          taskId={taskData._id}
                        />
                      </Col>
                    </>
                  ) : (
                    <Spin size="large" />
                  )}
                </Row>
              </Space>
            </Header>
            <Content>
              <Row>
                <Col span={24} style={{ marginRight: '0.5%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <ReactQuill
                      //ref={reactQuillRef}
                      preserveWhitespace={true}
                      modules={{
                        toolbar: [
                          [
                            { font: [] },
                            { size: ['small', false, 'large', 'huge'] },
                          ], // custom dropdown

                          ['bold', 'italic', 'underline', 'strike'],

                          [{ color: [] }, { background: [] }],

                          /* [{ script: 'sub' }, { script: 'super' }], */

                          /* [
                        { header: 1 },
                        { header: 2 }, 
                        'blockquote',
                        'code-block',
                      ], */

                          [
                            { list: 'ordered' },
                            { list: 'bullet' },
                            /* { indent: '-1' },
                        { indent: '+1' }, */
                          ],

                          /* [{ direction: 'rtl' }, { align: [] }],

                      ['link', 'image', 'video', 'formula'],
                        
                      ['clean'] */
                          ['image'],
                        ],
                      }}
                      value={editorValue}
                      onChange={onChangeEditor}
                      style={{
                        height: '188px',
                        overflow: 'inline',
                      }}
                      onFocus={() => setSaveBtn(true)}
                      onBlur={() => SaveEditor()}
                    ></ReactQuill>
                    {saveBtn === true && (
                      <Button type="primary" onClick={SaveEditor}>
                        Save
                      </Button>
                    )}
                    <br />
                    <br />
                    {assigneeData.length !== 0 ? (
                      <Space direction="vertical">
                        {subTasksComp.map((element) => element.content)}

                        <Button
                          type="dashed"
                          onClick={AddTask}
                          block
                          icon={<FontAwesomeIcon icon={faPlus} />}
                          disabled={!openSubTaskBtn}
                          style={{ width: '100px' }}
                        >
                          Add tasks
                        </Button>
                      </Space>
                    ) : (
                      <Spin />
                    )}
                    {/*  <Dragger {...props}>
                    <p className="ant-upload-text">
                      Drag & drop or <a href="#">browse</a>
                    </p>
                  </Dragger> */}
                  </Space>
                </Col>
              </Row>
            </Content>
          </Layout>
        ) : (
          <h1>Please wait</h1>
        )}
        <CustomFloatButton />
      </Modal>
    </>
  )
}

export default TaskDetails
