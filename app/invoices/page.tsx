import InvoiceList from './components/InvoiceList'
import db from '@/utils/db'

const getInvoiceData = async () => {
  try {
    const data = await db?.invoice.findMany({})
    return data
  } catch (e) {
    console.error(e)
  }
}

const getVendorData = async (id: string) => {
  const data = await db?.vendor.findUnique({
    where: {
      id: id,
    },
  })
  return data
}

const InvoicesPage = async () => {
  const allInvoices = await getInvoiceData()

  if (!allInvoices) {
    return <InvoiceList invoices={[]} />
  }

  const invoices = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allInvoices.map(async (invoice: any) => {
      invoice.vendor = await getVendorData(invoice.vendorId)
      return { ...invoice }
    })
  )

  return <InvoiceList invoices={invoices} />
}

export default InvoicesPage
