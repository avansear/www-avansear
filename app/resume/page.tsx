export const metadata = {
  title: 'resume',
  description: "avan's resume",
}

export default function Page() {
  return (
    <section>
      <div className="title-spacing">
        <h1 className="font-semibold text-2xl tracking-tighter">resume</h1>
      </div>
      <div className="w-full">
        <iframe
          src="/resume.pdf"
          className="w-full rounded-lg border border-[var(--color-dark)]/10 dark:border-[var(--color-light)]/10"
          style={{ height: '80vh' }}
          title="resume"
        />
        <div className="mt-3">
          <a
            href="/resume.pdf"
            download
            className="text-sm text-[var(--color-dark)]/60 dark:text-[var(--color-light)]/60 hover:text-[var(--color-dark)] dark:hover:text-[var(--color-light)] transition-colors"
          >
            download pdf
          </a>
        </div>
      </div>
    </section>
  )
}
