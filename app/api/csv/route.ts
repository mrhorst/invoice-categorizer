import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

import { gfsCode } from '../config/gfs_code'
import {
  readStreamToJsonArray,
  calculateCategoryTotals,
} from '@/app/invoices/import-gfs-csv/utils/csvUtils'

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const { itemInfo, vendorName, invoiceNumber, salesTax, additionalCharges } =
    await readStreamToJsonArray(request.body)

  const categoryTotals = calculateCategoryTotals(
    itemInfo,
    gfsCode,
    salesTax,
    additionalCharges
  )

  return NextResponse.json({
    message: {
      categoryTotals,
      itemInfo,
      salesTax,
      additionalCharges,
    },
  })
}
