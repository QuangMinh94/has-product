import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import TaskList from "./table/TaskList";
import { GetTasks } from "../data/tasks";

let myData = "";

const OnChange = (key: string) => {
 
  console.log(key);
};

const App: React.FC = () => {
  const [data, setData] = useState("");
  useEffect(()=> {
    GetTasks("/api/task/getoverduetask/", 3, "assignee").then((r) => {
      setData(JSON.stringify(r));
      myData = data;
    }).catch((err)=> console.log(err));
  },[])

  return(
    data !== "" ?
    <Tabs
    defaultActiveKey="1"
    onChange={OnChange}
    items={[
      {
        label: `My task`,
        key: "1",
        children: <TaskList inputData={data}/>,
      },
      {
        label: `Report to me`,
        key: "2",
        children: `Content of Tab Pane 2`,
      },
    ]}
  />: <h1>Wait</h1>
)};

export default App;
