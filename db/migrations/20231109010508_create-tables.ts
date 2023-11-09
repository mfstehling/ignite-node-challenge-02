import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('password').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('description').notNullable()
        table.date('date').notNullable()
        table.string('hour').notNullable()
        table.uuid('user_id').references('id').inTable('users')
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTable('users')
   await knex.schema.dropTable('meals')
}

