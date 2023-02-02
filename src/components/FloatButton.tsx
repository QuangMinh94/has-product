import React, { useEffect, useState } from 'react'
import {
  Button,
  Dropdown,
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
import type { RangePickerProps } from 'antd/es/date-picker'
import type { SelectProps } from 'antd'
import { Users } from '../data/database/Users'
import { GetUserByType } from '../data/allUsers'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import TextArea from 'antd/es/input/TextArea'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { InsertTask } from '../data/tasks'
import { InputTasks } from '../data/database/InputTasks'
import OverDueDate from '../util/OverDueDate'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getCookie } from 'typescript-cookie'
import { useNavigate } from 'react-router-dom'
import { Status } from '../data/entity/Status'
import { Calendar, Popover } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

interface ItemProps {
  label: string
  value: string
}

let taskKey = 'Item'
let dueDate = ''

const CustomPicker = () => {
  return (
    <Popover
      content={
        <DatePicker
          placeholder="Due date"
          showTime={{
            format: 'HH:mm:ss',
            defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
          }}
          format={customFormat}
          onChange={onChangeDate}
        />
      }
    >
      <Button icon={<CalendarOutlined />} />
    </Popover>
  )
}
/* for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i
  options.push({
    label: `Long Label: ${value}`,
    value,
  })
} */

const ignoreStt: Status[] = [
  {
    id: 1,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
]

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

const { RangePicker } = DatePicker

const onChangeDate = (date: null | (Dayjs | null), dateStrings: string) => {
  if (date) {
    console.log('Date: ', date.toString())
    dueDate = date.toString()
    // dateStrings + '/' + new Date().getFullYear()
  } else {
    console.log('Clear')
  }
}
const onRangeChange = (
  dates: null | (Dayjs | null)[],
  dateStrings: string[],
) => {
  if (dates) {
    console.log('From: ', dates[0], ', to: ', dates[1])
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    //startDate = dateStrings[0]
    dueDate = dateStrings[1]
  } else {
    console.log('Clear')
  }
}

const rangePresets: {
  label: string
  value: [Dayjs, Dayjs]
}[] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
]

const customFormat: DatePickerProps['format'] = (value) => {
  if (value.hour() === 23 && value.minute() === 59 && value.second() === 59) {
    return `${value.format('DD/MM')}`
  } else {
    return `${value.format('DD/MM hh:mm:ss')}`
  }
}

const items: MenuProps['items'] = [
  {
    label: (
      <DatePicker
        placeholder="Due date"
        showTime={{
          format: 'HH:mm:ss',
          defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
        }}
        format={customFormat}
        onChange={onChangeDate}
        suffixIcon={<FontAwesomeIcon icon={faCalendar} />}
      />
    ),
    key: '0',
  },
]

let userItems: MenuProps['items'] = []

const range = (start: number, end: number) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day')
}

const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    }
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  }
}

let assigneeOptions: ItemProps[] = []

