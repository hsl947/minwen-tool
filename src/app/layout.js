import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: '铭文小工具',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
