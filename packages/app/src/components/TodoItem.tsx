import { useState, type FunctionComponent } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Todo } from '~/utils/pocketbase'
import { computeAssigneeFullName, type RandomUser } from '~/utils/randomUsers'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { AssigneeSelect } from './AssigneeSelect'

export const TodoItem: FunctionComponent<{
  todo: Todo
  users: RandomUser[]
  onToggle: () => void
  onDelete: () => void
  onUpdate: (newTodo: Partial<Todo>) => void
}> = ({ todo, onToggle, onDelete, onUpdate, users }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)

  const [editedAssigneeName, setEditedAssigneeName] = useState(
    todo.assignee_name,
  )

  const handleEditClick = () => {
    setIsEditing(true)
  }

  /**
   * NOTE: As an improvement, we could diff the new values with the old ones
   * and only update the fields that have changed.
   */
  const handleSaveClick = () => {
    onUpdate({
      title: editedTitle,
      assignee_name: editedAssigneeName,
      assignee_avatar:
        users.find(
          (user) => computeAssigneeFullName(user) === editedAssigneeName,
        )?.picture.thumbnail ?? '',
    })

    setIsEditing(false)
  }

  const handleCancelClick = () => {
    setEditedTitle(todo.title)
    setEditedAssigneeName(todo.assignee_name)
    setIsEditing(false)
  }

  return (
    <Card className='mb-2'>
      <CardContent className='flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2'>
        <div className='flex items-center space-x-3 flex-grow'>
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={onToggle}
          />

          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className='flex-grow'
            />
          ) : (
            <label
              htmlFor={`todo-${todo.id}`}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                todo.completed
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {todo.title}
            </label>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          {isEditing ? (
            <AssigneeSelect
              value={editedAssigneeName}
              onValueChange={setEditedAssigneeName}
              assignees={users.map((user) => ({
                name: computeAssigneeFullName(user),
                avatar: user.picture.thumbnail,
              }))}
            />
          ) : (
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={todo.assignee_avatar}
                alt={todo.assignee_name}
              />
              <AvatarFallback>{todo.assignee_name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}

          {isEditing ? (
            <>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleSaveClick}
                className='text-green-600 hover:text-green-700 hover:bg-green-100 shrink-0'
              >
                <Check className='h-4 w-4' />
                <span className='sr-only'>Save todo</span>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleCancelClick}
                className='text-red-600 hover:text-red-700 hover:bg-red-100 shrink-0'
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>Cancel edit</span>
              </Button>
            </>
          ) : (
            <Button
              variant='ghost'
              size='icon'
              onClick={handleEditClick}
              className='text-blue-600 hover:text-blue-700 hover:bg-blue-100 shrink-0'
            >
              <Edit2 className='h-4 w-4' />
              <span className='sr-only'>Edit todo</span>
            </Button>
          )}

          <Button
            variant='ghost'
            size='icon'
            onClick={onDelete}
            className='text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0'
          >
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Delete todo</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
