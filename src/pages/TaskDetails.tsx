import React, { useEffect, useState } from 'react'
import { Button, Col, Layout, Row, Space, Upload, message, Avatar } from 'antd'
import Breadcrumbs from '../components/Breadcrumbs'
import '../assets/css/layout.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import DropdownProps from '../components/Dropdown'
import UserListComp from '../components/UserListComp'
import { Tabs } from 'antd'
import { TabsProps, UploadProps, Modal } from 'antd'
import OverDueDate from '../util/OverDueDate'
import { Tasks } from '../data/database/Tasks'
import { Users } from '../data/database/Users'
import { useLocation, useNavigate } from 'react-router-dom'
import { faUserCheck, faUserPlus, faX } from '@fortawesome/free-solid-svg-icons'
import { CustomRoutes } from '../customRoutes'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { UpdateTask } from '../data/tasks'
import { InputTasks } from '../data/database/InputTasks'
import _ from 'lodash'

interface TaskData {
  taskData?: Tasks
  openModal: boolean
}

const items: TabsProps['items'] = [
  {
    key: 'comments',
    label: `Comments`,
    children: `No comment yet`,
  },
  {
    key: 'history',
    label: `History`,
    children: `Will be added later`,
  },
]

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

const TaskDetails: React.FC<TaskData> = ({ openModal }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const taskData = location.state.taskData as Tasks // Read values passed on state

  const [open, setOpen] = useState(openModal)

  let description = ''
  try {
    description = JSON.parse(taskData?.Description)
  } catch (error) {}
  const [editorValue, setEditorValue] = useState(description)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //console.log(editorValue)
      // Send Axios request here
      const inputTask: InputTasks = {
        Description: JSON.stringify(editorValue),
      }
      UpdateTask('/api/task/' + taskData._id, inputTask).then((r) => {
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
  }, [editorValue])

  const onChangeEditorDebounce = _.debounce(
    (content: any, delta: any, source: any, editor: any) =>
      onChangeEditor(content, delta, source, editor),
    10,
  )

  const onChangeEditor = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    //setEditorValue(parse(editor.getHTML()) as string)
    setEditorValue(editor.getContents())
    //setEditorValue(editor.getText())
  }
  const showModal = () => {
    setOpen(true)
  }

  const hideModal = () => {
    setOpen(false)
    navigate(CustomRoutes.MyWork.path)
  }

  let reporter: Users[] = []
  reporter.push(taskData?.Reporter)
  return (
    <Modal
      //title="Basic Modal"
      open={open}
      //onOk={this.handleOk}
      onCancel={hideModal}
      width="92%"
      footer={[]}
    >
      <Layout>
        <Header style={{ height: '20%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space direction="horizontal" style={{ width: '100%' }}>
              <Breadcrumbs main={'Home'} sub={CustomRoutes.TaskDetails.name} />
            </Space>
            <Row gutter={5}>
              <Col className="gutter-row" span={16}>
                <Space direction="horizontal">
                  <DropdownProps
                    type="Status"
                    text={taskData?.Status}
                    button={true}
                    taskId={taskData?._id}
                    id={'details'}
                  />
                  <p className="bold-weight">{taskData?.TaskName}</p>
                </Space>
              </Col>
              <Col className="gutter-row" span={1} style={{ flex: 0 }}>
                <Button shape="circle">
                  <FontAwesomeIcon icon={faCalendar} />
                </Button>
              </Col>
              <Col className="gutter-row" span={2} style={{ flex: 'revert' }}>
                {taskData?.DueDate === null ? (
                  ''
                ) : (
                  <OverDueDate inputDate={taskData?.DueDate as Date} />
                )}
              </Col>
              <Col className="gutter-row" span={1} style={{ flex: 'revert' }}>
                <DropdownProps
                  type={'Priority'}
                  text={taskData?.Priority}
                  taskId={taskData?._id}
                  id={'details'}
                />
              </Col>
              <Col className="gutter-row" span={3} style={{ flex: 'revert' }}>
                <UserListComp
                  userData={taskData?.Assignee}
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
                  tooltipText="Assignee"
                />
                {/*  <IconGroup
                  inputList={taskData?.Assignee as Users[]}
                  maxCount={5}
                /> */}
              </Col>
              <Col className="gutter-row" span={1}>
                <UserListComp
                  userData={reporter}
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
                  tooltipText="Reporter"
                />
              </Col>
            </Row>
          </Space>
        </Header>
        <Content>
          <Row>
            <Col span={16} style={{ marginRight: '0.5%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* <TextArea
                  style={{
                    borderStyle: 'solid',
                    borderWidth: 'thin',
                    borderRadius: '4px',
                    border: '1px solid #9CA3AF',
                    minHeight: '230px',
                    overflow: 'auto',
                    height: '412px',
                    width: '100%',
                  }}
                  defaultValue={taskData?.Description}
                  value={editorValue}
                  onChange={(e) => setEditorValue(e.target.value)}
                  ref={wrapperRef}
                ></TextArea> */}
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

                      [{ script: 'sub' }, { script: 'super' }],

                      [
                        { header: 1 },
                        { header: 2 },
                        'blockquote',
                        'code-block',
                      ],

                      [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' },
                      ],

                      [{ direction: 'rtl' }, { align: [] }],

                      ['link', 'image', 'video', 'formula'],

                      ['clean'],
                    ],
                  }}
                  value={editorValue}
                  onChange={onChangeEditor}
                  style={{
                    height: '300px',
                    maxHeight: '500px',
                    overflow: 'inline',
                  }}
                ></ReactQuill>
                <br />
                <br />
                {/*   <Descriptions
                  title=""
                  style={{
                    borderStyle: 'solid',
                    borderWidth: 'thin',
                    borderRadius: '4px',
                    border: '1px solid #9CA3AF',
                    minHeight: '230px',
                    overflow: 'auto',
                    height: '412px',
                  }}
                >
                  <Descriptions.Item style={{ margin: '1%' }} label="">
                    {taskData?.Description === undefined
                      ? 'No description'
                      : taskData?.Description}
                  </Descriptions.Item>
                </Descriptions> */}
                <Dragger {...props}>
                  <p className="ant-upload-text">
                    Drag & drop or <a href="#">browse</a>
                  </p>
                </Dragger>
              </Space>
            </Col>
            <Col flex={8}>
              <Tabs
                defaultActiveKey="1"
                items={items}
                style={{
                  borderStyle: 'solid',
                  borderWidth: 'thin',
                  borderRadius: '4px',
                  border: '1px solid #9CA3AF',
                  minHeight: '230px',
                  padding: '1%',
                }}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Modal>
  )
}

export default TaskDetails
