import React, { useEffect, useState } from "react";
import { Space, Tabs } from "antd";
import TaskList from "./table/TaskList";
import { Task } from "../data/entity/task";
import TaskListOverDue from "./table/TaskListOverdue";
import { Tasks } from "../data/database/Tasks";

interface TaskInput{
  assigneeTask : Tasks[],
  otherTask: Tasks[],
  assigneeTaskNum : number,
  otherTaskNum :number
}

const OnChange = (key: string) => {
  console.log(key);
};

const App: React.FC<TaskInput> = ({assigneeTask,otherTask,assigneeTaskNum,otherTaskNum}) => {
  

  return(
    <Tabs
    defaultActiveKey="1"
    onChange={OnChange}
    items={[
      {
        label: <Space align="center">My task <p style={{padding: '0px 4px 0px 4px',border:'1px solid',borderRadius:'10px',fontSize:'11px' }}>{assigneeTaskNum}</p></Space>,
        key: "1",
        children: <TaskList inputData={assigneeTask} showMore={true} increment={3}/>,
      },
      {
        label: <Space align="center">Report to me <p style={{padding: '0px 4px 0px 4px',border:'1px solid',borderRadius:'10px',fontSize:'11px'}}>{otherTaskNum}</p></Space>,
        key: "2",
        children: <TaskListOverDue inputData={otherTask} showMore={false} increment={3}/>,
      },
    ]}
  />
)};

export default App;
