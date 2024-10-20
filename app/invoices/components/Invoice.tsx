import Link from 'next/link'

const Invoice = ({ invoice }: any) => {
  // Asked chatGPT to help me style this component using tailwind...

  return (
    <div className="my-4 p-4 bg-white shadow rounded-lg">
      <div className="mb-2 text-gray-700 font-semibold">
        Invoice #: <span className="font-normal">{invoice.invoiceNumber}</span>
      </div>
      <div className="mb-2 text-gray-700 font-semibold">
        Grand Total: <span className="font-normal">${invoice.grandTotal}</span>
      </div>
      <div className="mb-4 text-gray-700 font-semibold">
        Vendor: <span className="font-normal">{invoice.vendor.name}</span>
      </div>
      <Link
        href={`/invoices/${invoice.id}`}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
      >
        View
      </Link>
    </div>
  )
}

export default Invoice
