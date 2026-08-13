import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  const resumePath = path.join(process.cwd(), 'public', 'resume.pdf')
  const resume = await readFile(resumePath)

  return new Response(new Uint8Array(resume), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Nikita_Cherepov_resume.pdf"',
      'Content-Length': resume.byteLength.toString(),
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  })
}
