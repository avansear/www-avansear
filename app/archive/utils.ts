import path from 'path'
import { getMDXData } from 'lib/mdx'
export { formatDate } from 'lib/mdx'

export function getArchivePosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'archive', 'posts'))
}
