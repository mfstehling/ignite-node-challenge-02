import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const usersCreateSchema = z.object({
      name: z.string(),
      password: z.string(),
    })

    const { name, password } = usersCreateSchema.parse(req.body)

    await knex('users').insert({ id: randomUUID(), name, password })

    return reply.status(201).send()
  })
}
