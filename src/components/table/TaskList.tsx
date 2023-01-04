import React from "react";
import { Table, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import DropdownProps from "../Dropdown";

interface DataType {
  key: string;
  status: React.ReactNode;
  task: string;
  path: string;
  priority: React.ReactNode;
  startDate: string;
  dueDate: string;
}

interface Task {
  id: string;
  task_name: string;
  priority: string;
  start_date: string;
  due_date: string;
  status: string;
  folder_path: string;
  reporter_id: string;
}

interface InputData {
  inputData: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Task",
    dataIndex: "task",
  },
  {
    title: "Path",
    dataIndex: "path",
  },
  {
    title: "Priority",
    dataIndex: "priority",
  },
  {
    title: "Start date",
    dataIndex: "startDate",
  },
  {
    title: "Due date",
    dataIndex: "dueDate",
  },
];

let data: DataType[] = [];

const TaskList: React.FC<InputData> = ({ inputData }) => {
  //do some math
  console.log("Hello " + inputData);
  if (inputData !== "") {
    let inputObj: Task[] = JSON.parse(inputData);
    inputObj.forEach(task => {
      data.push({
      "key": task.id,
      "status": <DropdownProps type="Status" text={task.status}/>,
      "task": task.task_name,
      "path": task.folder_path,
      "priority": <DropdownProps type="Priority" text={task.priority}/>,
      "startDate": task.start_date,
      "dueDate": task.due_date
      })
    });

    return (
      <>
        <Table columns={columns} dataSource={data} size="middle" />
      </>
    );
  } else {
    return <>Please wait warmly</>;
  }
};

export default TaskList;
