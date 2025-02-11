import { Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { FunctionComponent } from 'react'
import { type Todo } from '~/utils/pocketbase'

export const TodoItem: FunctionComponent<{
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}> = ({ todo, onToggle, onDelete }) => {
  return (
    <Card className='mb-2'>
      <CardContent className='flex items-center justify-between p-4'>
        <div className='flex items-center space-x-3'>
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
          />

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
        </div>

        <Button
          variant='ghost'
          size='icon'
          onClick={() => onDelete(todo.id)}
          className='text-destructive hover:text-destructive hover:bg-destructive/10'
        >
          <Trash2 className='h-4 w-4' />
          <span className='sr-only'>Delete todo</span>
        </Button>
      </CardContent>
    </Card>
  )
}
