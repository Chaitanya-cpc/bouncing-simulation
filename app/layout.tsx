import React from 'react'
import { SettingsProvider } from '../context/SettingsContext'
import { SettingsPanel } from '../components/SettingsPanel'

// Add Tailwind CSS
import '../styles/globals.css'

export const metadata = {
  title: 'Chaitanya Projects Consultancy Limited',
  description: 'Interactive animation for Chaitanya Projects Consultancy Limited',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          {children}
          <SettingsPanel />
        </SettingsProvider>
      </body>
    </html>
  )
} 