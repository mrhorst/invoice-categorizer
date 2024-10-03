import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

import { gfsCode } from '../config/gfs_code'
import {
  readStreamToJsonArray,
  calculateCategoryTotals,
} from '@/app/import-csv/utils/csvUtils'

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  const { csvData, salesTax, additionalCharges } = await readStreamToJsonArray(
    request.body
  )

  const resData = calculateCategoryTotals(
    csvData,
    gfsCode,
    salesTax,
    additionalCharges
  )

  return NextResponse.json({ message: resData })
}
