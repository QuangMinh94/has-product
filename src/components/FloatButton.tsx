import React, { useEffect, useState } from 'react'
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
  TreeSelect,
  Upload,
} from 'antd'
import type { UploadProps, MenuProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPlus, faTags } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/index.css'
import { InboxOutlined } from '@ant-design/icons'
import Description from '../components/description'
import DropdownProps from './Dropdown'
import type { RangePickerProps } from 'antd/es/date-picker'
import type { SelectProps } from 'antd'
import { Users } from '../data/database/Users'
import { InsertTask } from '../data/tasks'
import { InputTasks } from '../data/database/InputTasks'
import GetAllUsers from '../data/allUsers'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import TextArea from 'antd/es/input/TextArea'

interface ItemProps {
  label: string
  value: string
}

let startDate = ''
let dueDate = ''

let options: ItemProps[] = []

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

const { RangePicker } = DatePicker

const onChange = (date: Dayjs) => {
  if (date) {
    console.log('Date: ', date)
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
    startDate = dateStrings[0]
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

const items: MenuProps['items'] = [
  {
    label: (
      <RangePicker
        presets={rangePresets}
        showTime
        format="YYYY/MM/DD HH:mm:ss"
        onChange={onRangeChange}
      />
    ),
    key: '0',
  },
]

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

const CustomFloatButton: React.FC = () => {
  const _id = sessionStorage.getItem('user_id')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState<string[]>([])

  useEffect(() => {
    GetAllUsers('api/users/getalluser').then((r) => {
      if (r.length > 0) {
        r.forEach((value) => {
          const su = options.filter((obj) => obj.value === value._id)
          if (su.length === 0) {
            options.push({
              label: value.Name as string,
              value: value._id as string,
            })
          }
        })
      }
      console.log(r.length)
    })
  }, [])
  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options,
    onChange: (newValue: string[]) => {
      setValue(newValue)
    },
    placeholder: 'Select Assignee...',
    maxTagCount: 'responsive',
  }

  const [form] = Form.useForm()
  let taskName = Form.useWatch('taskname', form)
  let group = Form.useWatch('group', form)
  let description = Form.useWatch('description', form)
  //let someDate = Form.useWatch('someDate', form)

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
    console.log('Success:', values)
    console.log('My taskname :' + taskName)
    //call service here

    const users: Users[] = []
    const reporter: Users = {
      _id: sessionStorage.getItem('user_id') as string,
    }
    const assigneesString = (selectProps.value + '') as string
    console.log('Assignee ' + assigneesString)
    const assignees = assigneesString.split(',')
    assignees.forEach((value) => {
      users.push({
        _id: value,
      })
    })

    const myTask: InputTasks = {
      TaskName: taskName,
      Description: description,
      Priority: sessionStorage.getItem('priority')?.toString()
        ? sessionStorage.getItem('priority')?.toString()
        : 'Undefined',
      CreateDate: new Date(),
      StartDate: new Date(startDate),
      DueDate: new Date(dueDate),
      Status: sessionStorage.getItem('status')?.toString()
        ? sessionStorage.getItem('status')?.toString()
        : 'To do',
      Assignee: users,
      Reporter: reporter,
      GroupPath: group,
    }

    InsertTask('api/task/', myTask).then((r) => {
      console.log(r)
      form.resetFields()
      clearData()
      setOpen(false)
    })
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
        width="50vw"
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
            <Input placeholder="Task Name" />
          </Form.Item>

          <Space align="baseline">
            <Form.Item
              //label="Password"
              name="group"
              rules={[{ required: true, message: 'Please select group' }]}
            >
              <TreeSelect
                placeholder="Select folder"
                showSearch
                allowClear
                style={{ width: '15vw' }}
                treeData={[
                  {
                    title: 'HAS',
                    value: 'HAS',
                    children: [
                      {
                        title: 'Công việc chung',
                        value: 'HAS/Công việc chung',
                      },
                      { title: 'BPM BIDV', value: 'HAS/BPM BIDV' },
                      { title: 'RPA VTB', value: 'HAS/RPA VTB' },
                    ],
                  },
                ]}
              />
            </Form.Item>
            <p>Assign to</p>
            <Form.Item name="assignee">
              {/* <UserListComp /> */}
              <Space direction="vertical" style={{ width: '25vw' }}>
                <Select {...selectProps} />
              </Space>
            </Form.Item>
          </Space>
          <Form.Item
            //label="Password"
            name="description"
            //rules={[{ required: true, message: "Please input your password!" }]}
          >
            <TextArea placeholder="Description" allowClear />
          </Form.Item>
          <Form.Item name="attachment">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              {/* <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p> */}
            </Dragger>
          </Form.Item>

          <Space align="baseline" size={20}>
            <Tooltip placement="top" title="Status">
              <Form.Item
                //label="Password"
                name="status"
                //rules={[{ required: true, message: "Select Folder" }]}
              >
                <DropdownProps type={'Status'} text={'To do'} />
              </Form.Item>
            </Tooltip>
            <Tooltip placement="top" title="Priority">
              <Form.Item
                //label="Password"
                name="priority"
                //rules={[{ required: true, message: "Select Folder" }]}
              >
                <DropdownProps type={'Priority'} text={'Undefined'} />
              </Form.Item>
            </Tooltip>

            <Form.Item
              //label="Password"
              name="watcher"
              //rules={[{ required: true, message: "Select Folder" }]}
            >
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faEye} size="1x" />
              </span>
            </Form.Item>

            <Form.Item
              //label="Password"
              name="someDate"
              rules={[{ required: true, message: 'Select Date' }]}
            >
              <RangePicker
                //presets={rangePresets}
                disabledDate={disabledDate}
                //disabledTime={disabledRangeTime}
                showTime
                format="YYYY/MM/DD HH:mm:ss"
                onChange={onRangeChange}
              />
            </Form.Item>

            <Form.Item
              //label="Password"
              name="tags"
              //rules={[{ required: true, message: "Select Folder" }]}
            >
              <FontAwesomeIcon icon={faTags} />
            </Form.Item>
          </Space>
          <Form.Item>
            <center>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </center>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CustomFloatButton
