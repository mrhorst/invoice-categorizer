import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from 'next/server'

import { gfsCode } from '../config/gfs_code'
import {
  readStreamToJsonArray,
  calculateCategoryTotals,
} from '@/app/invoices/import-gfs-csv/utils/csvUtils'

export async function POST(request: NextRequest, response: NextApiResponse) {
  const { itemInfo, vendorName, invoiceNumber, salesTax, additionalCharges } =
    await readStreamToJsonArray(request)

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
