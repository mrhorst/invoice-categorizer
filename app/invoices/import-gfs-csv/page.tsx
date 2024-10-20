'use client'

import UploadCSV from './components/UploadCSV'
import ResponseDisplay from './components/ResponseDisplay'
import { useState } from 'react'
import { CsvResponse } from '@/app/interfaces/response.interface'

const CSVHome = () => {
  const [jsonResponse, setJsonResponse] = useState<CsvResponse | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div className="flex items-start">
      <div className="sticky top-10">
        <UploadCSV
          setJsonResponse={setJsonResponse}
          setFileName={setFileName}
          fileName={fileName}
        />
      </div>
      <div className="mb-10 w-full max-w-lg">
        <ResponseDisplay data={jsonResponse} fileName={fileName} />
      </div>
    </div>
  )
}

export default CSVHome
