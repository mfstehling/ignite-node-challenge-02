import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSectionIdExists(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { sectionId } = req.cookies

  if (!sectionId) {
    reply.status(401).send({
      error: 'Unathorized section',
    })
  }
}
