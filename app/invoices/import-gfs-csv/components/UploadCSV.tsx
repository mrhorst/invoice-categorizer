'use client'

import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import {
  manipulateDate,
  extractInvoiceNumber,
  handleSendCsv,
} from '../utils/importUtils'
import { style } from '../styles/customStyles'

const UploadCSV = ({
  setJsonResponse,
  setFileName,
  fileName,
}: {
  setJsonResponse: any
  setFileName: any
  fileName: any
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvParsedData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  ) // Default to today's date
  const [vendor, setVendor] = useState('gfs') // Default to 'gfs'
  const [salesTax, setSalesTax] = useState<number | null>(null)
  const [additionalChargeName, setAdditionalChargeName] = useState('none')
  const [additionalChargeAmount, setAdditionalChargeAmount] = useState<
    number | null
  >(null)

  useEffect(() => {
    if (csvData && fileName) {
      const fileNameString = `${vendor} ${manipulateDate(
        selectedDate
      )} #${extractInvoiceNumber(fileName)}`

      setFileName(fileNameString)

      const infoData = {
        vendor,
        csvData,
        invoiceNumber: extractInvoiceNumber(fileName),
      }
      handleSendCsv(infoData, setJsonResponse, salesTax, additionalChargeAmount)
    }
  }, [
    csvData,
    setJsonResponse,
    setFileName,
    selectedDate,
    vendor,
    fileName,
    salesTax,
    additionalChargeAmount,
  ])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setFileName(selectedFile.name)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendor(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: function (results: any) {
          setCsvParsedData(results.data)
        },
      })
    }
    reader.readAsText(file)
  }

  return (
    <div className={style.container}>
      <form action={''} onSubmit={handleSubmit} className={style.form}>
        {/* File Upload Section */}
        <div className={style.formGroup}>
          <label htmlFor="csvFile" className={style.label}>
            Select CSV File
          </label>
          <input
            id="csvFile"
            type="file"
            accept=".csv"
            name="csvFile"
            onChange={handleFileChange}
            className={style.input}
          />
        </div>
        {/* Date Picker Section */}
        <div className={style.formGroup}>
          <label htmlFor="datePicker" className={style.label}>
            Select Invoice Date
          </label>
          <input
            id="datePicker"
            type="date"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        {/* Vendor Selection Section */}
        <div className={style.formGroup}>
          <label className={style.label}>Select Vendor</label>
          <div className="flex space-x-4">
            <div>
              <input
                type="radio"
                id="gfs"
                name="vendor"
                value="gfs"
                checked={vendor === 'gfs'}
                onChange={handleVendorChange}
                className="mr-2"
              />
              <label htmlFor="gfs" className="text-gray-700">
                GFS
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="none"
                name="vendor"
                value="none"
                checked={vendor === 'none'}
                onChange={handleVendorChange}
                className="mr-2"
              />
              <label htmlFor="none" className="text-gray-700">
                None
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="space-y-8 p-4 bg-gray-100 rounded-lg shadow-md">
            {/* Sales Tax Section */}
            <div className="sales-tax-section space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Sales Tax
              </h2>
              <div className="flex flex-col">
                <label
                  htmlFor="salesTax"
                  className="text-gray-700 font-semibold"
                >
                  Sales Tax (%)
                </label>
                <input
                  type="number"
                  id="salesTax"
                  value={salesTax === null || salesTax === 0 ? '' : salesTax} // Conditionally show an empty string
                  onChange={(e) =>
                    setSalesTax(
                      e.target.value === '' ? null : Number(e.target.value)
                    )
                  } // Allow empty input
                  className="input-field mt-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
          <div className="space-y-8 p-4 bg-gray-100 rounded-lg shadow-md">
            {/* Additional Charges Section */}
            <div className="additional-charges-section space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Additional Charges
              </h2>

              <div className="flex flex-col">
                <label
                  htmlFor="additionalChargeName"
                  className="text-gray-700 font-semibold"
                >
                  Additional Charge
                </label>
                <select
                  id="additionalChargeName"
                  value={additionalChargeName}
                  onChange={(e) => setAdditionalChargeName(e.target.value)}
                  className="input-field mt-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Fuel Surcharge">Fuel Surcharge</option>
                  <option value="Handling Fee">Handling Fee</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="additionalChargeAmount"
                  className="text-gray-700 font-semibold"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="additionalChargeAmount"
                  value={
                    additionalChargeAmount === null ||
                    additionalChargeAmount === 0
                      ? 0
                      : additionalChargeAmount
                  } // Conditionally show an empty string
                  onChange={(e) =>
                    setAdditionalChargeAmount(
                      e.target.value === '' ? 0 : Number(e.target.value)
                    )
                  } // Allow empty input
                  className="input-field mt-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className={style.button}>
          Upload and Process CSV
        </button>
      </form>
    </div>
  )
}

export default UploadCSV
