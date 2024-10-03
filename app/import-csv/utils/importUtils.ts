const handleSendCsv = async (
  csvData: any,
  setCsvResponse: any,
  salesTax: any,
  additionalCharges: any
) => {
  try {
    const dataToSend = { csvData, salesTax, additionalCharges }
    const response = await fetch('/api/csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })

    const formattedData = await response.json()

    setCsvResponse(formattedData)
  } catch (e: any) {
    return e instanceof Error
      ? console.error('Error: ' + e.message)
      : console.error('Unknown error at importUtils')
  }
}

const convertToDateFormat = (date: string): string => {
  const [year, month, day] = date.split('-') // Split by '-'
  const shortYear = year.slice(2) // Get the last two digits of the year
  return `${month}.${day}.${shortYear}` // Return in DD.MM.YY format
}

const extractInvoiceNumber = (fileName: string): string | null => {
  // Regular expression to match a sequence of digits in the filename
  const match = fileName.match(/\d{6,}/)
  return match ? match[0] : null
}

export { handleSendCsv, convertToDateFormat, extractInvoiceNumber }
