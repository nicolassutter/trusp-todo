// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../auth/pb_data/types.d.ts" />

import PocketBase, { type RecordService } from 'pocketbase'
import { config } from './config'

export type User = auth.AuthUser

export type Todo = {
  id: string
  title: string
  completed: boolean
  // id of owner
  user: string
}

interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService // default fallback for any other collection
  collection(idOrName: 'users'): RecordService<User>
  collection(idOrName: 'todos'): RecordService<Todo>
}

export const pb = new PocketBase(config.authUrl) as TypedPocketBase
