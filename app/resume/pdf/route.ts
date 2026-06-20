import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export function GET() {
  const filePath = join(process.cwd(), 'public', 'resume.pdf')
  const file = readFileSync(filePath)

  // convert Buffer to Uint8Array so it matches BodyInit types
  const body = new Uint8Array(file)

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="resume.pdf"',
    },
  })
}
