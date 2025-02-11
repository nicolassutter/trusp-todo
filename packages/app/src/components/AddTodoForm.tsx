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

const formSchema = z.object({
  todoTitle: z.string().min(1, {
    message: 'Todo text must not be empty.',
  }),
})

interface AddTodoFormProps {
  onSubmit: (title: string) => void
}

export const AddTodoForm: FunctionComponent<AddTodoFormProps> = (props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todoTitle: '',
    },
  })

  function onSubmit({ todoTitle }: z.infer<typeof formSchema>) {
    props.onSubmit(todoTitle)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='todoTitle'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='flex space-x-2'>
                  <Input
                    placeholder='Add a new todo...'
                    {...field}
                  />

                  <Button type='submit'>Add</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
