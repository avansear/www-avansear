import { HoverButton } from './hover-button'

function ArrowIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mb-16">
              <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-[var(--color-accent)] md:flex-row md:space-x-4 md:space-y-0 dark:text-[var(--color-accent)]">
        <li>
          <HoverButton href="https://www.instagram.com/avansear/">
            <div className="flex items-center">
              <ArrowIcon />
              <p className="ml-2 h-7">instagram</p>
            </div>
          </HoverButton>
        </li>
        <li>
          <HoverButton href="https://unsplash.com/@avansear">
            <div className="flex items-center">
              <ArrowIcon />
              <p className="ml-2 h-7">unsplash</p>
            </div>
          </HoverButton>
        </li>
        <li>
          <HoverButton href="https://www.linkedin.com/in/vishruthsiddi/">
            <div className="flex items-center">
              <ArrowIcon />
              <p className="ml-2 h-7">linkedin</p>
            </div>
          </HoverButton>
        </li>
        <li>
          <HoverButton href="https://github.com/avansear">
            <div className="flex items-center">
              <ArrowIcon />
              <p className="ml-2 h-7">github</p>
            </div>
          </HoverButton>
        </li>
      </ul>
    </footer>
  )
}
