import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const mealsCreateSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      hour: z.string(),
      isInDiet: z.boolean(),
      userId: z.string(),
    })

    const { name, description, date, hour, isInDiet, userId } =
      mealsCreateSchema.parse(req.body)

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date,
      hour,
      isInDiet,
      userId,
    })

    return reply.status(201).send()
  })
}
