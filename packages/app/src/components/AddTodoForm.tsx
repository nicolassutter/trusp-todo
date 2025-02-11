import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { FunctionComponent } from 'react'
import type { RandomUser } from '~/utils/randomUsers'
import { computeAssigneeFullName } from '~/utils/randomUsers'
import { AssigneeSelect } from './AssigneeSelect'
import { SpinLoader } from './Loaders'

const formSchema = z.object({
  todoTitle: z.string().min(1, {
    message: 'Todo text must not be empty.',
  }),
  assigneeName: z.string().min(1, {
    message: 'Please select an assignee.',
  }),
})

interface AddTodoFormProps {
  onSubmit: (props: {
    title: string
    assigneeName: string
    assigneeAvatar: string
  }) => Promise<void>
  users: RandomUser[]
}

export const AddTodoForm: FunctionComponent<AddTodoFormProps> = (props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todoTitle: '',
      assigneeName: '',
    },
  })

  async function onSubmit({
    todoTitle,
    assigneeName,
  }: z.infer<typeof formSchema>) {
    await props.onSubmit({
      title: todoTitle,
      assigneeName: assigneeName,
      assigneeAvatar:
        props.users.find(
          (user) => computeAssigneeFullName(user) === assigneeName,
        )?.picture.thumbnail ?? '',
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
      >
        <FormField
          control={form.control}
          name='todoTitle'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder='Add a new todo...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='assigneeName'
          render={({ field }) => (
            <FormItem>
              <AssigneeSelect
                onValueChange={field.onChange}
                value={field.value}
                assignees={props.users.map((user) => ({
                  name: computeAssigneeFullName(user),
                  avatar: user.picture.thumbnail,
                }))}
              ></AssigneeSelect>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>
          Add Todo
          {form.formState.isSubmitting && <SpinLoader />}
        </Button>
      </form>
    </Form>
  )
}
