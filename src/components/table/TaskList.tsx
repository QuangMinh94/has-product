import React, { useState } from 'react'
import { Table, Layout, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DropdownProps from '../Dropdown'
import '../../assets/css/index.css'
import { Tasks } from '../../data/database/Tasks'
import ParagraphExample from '../ParagraphExample'
import DateFormatter from '../../util/DateFormatter'

interface DataType {
  key: string
  status: React.ReactNode
  task: React.ReactNode
  path: string
  priority: React.ReactNode
  startDate: React.ReactNode
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
    width: '35vw',
  },
  {
    title: 'Path',
    dataIndex: 'path',
    width: '14vw',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    align: 'center',
    width: '13vw',
  },
  {
    title: 'Start date',
    dataIndex: 'startDate',
    width: '10vw',
  },
  {
    title: 'Due date',
    dataIndex: 'dueDate',
    width: '10vw',
  },
]

let countIndex = 0
let inputLength = 0
let inputObj: Tasks[] = []

const TaskList: React.FC<InputData> = ({ inputData, showMore, increment }) => {
  const [isShowMore, setShowMore] = useState(true)
  let data: DataType[] = []
  let noButton = false
  console.log('Input ' + inputData)
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
        status: <DropdownProps type="Status" text={inputObj[index].Status} />,
        task: <ParagraphExample name={inputObj[index].TaskName} />,
        path: inputObj[index].GroupPath,
        priority: (
          <DropdownProps type="Priority" text={inputObj[index].Priority} />
        ),
        startDate: <DateFormatter dateString={inputObj[index].StartDate} />,
        dueDate: (
          <>
            {new Date(inputObj[index].DueDate) < new Date() ? (
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
          <center>
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
