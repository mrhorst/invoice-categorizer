import Link from 'next/link'

const Invoice = ({ invoice }: any) => {
  // Asked chatGPT to help me style this component using tailwind...
  // Then, made some modifications to it to make it more readable

  return (
    <div className="flex justify-between items-center my-6 p-6 bg-white shadow-md rounded-xl">
      <div className="flex flex-col space-y-2">
        <div className="text-gray-800 font-semibold">
          Invoice #:{' '}
          <span className="font-normal text-gray-600">
            {invoice.invoiceNumber}
          </span>
        </div>
        <div className="text-gray-800 font-semibold">
          Vendor:{' '}
          <span className="font-normal uppercase text-gray-600">
            {invoice.vendor.name}
          </span>
        </div>
        <div className="text-gray-800 font-semibold">
          Invoice Date:{' '}
          <span className="font-normal text-gray-600">
            {invoice.date.toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-right">
        <div className="text-gray-800 font-semibold">
          Total:{' '}
          <span className="font-normal text-gray-600">
            ${invoice.total.toString()}
          </span>
        </div>
        <div className="text-gray-800 font-semibold">
          Sales Tax:{' '}
          <span className="font-normal text-gray-600">{invoice.salesTax}</span>
        </div>
        <div className="text-gray-800 font-semibold">
          Additional Charges:{' '}
          <span className="font-normal text-gray-600">
            ${invoice.additionalCharges?.toString()}
          </span>
        </div>
        <div className="text-gray-800 font-semibold">
          Grand Total:{' '}
          <span className="font-normal text-gray-600">
            ${invoice.grandTotal?.toString()}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <Link
          href={`/invoices/${invoice.invoiceNumber}`}
          className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 transition duration-200 ease-in-out"
        >
          View
        </Link>
      </div>
    </div>
  )
}

export default Invoice
