import Link from 'next/link'

const Invoice = ({ invoice }: any) => {
  // Asked chatGPT to help me style this component using tailwind...
  // Then, made some modifications to it to make it more readable

  return (
    <div className="flex justify-between items-center my-4 p-4 bg-white shadow rounded-lg">
      <div className="mr-4">
        <div className="mb-2 text-gray-700 font-semibold">
          Invoice #:{' '}
          <span className="font-normal">{invoice.invoiceNumber}</span>
        </div>
        <div className="mb-4 text-gray-700 font-semibold">
          Vendor:{' '}
          <span className="font-normal uppercase">{invoice.vendor.name}</span>
        </div>
      </div>
      <div>
        <div className="mb-2 text-gray-700 font-semibold">
          Total:{' '}
          <span className="font-normal">${invoice.total.toString()}</span>
        </div>
        <div className="mb-2 text-gray-700 font-semibold">
          Sales Tax: <span className="font-normal">TBD</span>
        </div>
        <div className="mb-2 text-gray-700 font-semibold">
          Additional Charges:{' '}
          <span className="font-normal">
            ${invoice.additionalCharges?.toString()}
          </span>
        </div>
      </div>
      <div>
        <Link
          href={`/invoices/${invoice.id}`}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          View
        </Link>
      </div>
    </div>
  )
}

export default Invoice
