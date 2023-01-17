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
  TreeSelect,
  Upload,
} from 'antd'
import type { UploadProps, MenuProps, DatePickerProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPlus, faTags } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/index.css'
import { InboxOutlined } from '@ant-design/icons'
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
import UserIcon from './UserIcon'
import { InsertTask } from '../data/tasks'
import { InputTasks } from '../data/database/InputTasks'
import OverDueDate from '../util/OverDueDate'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface ItemProps {
  label: string
  value: string
}

let taskKey = 'Item'
let dueDate = ''

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

const CustomFloatButton: React.FC = () => {
  const [editorValue, setEditorValue] = useState('')
  const _id = sessionStorage.getItem('user_id')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState<string[]>([])

  const [openMenu, setOpenMenu] = useState(false)

  const [openWatcher, setWatcher] = useState(false)

  const [rep, setRep] = useState('')

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '3') {
      setOpenMenu(false)
    }
  }

  const handleOpenChange = (flag: boolean) => {
    setOpenMenu(flag)
  }

  const handleOpenWatcher = (flag: boolean) => {
    setWatcher(flag)
  }

  useEffect(() => {
    assigneeOptions = []
    reporterOptions = []
    //console.log('Assignee ' + assigneeOptions.length)
    //if (assigneeOptions.length === 0) {
    GetUserByType(
      'api/users/getReporterOrAssignee',
      'assignee',
      sessionStorage.getItem('user_id')?.toString(),
    ).then((r) => {
      if (r.length > 0) {
        r.forEach((value) => {
          const su = assigneeOptions.filter((obj) => obj.value === value._id)
          if (su.length === 0) {
            assigneeOptions.push({
              label: value.Name as string,
              value: value._id as string,
            })
          }
        })
      }
    })
    //}

    //if (reporterOptions.length === 0) {
    console.log('Userid ' + sessionStorage.getItem('user_id'))
    GetUserByType(
      'api/users/getReporterOrAssignee',
      'reporter',
      sessionStorage.getItem('user_id')?.toString(),
    ).then((r) => {
      if (r.length > 0) {
        r.forEach((value) => {
          const su = reporterOptions.filter((obj) => obj.value === value._id)
          if (su.length === 0) {
            reporterOptions.push({
              label: value.Name as string,
              value: value._id as string,
            })
          }
        })
      }
    })
    //}
  }, [assigneeOptions, reporterOptions])

  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options: assigneeOptions,
    onChange: (newValue: string[]) => {
      setValue(newValue)
    },
    placeholder: 'Assign to',
    maxTagCount: 'responsive',
  }

  const [form] = Form.useForm()
  let taskName = Form.useWatch('taskname', form)
  let group = Form.useWatch('group', form)
  let description = Form.useWatch('description', form)

  const onChangeReporter = (value: string) => {
    setRep(value)
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

    const users: Users[] = []
    const reporter: Users = {
      _id: rep ? rep : (sessionStorage.getItem('user_id') as string),
    }
    const assigneesString = (selectProps.value + '') as string
    //console.log('Assignee ' + assigneesString)
    const assignees = assigneesString.split(',')
    assignees.forEach((value) => {
      if (value !== '') {
        users.push({
          _id: value,
        })
      }
    })

    if (users.length === 0) {
      users.push({
        _id: sessionStorage.getItem('user_id') as string,
      })
    }

    const myTask: InputTasks = {
      TaskName: taskName,
      Description: description,
      Priority: sessionStorage.getItem('priority' + taskKey)?.toString()
        ? sessionStorage.getItem('priority' + taskKey)?.toString()
        : 'Medium',
      CreateDate: new Date(),
      //StartDate: new Date(startDate),
      DueDate: new Date(dueDate),
      Status: sessionStorage.getItem('status' + taskKey)?.toString()
        ? sessionStorage.getItem('status' + taskKey)?.toString()
        : 'To do',
      Assignee: users,
      Reporter: reporter,
      GroupPath: group,
    }

    InsertTask('api/task/', myTask).then((r) => {
      //console.log(r)
      form.resetFields()
      clearData()
      setOpen(false)
      sessionStorage.setItem('priority' + taskKey, 'Medium')
      sessionStorage.setItem('status' + taskKey, 'To do')
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
            <Input placeholder="Task Name" />
          </Form.Item>

          <Space align="baseline">
            <Form.Item name="assignee">
              {/* <UserListComp /> */}
              <Space direction="vertical" style={{ width: '25vw' }}>
                <Select {...selectProps} />
              </Space>
            </Form.Item>
            <Form.Item name="reporter">
              {/* <UserListComp /> */}
              <Space direction="vertical" style={{ width: '15vw' }}>
                <Select
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
              </Space>
            </Form.Item>
          </Space>
          <Form.Item
            //label="Password"
            name="description"
            //rules={[{ required: true, message: "Please input your password!" }]}
          >
            <TextArea placeholder="Description" allowClear />
            {/* <ReactQuill
              theme="snow"
              value={editorValue}
              onChange={setEditorValue}
            /> */}
          </Form.Item>
          <Form.Item name="attachment">
            <Dragger {...props}>
              {/* <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p> */}
              <p className="ant-upload-text">
                Drag & drop or <a href="#">browse</a>
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
                <DropdownProps type={'Priority'} text={'Medium'} id={taskKey} />
              </Form.Item>
            </Tooltip>

            <Form.Item
              //label="Password"
              name="dueDate"
              //rules={[{ required: true, message: 'Select Date' }]}
            >
              <Space direction="horizontal">
                <Dropdown
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
                </Dropdown>
                {dueDate !== '' && (
                  <OverDueDate inputDate={new Date(dueDate)} />
                )}
              </Space>
            </Form.Item>

            <Form.Item
              //label="Password"
              name="tags"
              //rules={[{ required: true, message: "Select Folder" }]}
            >
              <Button shape="circle">
                <FontAwesomeIcon icon={faTags} />
              </Button>
            </Form.Item>
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
