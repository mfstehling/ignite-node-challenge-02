// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    users: {
      id: string
      name: string
      password: string
      created_at: string
      sectionId?: string
    }
    meals: {
      id: string
      name: string
      description: string
      date: date
      hour: string
      userId: string
      created_at: string
      isInDiet: boolean
    }
  }
}