let reporterOptions: ItemProps[] = []

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
  const [description, setDescription] = useState('')

  const _id = sessionStorage.getItem('user_id')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState<string[]>([])

  const [openMenu, setOpenMenu] = useState(false)

  const [rep, setRep] = useState('')
  const [assignee, setAssignee] = useState('')

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

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '3') {
      setOpenMenu(false)
    }
  }

  const handleOpenChange = (flag: boolean) => {
    setOpenMenu(flag)
  }

  useEffect(() => {
    GetData(
      'api/users/getReporterOrAssignee',
      'reporter',
      reporterOptions,
      getCookie('user_id')?.toString(),
    )

    GetData(
      'api/users/getReporterOrAssignee',
      'assignee',
      assigneeOptions,
      getCookie('user_id')?.toString(),
    )
  }, [])

  /* const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options: assigneeOptions,
    onChange: (newValue: string[]) => {
      setValue(newValue)
    },
    placeholder: 'Assign to',
    maxTagCount: 'responsive',
  } */

  const [form] = Form.useForm()
  //const taskName = Form.useWatch('taskname', form)
  const group = Form.useWatch('group', form)
  //const description = '' //Form.useWatch('description', form)

  const onChangeReporter = (value: string) => {
    setRep(value)
  }

  const onChangeAssignee = (value: string) => {
    setAssignee(value)
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
    setOpen(false)
  }

  const clearData = () => {
    setValue([])
  }

  const onFinish = (values: any) => {
    //call service here

    //const users: Users[] = []

    const _assignee: Users[] = []

    const _reporter: Users = {
      _id: rep ? rep : (getCookie('user_id') as string),
    }
    /* const assigneesString = (selectProps.value + '') as string
    
    const assignees = assigneesString.split(',')
    assignees.forEach((value) => {
      if (value !== '') {
        users.push({
          _id: value,
        })
      }
    }) */

    if (_assignee.length === 0) {
      _assignee.push({
        _id: assignee ? assignee : (getCookie('user_id') as string),
      })
    }

    /* console.log('Assignee ' + _assignee[0]._id)
    console.log('Reporter ' + _reporter._id) */

    /* if (users.length === 0) {
      users.push({
        _id: getCookie('user_id') as string,
      })
    } */

    const myTask: InputTasks = {
      TaskName: taskName,
      Description: JSON.stringify(editorValue),
      Priority: sessionStorage.getItem('priority' + taskKey)?.toString()
        ? sessionStorage.getItem('priority' + taskKey)?.toString()
        : 'Medium',
      CreateDate: new Date(),
      //StartDate: new Date(startDate),
      DueDate: new Date(dueDate),
      Status: 'In progress',
      Assignee: _assignee,
      Reporter: _reporter,
      GroupPath: group,
    }

    InsertTask('api/task/', myTask).then((r) => {
      //console.log(r)
      form.resetFields()
      clearData()
      setOpen(false)
      sessionStorage.setItem('priority' + taskKey, 'Medium')
      sessionStorage.setItem('status' + taskKey, 'To do')
      navigate(0)
    })

    //
    //console.log('My description ' + editorValue)
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
        width="43vw"
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
            name="taskname"
            rules={[
              { required: true, message: 'Please input your task name!' },
            ]}
          >
            <Input
              placeholder="Task Name"
              defaultValue={taskName}
              onBlur={(e) => setTaskName(e.target.value)}
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

          <Form.Item
            //label="Password"
            name="description"
            //rules={[{ required: true, message: "Please input your password!" }]}
          >
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
          {/* <Form.Item name="attachment">
            <Dragger {...props}>
              <p className="ant-upload-text">
                Drag & drop or <a href="#">browse</a>
              </p>
            </Dragger>
          </Form.Item> */}

          <Space align="baseline" size={20}>
            <Tooltip placement="top" title="Priority">
              <Form.Item
                //label="Password"
                name="priority"
                //rules={[{ required: true, message: "Select Folder" }]}
              >
                <DropdownProps type={'Priority'} text={'Medium'} id={taskKey} />
              </Form.Item>
            </Tooltip>

            <Form.Item
              //label="Password"
              name="dueDate"
              //rules={[{ required: true, message: 'Select Date' }]}
            >
              <Space direction="horizontal">
                {/* <Dropdown
                  menu={{
                    items,
                    onClick: handleMenuClick,
                  }}
                  onOpenChange={handleOpenChange}
                  open={openMenu}
                  trigger={['click']}
                >
                  <Button shape="circle">
                    <FontAwesomeIcon icon={faCalendar} />
                  </Button>
                </Dropdown> */}
                <DatePicker
                  placeholder="Due date"
                  showTime={{
                    format: 'HH:mm:ss',
                    defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
                  }}
                  format={customFormat}
                  onChange={onChangeDate}
                  suffixIcon={<FontAwesomeIcon icon={faCalendar} />}
                  bordered={false}
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
          <Form.Item>
            <center>
              <Button type="primary" htmlType="submit">
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
