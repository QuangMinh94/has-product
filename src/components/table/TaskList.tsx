import React, { useState } from 'react'
import { Table, Layout, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DropdownProps from '../Dropdown'
import '../../assets/css/index.css'
import { Tasks } from '../../data/database/Tasks'
import ParagraphExample from '../ParagraphExample'
import DateFormatter from '../../util/DateFormatter'
import { useNavigate } from 'react-router-dom'
import { CustomRoutes } from '../../customRoutes'

interface DataType {
  key: string
  status: React.ReactNode
  task: React.ReactNode
  path?: string
  priority: React.ReactNode
  startDate?: React.ReactNode
  dueDate: React.ReactNode
}

interface InputData {
  inputData: Tasks[]
  showMore: boolean
  increment: number
  collapseShowMore: boolean
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
    width: '35vw',
  },
  /* {
    title: 'Path',
    dataIndex: 'path',
    width: '14vw',
  }, */
  {
    title: 'Priority',
    dataIndex: 'priority',
    align: 'center',
    width: '13vw',
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
]

let countIndex = 0
let inputLength = 0
let inputObj: Tasks[] = []

const TaskList: React.FC<InputData> = ({
  inputData,
  showMore,
  increment,
  collapseShowMore,
}) => {
  const navigate = useNavigate()
  const [isShowMore, setShowMore] = useState(collapseShowMore)
  let data: DataType[] = []
  let noButton = false
  //do some math
  const ShowMore = (startPositon: number, endPosition: number) => {
    /* if (startPositon < endPosition) {
      console.log("Starting " + startPositon + endPosition);
      for (let index = startPositon; index < endPosition; index++) {
        data.push({
          key: inputObj[index].id,
          status: <DropdownProps type="Status" text={inputObj[index].status} />,
          task: inputObj[index].task_name,
          path: inputObj[index].folder_path,
          priority: (
            <DropdownProps type="Priority" text={inputObj[index].priority} />
          ),
          startDate: new Date(inputObj[index].start_date).toLocaleDateString(
            "en-GB"
          ),
          dueDate: new Date(inputObj[index].due_date).toLocaleDateString(
            "en-GB"
          ),
        });
        countIndex++;
      }
      //setData(data)
    } */
    setShowMore(false)
  }

  const OnNavigate = (taskData: Tasks) => {
    navigate(CustomRoutes.TaskDetails.path + '/' + taskData._id, {
      state: {
        search: '/' + taskData._id, // query string
        // location state
        taskData: taskData,
      },
    })
  }

  if (inputData.length !== 0) {
    //data = [];
    inputObj = inputData
    inputLength = inputObj.length
    inputObj = inputObj.sort(
      (a, b) =>
        -1 * a.Priority.localeCompare(b.Priority) ||
        new Date(b.CreateDate).getTime() - new Date(a.CreateDate).getTime(),
    )
    for (let index = 0; index < inputLength; index++) {
      data.push({
        key: inputObj[index]._id ? index.toString() : index.toString(),
        status: (
          <DropdownProps
            type="Status"
            text={inputObj[index].Status}
            button={false}
            taskId={inputObj[index]._id}
          />
        ),
        task: (
          <div onClick={() => OnNavigate(inputObj[index])}>
            <ParagraphExample name={inputObj[index].TaskName} />
          </div>
        ),
        //path: inputObj[index].GroupPath,
        priority: (
          <>
            <DropdownProps
              type="Priority"
              text={inputObj[index].Priority}
              button={false}
              taskId={inputObj[index]._id}
            />
          </>
        ),
        //startDate: <DateFormatter dateString={inputObj[index].StartDate} />,
        dueDate: (
          <>
            {inputObj[index].DueDate === null ? (
              ''
            ) : new Date(inputObj[index].DueDate) < new Date() ? (
              <div className="overdue">
                <DateFormatter dateString={inputObj[index].DueDate} />
              </div>
            ) : (
              <div>
                <DateFormatter dateString={inputObj[index].DueDate} />
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
    } else if (data.length < 3) {
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
          dataSource={isShowMore === true ? data.splice(0, 3) : data}
          scroll={{ y: 500 }}
          size="middle"
        />
        {noButton === true && (
          <center className="show-more-btn">
            <br />
            <Button onClick={() => ShowMore(countIndex, inputLength)}>
              Show more
            </Button>
          </center>
        )}
      </Layout>
    </>
  )
}

export default TaskList
