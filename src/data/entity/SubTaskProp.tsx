import { Tasks } from '../database/Tasks'

export interface SubTaskProp {
  //key?: number
  index: number
  subTaskId: string
  task?: Tasks
}

export interface SubTaskCompProp {
  id: string
  content: React.ReactNode
}
