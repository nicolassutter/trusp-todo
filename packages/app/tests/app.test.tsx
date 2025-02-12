import { expect, it, vi, beforeEach, describe } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { App } from '@/main'
import { TodoItem } from '@/components/TodoItem'
import { AddTodoForm } from '@/components/AddTodoForm'
import type { Todo } from '~/utils/pocketbase'
import type { RandomUser } from '~/utils/randomUsers'
import { ModeToggle } from '~/components/ModeToggle'
import userEvent from '@testing-library/user-event'

const johnDoeAvatar = 'https://example.com/avatar.jpg'

const users: RandomUser[] = [
  {
    name: {
      first: 'John',
      last: 'Doe',
    },
    picture: {
      thumbnail: johnDoeAvatar,
    },
  },
  {
    name: {
      first: 'Jane',
      last: 'Smith',
    },
    picture: {
      thumbnail: 'https://example.com/avatar2.jpg',
    },
  },
]

describe('App', () => {
  it('renders the app to the DOM', async () => {
    render(<App />)

    const pendingComponent = screen.getByTestId('pendingComponent')
    expect(pendingComponent).toBeInTheDocument()

    const root = await screen.findByTestId('root')
    expect(root).toBeInTheDocument()
  })
})

describe('Theme', () => {
  it('should have a theme toggle button', async () => {
    render(<App />)
    const modeToggle = await screen.findByText('Toggle theme')
    expect(modeToggle).toBeInTheDocument()
  })

  describe('when the theme toggle button is clicked', () => {
    beforeEach(() => {
      render(<ModeToggle />)
    })

    it('should change the theme', async () => {
      const button = screen.getByText('Toggle theme')

      async function trigger() {
        await userEvent.click(button, {
          pointerState: await userEvent.pointer({ target: button }),
        })
      }

      await trigger()
      fireEvent.click(screen.getByText('Dark'))
      expect(document.documentElement).toHaveClass('dark')

      await trigger()
      fireEvent.click(screen.getByText('Light'))
      expect(document.documentElement).not.toHaveClass('dark')
      expect(document.documentElement).toHaveClass('light')
    })
  })
})

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    assignee_name: 'John Doe',
    assignee_avatar: 'https://example.com/avatar.jpg',
    user: 'user1',
  }

  const mockFunctions = {
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
  }

  beforeEach(() => {
    render(
      <TodoItem
        todo={mockTodo}
        users={users}
        onToggle={mockFunctions.onToggle}
        onDelete={mockFunctions.onDelete}
        onUpdate={mockFunctions.onUpdate}
      />,
    )
  })

  it('renders the todo item', () => {
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox is clicked', () => {
    fireEvent.click(screen.getByRole('checkbox'))
    expect(mockFunctions.onToggle).toHaveBeenCalled()
  })

  it('enters edit mode when edit button is clicked', () => {
    fireEvent.click(screen.getByText('Edit todo'))
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    fireEvent.click(screen.getByText('Delete todo'))
    expect(mockFunctions.onDelete).toHaveBeenCalled()
  })
})

describe('AddTodoForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    render(
      <AddTodoForm
        onSubmit={mockOnSubmit}
        users={users}
      />,
    )
  })

  it('renders the form', () => {
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument()
    expect(screen.getByText('Select an assignee')).toBeInTheDocument()
  })

  it('calls onSubmit with correct data when form is submitted', async () => {
    fireEvent.change(screen.getByPlaceholderText('Add a new todo...'), {
      target: { value: 'New Todo' },
    })
    fireEvent.click(screen.getByText('Select an assignee'))
    fireEvent.click(screen.getByText('John Doe', { selector: 'div' }))
    fireEvent.click(screen.getByText('Add Todo'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Todo',
        assigneeName: 'John Doe',
        assigneeAvatar: johnDoeAvatar,
      })
    })
  })

  it('shows validation errors when form is submitted without data', async () => {
    fireEvent.click(screen.getByText('Add Todo'))
    expect(
      await screen.findByText('Todo text must not be empty.'),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('Please select an assignee.'),
    ).toBeInTheDocument()
  })
})
