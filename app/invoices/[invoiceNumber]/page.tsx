import db from '@/utils/db'
import { Item } from '@prisma/client'

const getInvoiceData = async (invoiceNumber: any) => {
  try {
    const invoice = await db.invoice.findUnique({
      where: {
        invoiceNumber: invoiceNumber,
      },
    })
    return invoice
  } catch (e) {
    console.error(e)
  }
}

const getVendorData = async (vendorId: any) => {
  try {
    const vendor = await db.vendor.findUnique({
      where: {
        id: vendorId,
      },
    })
    return vendor
  } catch (e) {
    console.error(e)
  }
}

const getItemsData = async (invoiceNumber: any) => {
  try {
    const items = await db.item.findMany({
      where: {
        invoiceId: invoiceNumber,
      },
    })
    return items
  } catch (e) {
    console.error(e)
  }
}

const InvoiceTable = ({ items }: any) => {
  const tableClasses = 'min-w-full bg-white border border-gray-200'
  const tableHeadClasses = 'bg-gray-100 border-b border-gray-200'
  const tableHeaderCellClasses =
    'px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200'
  const tableBodyClasses = 'even:bg-gray-50 border-b border-gray-200'
  const tableDataCellClasses =
    'px-3 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200'

  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead className={tableHeadClasses}>
          <tr>
            <th className={tableHeaderCellClasses}>Item Code</th>
            <th className={tableHeaderCellClasses}>Description</th>
            <th className={tableHeaderCellClasses}>Item Qty</th>
            <th className={tableHeaderCellClasses}>Taxable</th>

            <th className={tableHeaderCellClasses}>Unit Price</th>
            <th className={tableHeaderCellClasses}>Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.itemCode} className={tableBodyClasses}>
              <td className={tableDataCellClasses}>{item.itemCode}</td>
              <td
                className={
                  tableDataCellClasses +
                  'text-ellipsis max-w-[200px] overflow-hidden whitespace-nowrap'
                }
              >
                {item.description}
              </td>
              <td className={tableDataCellClasses}>{Number(item.itemQty)}</td>
              <td className={tableDataCellClasses}>
                {item.taxable ? 'Yes' : 'No'}
              </td>

              <td className={tableDataCellClasses}>{item.price.toFixed(2)}</td>
              <td className={tableDataCellClasses}>
                {item.extendedPrice.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const InvoiceDetails = ({ invoice, vendor }: { invoice: any; vendor: any }) => {
  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold">
        Invoice Number: {invoice?.invoiceNumber}
      </h1>
      <p className="text-lg">Vendor: {vendor?.name.toUpperCase()}</p>
      <p className="text-lg">Total: $ {Number(invoice?.total).toFixed(2)}</p>
      <p className="text-lg">
        Additional Charges: $ {Number(invoice?.additionalCharges).toFixed(2)}
      </p>
      <p className="text-lg">
        Tax: $ {Number(invoice?.salesTax).toFixed(2) && '0.00'}{' '}
      </p>
      <p className="text-lg font-semibold">
        Grand Total: $ {Number(invoice?.grandTotal.toFixed(2))}
      </p>
    </div>
  )
}

const InvoicePage = async ({ params }: any) => {
  const invoice = await getInvoiceData(params.invoiceNumber)
  const vendor = await getVendorData(invoice?.vendorId)
  const items = await getItemsData(invoice?.invoiceNumber)
  return (
    <div>
      <div className="p-6">
        <InvoiceDetails invoice={invoice} vendor={vendor} />
        <InvoiceTable items={items} />
      </div>
    </div>
  )
}

export default InvoicePage
