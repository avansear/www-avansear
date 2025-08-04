import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'song of the week',
  description: 'song of the week',
}

export default function MusixPage() {
  return (
    <section>
      <h1 className="title font-semibold text-2xl tracking-tighter mb-8">
        song of the week
      </h1>

                  <div className="w-full">
            <iframe 
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/oTwVce9eWb4?&autoplay=1&controls=0&color=white&rel=0"
              style={{ borderRadius: '12px', aspectRatio: '1/1' }}
            />
          </div>
    </section>
  )
} 