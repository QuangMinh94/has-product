import React, { useState } from 'react'
import { Table, Layout, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DropdownProps from '../Dropdown'
import '../../assets/css/index.css'
import ParagraphExample from '../ParagraphExample'
import { Tasks } from '../../data/database/Tasks'
import DateFormatter from '../../util/DateFormatter'
import IconGroup from '../IconGroup'
import TaskDetails from '../../pages/TaskDetails'
import { CustomRoutes } from '../../customRoutes'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getCookie } from 'typescript-cookie'
import { Role } from '../../data/database/Role'
import { Status } from '../../data/entity/Status'

interface DataType {
  key: string
  status: React.ReactNode
  task: React.ReactNode
  path?: string
  assignee: React.ReactNode
  priority: React.ReactNode
  startDate?: React.ReactNode
  dueDate: React.ReactNode
}

interface InputData {
  inputData: Tasks[]
  showMore: boolean
  increment: number
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    width: '5vw',
  },
  {
    title: 'Task',
    dataIndex: 'task',
    width: '30vw',
  },
  /*  {
    title: 'Path',
    dataIndex: 'path',
    width: '14vw',
  }, */
  {
    title: 'Assignee',
    dataIndex: 'assignee',
    width: '12vw',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    align: 'center',
    width: '10vw',
  },
  /* {
    title: 'Start date',
    dataIndex: 'startDate',
    width: '10vw',
  }, */
  {
    title: 'Due date',
    dataIndex: 'dueDate',
    width: '10vw',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    width: '10vw',
  },
]

let countIndex = 0
let inputLength = 0
let inputObj: Tasks[] = []
//let isLoaded = false

const TaskListOverDue: React.FC<InputData> = ({
  inputData,
  showMore,
  increment,
}) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [modalData, setModalData] = useState<Tasks>()
  const [isShowMore, setShowMore] = useState(true)

  let data: DataType[] = []
  let noButton = false
  //do some math
  const ShowMore = (startPositon: number, endPosition: number) => {
    setShowMore(false)
  }

  const OnNavigate = (taskData: Tasks) => {
    //setOpen(true)
    //setModalData(taskData)
    // return <TaskDetails openModal={open} taskData={modalData} />
    navigate(
      CustomRoutes.TaskDetails.path + '/' + taskData._id,
      {
        state: {
          search: '/' + taskData._id, // query string
          // location state
        },
      } /* {
      state: {
        search: '/' + taskData._id, // query string
        // location state
        taskData: taskData,
      },
    } */,
    )
  }

  if (inputData.length !== 0) {
    //const options =
    //isLoaded = true
    //data = [];
    inputObj = inputData
    inputLength = inputObj.length

    inputObj.forEach((element) => {
      if (element.Priority === 'Urgent') {
        element.PriorityNum = 1
      } else if (element.Priority === 'High') {
        element.PriorityNum = 2
      } else if (element.Priority === 'Medium') {
        element.PriorityNum = 3
      } else if (element.Priority === 'Low') {
        element.PriorityNum = 4
      } else {
        element.PriorityNum = 5
      }
    })
    inputObj = inputObj.sort(
      (a, b) =>
        new Date(b.DueDate!).getTime() - new Date(a.DueDate!).getTime() ||
        (a.PriorityNum as number) - (b.PriorityNum as number) ||
        new Date(b.CreateDate).getTime() - new Date(a.CreateDate).getTime(),
    )

    const role: Role = JSON.parse(getCookie('userInfo') as string).Role
    let ignoreStt: Status[] = [
      {
        id: 1,
      },
      {
        id: 4,
      },
    ]
    if (role.Level >= 5) {
      ignoreStt.push({
        id: 6,
      })
    }

    for (let index = 0; index < inputLength; index++) {
      data.push({
        key: inputObj[index]._id ? index.toString() : index.toString(),
        status: (
          <DropdownProps
            type="Status"
            text={inputObj[index].Status ? inputObj[index].Status : 'undefined'}
            button={false}
            taskId={inputObj[index]._id}
            ignoreStt={ignoreStt}
          />
        ),
        task: (
          <div onClick={() => OnNavigate(inputObj[index])}>
            <ParagraphExample name={inputObj[index].TaskName} />
          </div>
        ),
        /* name={inputObj[index].TaskName} */
        //path: inputObj[index].GroupPath,
        assignee: <IconGroup inputList={inputObj[index].Assignee} />,
        priority: (
          <DropdownProps
            type="Priority"
            text={
              inputObj[index].Priority ? inputObj[index].Priority : 'undefined'
            }
            button={false}
            taskId={inputObj[index]._id}
            ignoreStt={ignoreStt}
          />
        ),
        //startDate: <DateFormatter dateString={inputObj[index].StartDate} />,
        dueDate: (
          <>
            {inputObj[index].DueDate === null ? (
              ''
            ) : new Date(inputObj[index].DueDate!) < new Date() ? (
              <div className="overdue">
                <DateFormatter dateString={inputObj[index].DueDate!} />
              </div>
            ) : (
              <div>
                <DateFormatter dateString={inputObj[index].DueDate!} />
              </div>
            )}
          </>
        ),
      })
      countIndex++
    }
  }

  if (showMore === true) {
    if (isShowMore === false) {
      noButton = false
    } else {
      noButton = true
    }
  }
  return (
    <>
      <Layout>
        <Table
          pagination={false}
          columns={columns}
          dataSource={data}
          scroll={{ y: 500 }}
          size="middle"
        />
        {noButton === true && (
          <center>
            <br />
            <Button
              type="primary"
              onClick={() => ShowMore(countIndex, inputLength)}
            >
              Show more {data.length}
            </Button>
          </center>
        )}
      </Layout>
    </>
  )
}

export default TaskListOverDue
