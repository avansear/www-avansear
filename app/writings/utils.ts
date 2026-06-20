import path from 'path'
import { getMDXData } from 'lib/mdx'
export { formatDate } from 'lib/mdx'

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'writings', 'posts'))
}
