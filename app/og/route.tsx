import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || 'avan'

  // Load the logo image
  const logoData = await fetch(new URL('/logo.png', request.url)).then(
    (res) => res.arrayBuffer(),
  )

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-[#f97a00]">
        <div tw="flex flex-col w-full h-full items-center justify-center p-16">
          <img 
            src={logoData as any} 
            alt="Logo" 
            tw="w-32 h-32 mb-8"
          />
          <div tw="flex flex-col items-center">
            <h1 tw="text-6xl font-bold text-[#06280C] mb-4">
              {title}
            </h1>
            <p tw="text-2xl text-[#06280C] opacity-80">
              portfolio & blog
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
