import { useState, type FunctionComponent } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Todo } from '~/utils/pocketbase'

export const TodoItem: FunctionComponent<{
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onUpdateTitle: (newTitle: string) => void
}> = ({ todo, onToggle, onDelete, onUpdateTitle }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    onUpdateTitle(editedTitle)
    setIsEditing(false)
  }

  const handleCancelClick = () => {
    setEditedTitle(todo.title)
    setIsEditing(false)
  }

  return (
    <Card className='mb-2'>
      <CardContent className='flex items-center justify-between p-4'>
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

        <div className='flex space-x-2'>
          {isEditing ? (
            <>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleSaveClick}
                className='text-green-600 hover:text-green-700 hover:bg-green-100'
              >
                <Check className='h-4 w-4' />
                <span className='sr-only'>Save todo</span>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleCancelClick}
                className='text-red-600 hover:text-red-700 hover:bg-red-100'
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
              className='text-blue-600 hover:text-blue-700 hover:bg-blue-100'
            >
              <Edit2 className='h-4 w-4' />
              <span className='sr-only'>Edit todo</span>
            </Button>
          )}

          <Button
            variant='ghost'
            size='icon'
            onClick={onDelete}
            className='text-destructive hover:text-destructive hover:bg-destructive/10'
          >
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Delete todo</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
