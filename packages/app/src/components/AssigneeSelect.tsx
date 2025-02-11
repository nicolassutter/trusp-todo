import type { FunctionComponent } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { FormControl } from './ui/form'

export const AssigneeSelect: FunctionComponent<{
  onValueChange: (value: string) => void
  value: string
  assignees: { name: string; avatar: string }[]
  controlled?: boolean
}> = ({ onValueChange, controlled = false, assignees, value }) => {
  const trigger = (
    <SelectTrigger className='min-w-40'>
      <SelectValue placeholder='Select an assignee' />
    </SelectTrigger>
  )

  return (
    <Select
      onValueChange={onValueChange}
      value={value}
    >
      {controlled ? <FormControl>{trigger}</FormControl> : trigger}

      <SelectContent>
        {assignees.map((assignee) => {
          return (
            <SelectItem
              key={assignee.name}
              value={assignee.name}
            >
              <div className='flex items-center'>
                <Avatar className='h-6 w-6 mr-2'>
                  <AvatarImage
                    src={assignee.avatar}
                    alt=''
                  />

                  <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {assignee.name}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
