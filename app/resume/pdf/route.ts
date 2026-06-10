import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export function GET() {
  const filePath = join(process.cwd(), 'private', 'resume.pdf')
  const file = readFileSync(filePath)

  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="resume.pdf"',
    },
  })
}
