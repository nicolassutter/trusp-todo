import { createFileRoute } from '@tanstack/react-router'
import { requireAuth, useAuth } from '~/stores/session'
import { SpinLoader } from '~/components/Loaders'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { pb, type Todo } from '~/utils/pocketbase'
import { TodoItem } from '~/components/TodoItem'
import { AddTodoForm } from '~/components/AddTodoForm'
import { produce } from 'immer'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  beforeLoad() {
    requireAuth()
  },
})

function HomeComponent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const todosQueryOptions = queryOptions({
    queryKey: ['todos'],
    queryFn: async () => {
      const todos = await pb.collection('todos').getFullList()
      return todos
    },
  })

  const todosQuery = useQuery(todosQueryOptions)

  const createTodo = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error('User not found')

      const todo = await pb.collection('todos').create({
        title,
        user: user.id,
      })
      return todo
    },
    onSuccess() {
      queryClient.invalidateQueries(todosQueryOptions)
    },
  })

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      await pb.collection('todos').delete(id)
      return id
    },
    onSuccess(id) {
      // Optimistically update the cache without the deleted todo
      queryClient.setQueryData(todosQueryOptions.queryKey, (oldTodos) => {
        return oldTodos?.filter((todo) => todo.id !== id)
      })
    },
  })

  const updateTodoMutation = useMutation({
    mutationFn: async ({
      id,
      todo,
    }: {
      id: string
      todo: Omit<Partial<Todo>, 'id'>
    }) => {
      await pb.collection('todos').update(id, todo)
    },
    onMutate: async ({ id: todoId, todo: newTodo }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(todosQueryOptions)

      const previousTodos = queryClient.getQueryData(todosQueryOptions.queryKey)
      const previousTodo = previousTodos?.find((t) => t.id === todoId)

      queryClient.setQueryData(todosQueryOptions.queryKey, (old) => {
        return produce(old ?? [], (draft) => {
          const todo = draft.find((t) => t.id === todoId)

          if (todo) {
            Object.assign(todo, newTodo)
          }
        })
      })

      return { previousTodo }
    },
    onError: (_error, { id: todoId }, context) => {
      if (!context) return

      queryClient.setQueryData(todosQueryOptions.queryKey, (old) => {
        // Only rollback the specific todo that failed
        return produce(old ?? [], (draft) => {
          const todo = draft.find((t) => t.id === todoId)

          if (todo) {
            Object.assign(todo, context.previousTodo)
          }
        })
      })
    },
  })

  function handleUpdateTodo(id: string, todo: Omit<Partial<Todo>, 'id'>) {
    updateTodoMutation.mutate(
      { id, todo },
      {
        // specifying the onSettled on each .mutate call makes it so that the callback
        // is only called once even if multiple mutations are called at the same time.
        onSettled: () => {
          return queryClient.invalidateQueries(todosQueryOptions)
        },
      },
    )
  }

  return (
    <div className='p-4 w-full'>
      <header className='grid justify-start gap-4 pt-10'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Welcome {user?.name}
        </h1>
        {todosQuery.isPending && <SpinLoader />}
      </header>

      <main className='mt-6 grid gap-4 max-w-3xl'>
        <h2 className='mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0'>
          Manage todos
        </h2>

        <AddTodoForm
          onSubmit={(title) => {
            createTodo.mutate(title)
          }}
        ></AddTodoForm>

        <div className='grid gap-2'>
          {todosQuery.data?.map((todo) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdateTitle={(newTitle) => {
                  handleUpdateTodo(todo.id, {
                    title: newTitle,
                  })
                }}
                onToggle={() => {
                  handleUpdateTodo(todo.id, {
                    completed: !todo.completed,
                  })
                }}
                onDelete={() => {
                  deleteTodo.mutate(todo.id)
                }}
              ></TodoItem>
            )
          })}
        </div>
      </main>
    </div>
  )
}
