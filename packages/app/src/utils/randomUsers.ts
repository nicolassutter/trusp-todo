import { z } from 'zod'

export function computeAssigneeFullName(user: RandomUser) {
  return `${user.name.first} ${user.name.last}`
}

const randomUser = z.object({
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),
  picture: z.object({
    thumbnail: z.string(),
  }),
})
export type RandomUser = z.infer<typeof randomUser>

export const randomUsersResponse = z.object({
  results: z.array(randomUser),
})
