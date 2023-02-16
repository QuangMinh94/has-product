import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  FloatButton,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tooltip,
  Upload,
} from 'antd'
import type { UploadProps, MenuProps, DatePickerProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTags } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/index.css'
import DropdownProps from './Dropdown'
import { Users } from '../data/database/Users'
import { GetUserByType } from '../data/allUsers'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { InsertTask } from '../data/tasks'
import OverDueDate from '../util/OverDueDate'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getCookie } from 'typescript-cookie'
import { useNavigate } from 'react-router-dom'
import { Status } from '../data/entity/Status'
import { Tasks } from '../data/database/Tasks'
import SubTask from './SubTasks'
import { DEFAULT_STT, INSERT_MODE } from '../util/ConfigText'
import update from 'immutability-helper'
import ObjectID from 'bson-objectid'
import { SubTaskCompProp, SubTaskProp } from '../data/entity/SubTaskProp'

interface ItemProps {
  label: string
  value: string
}

let taskKey = 'Item'
//let dueDate = ''

/* for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i
  options.push({
    label: `Long Label: ${value}`,
    value,
  })
} */

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

const customFormat: DatePickerProps['format'] = (value) => {
  if (value.hour() === 23 && value.minute() === 59 && value.second() === 59) {
    return `${value.format('DD/MM')}`
  } else {
    return `${value.format('DD/MM hh:mm:ss')}`
  }
}

const range = (start: number, end: number) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

let assigneeOptions: ItemProps[] = []

let reporterOptions: ItemProps[] = []

const subTask: Tasks[] = []

function GetData(
  url: string,
  type: string,
  items: ItemProps[],
  userId?: string,
) {
  GetUserByType(url, type, userId).then((r) => {
    if (r.length > 0) {
      r.forEach((value) => {
        const su = items.filter((obj) => obj.value === value._id)
        if (su.length === 0) {
          items.push({
            label: value.Name as string,
            value: value._id as string,
          })
        }
      })
    }
  })
}

