import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSectionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkSectionIdExists] }, async (req, reply) => {
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

  app.put(
    '/:id',
    { preHandler: [checkSectionIdExists] },
    async (req, reply) => {
      const mealsGetSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = mealsGetSchema.parse(req.params)

      const mealsEditSchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        date: z.coerce.date().optional(),
        hour: z.string().optional(),
        isInDiet: z.boolean().optional(),
      })

      const { name, description, date, hour, isInDiet } = mealsEditSchema.parse(
        req.body,
      )

      await knex('meals').where({ id }).update({
        name,
        description,
        date,
        hour,
        isInDiet,
      })

      return reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSectionIdExists] },
    async (req, reply) => {
      const mealsGetSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = mealsGetSchema.parse(req.params)

      await knex('meals').where({ id }).delete()

      return reply.status(200).send()
    },
  )

  app.get('/:userId', { preHandler: [checkSectionIdExists] }, async (req) => {
    const mealsGetSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = mealsGetSchema.parse(req.params)

    const meals = await knex('meals').where({ userId })

    return { meals }
  })

  app.get('/meal/:id', { preHandler: [checkSectionIdExists] }, async (req) => {
    const mealGetSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = mealGetSchema.parse(req.params)

    const meals = await knex('meals').where({ id })

    return { meals }
  })

  app.get(
    '/resume/total/:userId',
    { preHandler: [checkSectionIdExists] },
    async (req) => {
      const mealGetSchema = z.object({
        userId: z.string().uuid(),
      })

      const { userId } = mealGetSchema.parse(req.params)

      const totalMeals = await knex('meals')
        .where({ userId })
        .count('userId', { as: 'total' })

      return { totalMeals }
    },
  )

  app.get(
    '/resume/:userId',
    { preHandler: [checkSectionIdExists] },
    async (req) => {
      const mealGetSchema = z.object({
        userId: z.string().uuid(),
      })

      const { userId } = mealGetSchema.parse(req.params)

      const [total, onDiet, offDiet, bestSequence] = await Promise.all([
        knex('meals')
          .where({ userId })
          .count('userId', { as: 'total' })
          .first(),
        knex('meals')
          .where({ userId, isInDiet: true })
          .count({ isInDiet: 'isInDiet' })
          .first(),
        knex('meals')
          .where({ userId, isInDiet: false })
          .count({ isNotInDiet: 'isInDiet' })
          .first(),
        knex('meals')
          .where({ isInDiet: true, userId })
          .sum('isInDiet', { as: 'bestSequence' })
          .orderBy('isInDiet', 'desc')
          .limit(1)
          .first(),
      ])

      return { total, onDiet, offDiet, bestSequence }
    },
  )
}
