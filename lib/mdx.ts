import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const metadata: Partial<Metadata> = {}
  frontMatterBlock.trim().split('\n').forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    metadata[key.trim() as keyof Metadata] = valueArr.join(': ').trim().replace(/^['"](.*)['"]$/, '$1')
  })
  return { metadata: metadata as Metadata, content }
}

export function getMDXData(dir: string) {
  return fs.readdirSync(dir)
    .filter((file) => path.extname(file) === '.mdx')
    .map((file) => {
      const rawContent = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { metadata, content } = parseFrontmatter(rawContent)
      return { metadata, content, slug: path.basename(file, path.extname(file)) }
    })
}

export function formatDate(date: string, includeRelative = false) {
  if (!date.includes('T')) date = `${date}T00:00:00`
  const targetDate = new Date(date)
  const fullDate = targetDate.toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()
  if (!includeRelative || typeof window === 'undefined') return fullDate
  const now = new Date()
  const yearsAgo = now.getFullYear() - targetDate.getFullYear()
  const monthsAgo = now.getMonth() - targetDate.getMonth()
  const daysAgo = now.getDate() - targetDate.getDate()
  const rel = yearsAgo > 0 ? `${yearsAgo}y ago` : monthsAgo > 0 ? `${monthsAgo}mo ago` : daysAgo > 0 ? `${daysAgo}d ago` : 'Today'
  return `${fullDate} (${rel})`
}
