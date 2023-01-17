import { Group } from './Group'

export interface Users {
  _id?: string
  UserName?: string
  Name?: string
  Role?: string
  Department?: string
  Color?: string
  FirstName?: string
  LastName?: string
  Group?: Group[]
}
