'use client'

import UploadCSV from './components/UploadCSV'
import ResponseDisplay from './components/ResponseDisplay'
import { useEffect, useState } from 'react'
import { CsvResponse } from '@/app/interfaces/response.interface'
import BigNumber from 'bignumber.js'

const CSVHome = () => {
  const [jsonResponse, setJsonResponse] = useState<CsvResponse | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [grandTotal, setGrandTotal] = useState<BigNumber>(new BigNumber(0))
  const [additionalCharges, setAdditionalCharges] = useState<BigNumber>(
    new BigNumber(0)
  )
  const [categoriesTotal, setCategoriesTotal] = useState<{
    [key: string]: BigNumber
  }>({})

  useEffect(() => {
    if (jsonResponse) {
      setAdditionalCharges(
        new BigNumber(jsonResponse.message.additionalCharges)
      )
      setGrandTotal(
        new BigNumber(jsonResponse.message.categoryTotals.grandTotal)
      )

      const categoryTotals = Object.entries(
        jsonResponse.message.categoryTotals.totals
      ).reduce((acc, [category, total]) => {
        acc[category] = new BigNumber(total)
        return acc
      }, {} as { [key: string]: BigNumber })
      setCategoriesTotal(categoryTotals)
    }
  }, [jsonResponse])

  return (
    <div className=" flex flex-col justify-center items-center p-4">
      <UploadCSV
        setJsonResponse={setJsonResponse}
        setFileName={setFileName}
        fileName={fileName}
      />
      <ResponseDisplay
        data={jsonResponse}
        fileName={fileName}
        grandTotal={grandTotal}
        categoriesTotal={categoriesTotal}
        setGrandTotal={setGrandTotal}
        setCategoriesTotal={setCategoriesTotal}
      />
    </div>
  )
}

export default CSVHome
