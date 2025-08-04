import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default async function Icon() {
  // Load the logo image
  const logoData = await fetch(new URL('/logo.png', 'http://localhost')).then(
    (res) => res.arrayBuffer(),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#f97a00',
        }}
      >
        <img
          src={logoData as any}
          alt="Logo"
          style={{
            width: '80%',
            height: '80%',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
} 