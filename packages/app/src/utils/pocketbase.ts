import PocketBase, { type RecordService } from 'pocketbase'
import { config } from './config'

export type User = {
  email: string
  name?: string
  avatar?: string
}

export type Todo = {
  id: string
  title: string
  completed: boolean
  // id of owner
  user: string
  // these two are not relations, we just save them as raw strings in the database
  // assignees come from the random user api
  assignee_name: string
  assignee_avatar: string
}

interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService // default fallback for any other collection
  collection(idOrName: 'users'): RecordService<User>
  collection(idOrName: 'todos'): RecordService<Todo>
}

export const pb = new PocketBase(config.authUrl) as TypedPocketBase
