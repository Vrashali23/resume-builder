import prisma from '../../../lib/prisma'
import { generateSummary } from '../../../lib/resumeUtils'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const resumes = await prisma.resume.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(resumes)
  }

  if (req.method === 'POST') {
    const body = req.body
    if (!body.summary || !body.summary.trim()) {
      body.summary = generateSummary(body)
    }

    const resume = await prisma.resume.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        summary: body.summary,
        skills: body.skills || [],
        education: body.education || [],
        experience: body.experience || [],
      },
    })
    return res.status(200).json(resume)
  }

  res.status(405).end()
}
