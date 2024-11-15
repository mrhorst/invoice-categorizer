import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from 'next/server'

import prisma from '@/utils/db'

import {
  readStreamToJsonArray,
  calculateCategoryTotals,
} from '@/app/invoices/import-gfs-csv/utils/csvUtils'

export async function POST(request: NextRequest, response: NextApiResponse) {
  try {
    const { itemInfo, vendorName, invoiceNumber, salesTax, additionalCharges } =
      await readStreamToJsonArray(request)

    const gfsCode = await prisma?.gFS_Items.findMany()

    const categoryTotals = calculateCategoryTotals(
      itemInfo,
      gfsCode ?? [],
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
  } catch (e) {
    console.log(e)
  }
}
