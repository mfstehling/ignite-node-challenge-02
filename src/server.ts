import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async (req, reply) => {
  const test = knex('sqlite_schema').select('*')
  return test
})

app
  .listen({
    port: 3334,
  })
  .then(() => {
    console.log('listening on port 3334')
  })
