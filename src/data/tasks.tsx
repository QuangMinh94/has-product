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

const GetNotDoneTasksAssignee = async (serviceUrl: string, userId: string) => {
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      {
        assigneeid: userId,
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

const GetNotDoneTasksReporter = async (serviceUrl: string, userId: string) => {
  let output: Tasks[] = []
  await axios
    .post(
      serviceUrl,
      {
        reporterid: userId,
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

const InsertTask = async (serviceUrl: string, task: InputTasks) => {
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
    .post<Tasks>(serviceUrl, JSON.stringify(task), {
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

const UpdateTask = async (serviceUrl: string, task: InputTasks) => {
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
}
