import Invoice from './Invoice'
import Link from 'next/link'

const InvoiceList = ({ invoices }: any) => {
  const links = [
    { href: '/invoices/import-gfs-csv', label: 'Import GFS Invoice CSV' },
    // { href: '', label: 'Back' },
  ]
  return invoices.length > 0 ? (
    <div>
      <ul className="flex space-x-4">
        {links.map((link: any) => (
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
      <h1 className="text-2xl mt-4">Invoices</h1>
      {invoices.map((invoice: any) => (
        <Invoice invoice={invoice} key={invoice.invoiceNumber} />
      ))}
    </div>
  ) : (
    <div>
      <ul className="flex space-x-4">
        {links.map((link: any) => (
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
      <h1 className="text-2xl mt-4">No Invoices have been added yet.</h1>
    </div>
  )
}

export default InvoiceList
