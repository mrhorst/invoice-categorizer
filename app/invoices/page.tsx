import InvoiceList from './components/InvoiceList'
import db from '@/utils/db'

const getInvoiceData = async () => {
  const data = await db.invoice.findMany()
  return data
}

const getVendorData = async (id: string) => {
  const data = await db.vendor.findUnique({
    where: {
      id: id,
    },
  })
  return data
}

const InvoicesPage = async () => {
  const allInvoices = await getInvoiceData()

  const invoices = await Promise.all(
    allInvoices.map(async (invoice: any) => {
      invoice.vendor = await getVendorData(invoice.vendorId)
      return { ...invoice }
    })
  )

  // console.log(invoices)

  return <InvoiceList invoices={invoices} />
}

export default InvoicesPage
