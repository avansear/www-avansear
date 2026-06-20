import path from 'path'
import { getMDXData } from 'lib/mdx'
export { formatDate } from 'lib/mdx'

export function getProjectPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'projects', 'posts'))
}
