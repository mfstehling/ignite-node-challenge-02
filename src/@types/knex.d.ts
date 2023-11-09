import { Knex } from "knex";

declare module 'knex/types/tables' {
    interface Tables {
        users: {
            id: string
            name: string
            password: string
            created_at: string
        }
        meals: {
            id: string
            name: string
            description: string
            date: string
            hour: string
            user_id: string
            created_at: string
        }
    }
}