'use client'

import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import {
  manipulateDate,
  extractInvoiceNumber,
  handleSendCsv,
} from '../utils/importUtils'
import { style } from '../styles/customStyles'
import { error } from 'console'

interface UploadCSVProps {
  setJsonResponse: (data: any) => void
  setFileName: (name: string) => void
  fileName: string | null
}

const UploadCSV: React.FC<UploadCSVProps> = ({
  setJsonResponse,
  setFileName,
  fileName,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvParsedData] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  )
  const [vendor, setVendor] = useState<string>('gfs')

  const [salesTax, setSalesTax] = useState<number | null>(null)
  const [additionalChargeAmount, setAdditionalChargeAmount] = useState<
    number | null
  >(null)
  const [loading, setLoading] = useState<boolean>(false)

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
      setLoading(true)
      handleSendCsv(infoData, setJsonResponse, salesTax, additionalChargeAmount)
        .then(() => setLoading(false))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
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

  const isReadyToSubmit = () => {
    return loading || file === null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => setCsvParsedData(results.data),
      })
    }
    reader.readAsText(file)
  }

  return (
    <div className="upload-csv p-4 flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg grid gap-1"
      >
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="csvFile"
              className="text-gray-700 font-semibold text-sm"
            >
              CSV File
            </label>
            <input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full file:mr-2 file:py-1 file:px-2 file:rounded file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="datePicker"
              className="text-gray-700 font-semibold text-sm"
            >
              Invoice Date
            </label>
            <input
              id="datePicker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold text-sm">
              Vendor
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  id="gfs"
                  name="vendor"
                  value="gfs"
                  checked={vendor === 'gfs'}
                  onChange={(e) => setVendor(e.target.value)}
                  className="mr-1"
                />
                GFS
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="radio"
                  id="none"
                  name="vendor"
                  value="none"
                  checked={vendor === 'none'}
                  onChange={(e) => setVendor(e.target.value)}
                  className="mr-1"
                />
                None
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-4 bg-gray-50 p-4 rounded-lg justify-center items-center">
          <div className="flex flex-col">
            <label
              htmlFor="salesTax"
              className="text-gray-700 font-semibold text-sm"
            >
              Sales Tax (%)
            </label>
            <input
              type="number"
              id="salesTax"
              value={salesTax ?? ''}
              onChange={(e) =>
                setSalesTax(e.target.value ? Number(e.target.value) : null)
              }
              className="border border-gray-300 rounded p-2 w-full text-sm"
              inputMode="numeric"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="additionalChargeAmount"
              className="text-gray-700 font-semibold text-sm"
            >
              Additional Charge
            </label>
            <input
              type="number"
              id="additionalChargeAmount"
              value={additionalChargeAmount ?? ''}
              onChange={(e) =>
                setAdditionalChargeAmount(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="border border-gray-300 rounded p-2 w-full text-sm"
              placeholder="Amount"
              inputMode="numeric"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isReadyToSubmit()}
          className={`${
            isReadyToSubmit()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 px-4 rounded transform transition duration-300 hover:scale-105 w-auto self-center`}
        >
          {loading
            ? 'Processing...'
            : isReadyToSubmit()
            ? 'Choose a CSV file'
            : 'Analyze file'}
        </button>
      </form>

      {loading && (
        <div className="mt-4 flex flex-col items-center">
          <span className="text-blue-600 font-semibold text-lg">
            Processing your file...
          </span>
          <div className="spinner mt-2 border-4 border-t-blue-900 border-t-transparent border-blue-100 rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default UploadCSV