const CustomFloatButton: React.FC = () => {
  const navigate = useNavigate()
  //let reporterOptions: ItemProps[] = []
  const [editorValue, setEditorValue] = useState('')

  const [taskName, setTaskName] = useState('')

  const _id = sessionStorage.getItem('user_id')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState<string[]>([])

  const [rep, setRep] = useState('')
  const [assignee, setAssignee] = useState('')
  const [assigneeData, setAssigneeData] = useState<Users[]>([])
  const [reporterData, setReporterData] = useState<Users[]>([])
  const [dueDate, setDueDate] = useState('')
  const [subTasksComp, setSubTaskComp] = useState<SubTaskCompProp[]>([])
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
    created: false,
  })

  //const [subTask, setSubTask] = useState<Tasks[]>([])
  const [subTaskIdList, setSubTaskIdList] = useState<string[]>([])

  const onChangeDate = (date: null | (Dayjs | null), dateStrings: string) => {
    if (date) {
      //console.log('Date: ', date.toString())
      setDueDate(date.toString())
      /* {
      dueDate !== '' && <OverDueDate inputDate={new Date(dueDate)} />
    } */
    } else {
      setDueDate('')
    }
  }

  const onChangeEditor = (
    content: any,
    delta: any,
    source: any,
    editor: any,
  ) => {
    setEditorValue(editor.getContents())
  }

  const fetchData = useCallback(async () => {
    const data = await GetUserByType(
      'api/users/getReporterOrAssignee',
      'assignee',
      getCookie('user_id')?.toString(),
    )
    setAssigneeData(data)
    data.forEach((value) => {
      const su = assigneeOptions.filter((obj) => obj.value === value._id)
      if (su.length === 0) {
        assigneeOptions.push({
          label: value.Name as string,
          value: value._id as string,
        })
      }
    })

    const dataRp = await GetUserByType(
      'api/users/getReporterOrAssignee',
      'reporter',
      getCookie('user_id')?.toString(),
    )
    setReporterData(dataRp)
    dataRp.forEach((value) => {
      const su = reporterOptions.filter((obj) => obj.value === value._id)
      if (su.length === 0) {
        reporterOptions.push({
          label: value.Name as string,
          value: value._id as string,
        })
      }
    })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const [form] = Form.useForm()
  const group = Form.useWatch('group', form)

  const onChangeReporter = (value: string) => {
    setRep(value)
    const users: Users = {
      _id: value,
    }
    setMyTask({ ...myTask, Reporter: users })
  }

  const onChangeAssignee = (value: string) => {
    setAssignee(value)
    const users: Users = {
      _id: value,
    }
    setMyTask({ ...myTask, Assignee: [users] })
  }

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
    }, 3000)
  }

  const handleCancel = () => {
    setSubTaskIdList([])
    setOpen(false)

    //console.log('My subtask id list ' + JSON.stringify(subTaskIdList))
  }

  const clearData = () => {
    setValue([])
  }

  const SubTaskCom: React.FC<SubTaskProp> = ({ index, subTaskId }) => {
    const onFinish = (values: any) => {
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
    }

    const onFinishFailed = (values: any) => {
      console.log('Failed ' + JSON.stringify(values))
    }

    return assigneeData.length !== 0 ? (
      <Space direction="horizontal">
        <SubTask
          tasks={myTask}
          //onChange={(e) => console.log('All data ' + e.target.value)}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          assigneeData={assigneeData}
          reporterData={reporterData}
          mode={INSERT_MODE}
          taskId={subTaskId}
        />
      </Space>
    ) : (
      <h1>Please wait</h1>
    )
  }

  const AddTask = () => {
    //console.log('Hello ' + subTasks.length)
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
          />
        ),
      }),
    )
    setOpenSubTaskBtn(false)
  }

  const onFinish = async (values: any) => {
    // get only the task that has Id
    /* setSubTask((subTask) => {
      return subTask.filter(
        (element) =>
          element._id !== undefined &&
          element._id !== null &&
          element._id !== '',
      )
    }) */
    const subTaskFilter = subTask.filter(
      (element) =>
        element._id !== undefined && element._id !== null && element._id !== '',
    )

    //update the tasks that has id on SubTaskComp by getting the index of from SubTask
    setSubTaskComp((subTasksComp) => {
      return subTasksComp.filter((e) =>
        subTaskFilter.find(({ _id }) => e.id === _id),
      )
    })

    //update the sub tasks id list
    /* setSubTaskIdList((subTaskIdList) => {
      return subTaskIdList.filter((e) => subTask.find(({ _id }) => e === _id!))
    }) */

    const idList: string[] = []
    subTaskFilter.forEach((element) => {
      idList.push(element._id!)
    })

    const _subTaskFilter: Tasks[] = [...subTaskFilter]
    _subTaskFilter.forEach((element) => {
      element.created = true
    })

    const _assignee: Users[] = []

    const _reporter: Users = {
      _id: rep ? rep : (getCookie('user_id') as string),
    }
    if (_assignee.length === 0) {
      _assignee.push({
        _id: assignee ? assignee : (getCookie('user_id') as string),
      })
    }

    const myInputTask: Tasks = {
      _id: ObjectID().toHexString(),
      TaskName: taskName,
      Description: JSON.stringify(editorValue),
      Priority: sessionStorage.getItem('priority' + taskKey)?.toString()!
        ? sessionStorage.getItem('priority' + taskKey)?.toString()!
        : 'Medium',
      CreateDate: new Date(),
      //StartDate: new Date(startDate),
      Subtask: idList,
      DueDate: new Date(dueDate),
      Status: 'In progress',
      Assignee: _assignee,
      Reporter: _reporter,
      GroupPath: group,
      Watcher: [],
      Tag: [],
      Attachment: [],
      Comment: [],
    }

    _subTaskFilter.unshift(myInputTask)

    console.log('Task all ' + JSON.stringify(_subTaskFilter))
    await InsertTask(
      'api/task/addTaskWithSubtask',
      JSON.stringify(_subTaskFilter),
    )
    form.resetFields()
    clearData()
    setOpen(false)
    sessionStorage.setItem('priority' + taskKey, 'Medium')
    sessionStorage.setItem('status' + taskKey, 'To do')
    navigate(0)
  }

  const submitForm = () => {
    form.submit()
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <FloatButton
        tooltip={<div>Create Task</div>}
        shape="circle"
        type="primary"
        //style={{ right: 94 }}
        icon={<FontAwesomeIcon icon={faPlus} />}
        onClick={showModal}
      />
      <Modal
        open={open}
        title=""
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        width="50%"
      >
        <br />
        <br />
        <Form
          form={form}
          name="basic"
          //labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          initialValues={{ remember: true, Layout: 'vertical' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            //label="Username"
            name="task name"
            rules={[
              { required: true, message: 'Please input your task name!' },
            ]}
          >
            <Input
              placeholder="Task Name"
              defaultValue={taskName}
              onBlur={(e) => {
                setTaskName(e.target.value)
                setMyTask({ ...myTask, TaskName: e.target.value })
              }}
            />
          </Form.Item>

          <Form.Item name="users" style={{ margin: '0 0 -0.2% 0' }}>
            <Input.Group compact>
              <Form.Item name="assignee" style={{ width: '65%' }}>
                {/* <UserListComp /> */}

                {/* <Select {...selectProps} /> */}
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder="Assign to"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={assigneeOptions}
                  onChange={(e) => onChangeAssignee(e)}
                />
              </Form.Item>
              <Form.Item
                name="reporter"
                style={{ width: '32%', margin: '0 0 0 3%' }}
              >
                {/* <UserListComp /> */}
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  placeholder="Report to"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={reporterOptions}
                  onChange={(e) => onChangeReporter(e)}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item name="description">
            <ReactQuill
              //ref={reactQuillRef}
              preserveWhitespace={true}
              modules={{
                toolbar: [
                  [{ font: [] }, { size: ['small', false, 'large', 'huge'] }], // custom dropdown

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
                height: '150px',
                //maxHeight: '500px',
                overflow: 'inline',
              }}
            ></ReactQuill>
          </Form.Item>
          <br />
          <br />
          <Space direction="vertical">
            <Space direction="vertical">
              <>
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
              </>
            </Space>
            <Space align="baseline" size={10}>
              <Tooltip placement="top" title="Priority">
                <Form.Item name="priority">
                  <DropdownProps
                    type={'Priority'}
                    text={'Medium'}
                    id={taskKey}
                  />
                </Form.Item>
              </Tooltip>

              <Form.Item name="dueDate">
                <Space direction="horizontal">
                  <DatePicker
                    className={'datePicker'}
                    placeholder=""
                    showTime={{
                      format: 'HH:mm:ss',
                      defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
                    }}
                    format={customFormat}
                    onChange={onChangeDate}
                    suffixIcon={<FontAwesomeIcon icon={faCalendar} />}
                    style={{
                      width: '32px',
                      boxSizing: 'border-box',
                      padding: '4px 9px 4px 0px',
                      borderBottomLeftRadius: '100px',
                      borderTopRightRadius: '100px',
                      borderTopLeftRadius: '100px',
                      borderBottomRightRadius: '100px',
                      WebkitBorderRadius: '100px',
                    }}
                    //bordered={false}
                  />
                  {dueDate !== '' && (
                    <OverDueDate inputDate={new Date(dueDate)} />
                  )}
                </Space>
              </Form.Item>

              {/* <Form.Item
              name="tags"
            >
              <Button shape="circle">
                <FontAwesomeIcon icon={faTags} />
              </Button>
            </Form.Item> */}
            </Space>
          </Space>
          <Form.Item>
            <center>
              <Button type="primary" onClick={submitForm}>
                Create Task
              </Button>
            </center>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CustomFloatButton
