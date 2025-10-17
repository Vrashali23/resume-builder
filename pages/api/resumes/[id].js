import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const resume = await prisma.resume.findUnique({ where: { id } })
    if (!resume) return res.status(404).end()
    return res.status(200).json(resume)
  }

  if (req.method === 'PUT') {
    const body = req.body
    const updated = await prisma.resume.update({
      where: { id },
      data: body,
    })
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.resume.delete({ where: { id } })
    return res.status(200).json({ ok: true })
  }

  res.status(405).end()
}
