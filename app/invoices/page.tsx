import InvoiceList from './components/InvoiceList'
import db from '@/utils/db'

const getInvoiceData = async () => {
  try {
    const data = await db.invoice.findMany({})
    return data
  } catch (e) {
    console.error(e)
  }
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
  try {
    const allInvoices = await getInvoiceData()

    if (!allInvoices) {
      throw new Error('No invoices found')
    }

    const invoices = await Promise.all(
      allInvoices.map(async (invoice: any) => {
        invoice.vendor = await getVendorData(invoice.vendorId)
        // console.log(invoice)
        return { ...invoice }
      })
    )

    return <InvoiceList invoices={invoices} />
  } catch (e) {
    console.error(e)
  }
}

export default InvoicesPage
