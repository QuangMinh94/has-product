import axios from 'axios'
import { InputTasks } from './database/InputTasks'
import { Tasks } from './database/Tasks'
import { Users } from './database/Users'

const GetAllTasks = async (serviceUrl: string) => {
  await axios.get(serviceUrl).then((res) => {
    const data = res.data
    return data
  })
}

const GetTasksById = async (serviceUrl: string, taskId: string) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETONETASK!
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      { taskId: taskId, populateLevel: 1 },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      //const data = res.data
    })
  return output
}

const GetNotDoneTasksAssignee = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETNOTDONETASK!
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      {
        assigneeid: userId,
        populateLevel: populateLevel,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      //console.log('Assignee result ' + count.toString())
      return output
    })
    .catch(function (error) {
      console.log('Assignee ' + error)
    })
  return output
}

const GetNotDoneTasksReporter = async (
  serviceUrl: string,
  userId: string,
  populateLevel: number = 1,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_GETNOTDONETASK!
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      {
        reporterid: userId,
        populateLevel: populateLevel,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      return output
    })
    .catch(function (error) {
      console.log('Reporter ' + error)
    })
  return output
}

const InsertTask = async (
  serviceUrl: string = process.env.REACT_APP_API_TASK_ADDTASKWITHSUBTASK!,
  task: any,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK_ADDTASKWITHSUBTASK!
  let user: Users = {}
  let output: Tasks = {
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    StartDate: new Date(),
    DueDate: new Date(),
    Assignee: [],
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: '',
    Reporter: user,
    GroupPath: '',
  }
  await axios
    .post<Tasks>(serviceUrl, task, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      return output
    })
    .catch(function (error) {
      console.log(error)
    })
  return output
}

const UpdateTask = async (
  serviceUrl: string,
  taskId: string,
  task: InputTasks,
) => {
  serviceUrl = process.env.REACT_APP_API_TASK! + '/' + taskId
  let user: Users = {}
  let output: Tasks = {
    TaskName: '',
    Description: '',
    Priority: '',
    CreateDate: new Date(),
    StartDate: new Date(),
    DueDate: new Date(),
    Assignee: [],
    Watcher: [],
    Tag: [],
    Subtask: [],
    Attachment: [],
    Comment: [],
    Status: '',
    Reporter: user,
    GroupPath: '',
  }
  await axios
    .put<Tasks>(serviceUrl, JSON.stringify(task), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      output = JSON.parse(JSON.stringify(res.data))
      return output
    })
    .catch(function (error) {
      console.log(error)
    })
  return output
}

export {
  GetNotDoneTasksAssignee,
  GetNotDoneTasksReporter,
  GetAllTasks,
  InsertTask,
  UpdateTask,
  GetTasksById,
}
