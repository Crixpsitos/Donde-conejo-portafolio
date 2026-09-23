import { DM_Sans, Playfair_Display } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import React from 'react'
import './styles.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const locale = await getLocale()

  return (
    <html className={`${dmSans.variable} ${playfair.variable} scroll-smooth`} lang={locale}>
      <body className="bg-background font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        <main>{children}</main>
      </body>
    </html>
  )
}
