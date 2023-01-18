import { Users } from './Users'

export interface Tasks {
  _id?: string
  TaskName: string
  Description: string
  Priority: string
  PriorityNum?: number
  CreateDate: Date
  StartDate?: Date
  DueDate: Date
  Assignee: Users[]
  Watcher: Users[]
  Tag: string[]
  Subtask: string[]
  Attachment: any[]
  Comment: any[]
  Status: string
  Reporter: Users
  GroupPath: string
  __v?: number
}
