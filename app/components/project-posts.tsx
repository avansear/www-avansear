import Link from 'next/link'
import { formatDate, getProjectPosts } from '../projects/utils'

export function ProjectPosts() {
  let allProjects = getProjectPosts()

  return (
    <div>
      {allProjects
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/projects/${post.slug}`}
          >
            <div className="w-full flex flex-row space-x-2">
              <p className="text-[#ffd9f4]/50 w-fit tabular-nums flex-shrink-0">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-[#14000f] dark:text-[#ffd9f4] tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
} 