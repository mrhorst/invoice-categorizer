import Link from 'next/link'
import './globals.css'

const links = [
  { href: '/', label: 'Home' },
  {
    href: '/invoices',
    label: 'Invoices',
  },
  // { href: '/import-pdf', label: 'Import PDF' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-md sticky top-0">
          <nav className="container mx-auto py-4 px-6">
            <ul className="flex space-x-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main className="container mx-auto py-8 px-6">{children}</main>
      </body>
    </html>
  )
}
