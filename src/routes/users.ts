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

    let sectionId = req.cookies.sectionId

    if (!sectionId) {
      sectionId = randomUUID()

      reply.cookie('sectionId', sectionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      })
    }

    await knex('users').insert({ id: randomUUID(), name, password, sectionId })

    return reply.status(201).send()
  })

  app.get('/', async (req, reply) => {
    const users = await knex('users').select('*')

    reply.status(200).send(users)
  })
}
