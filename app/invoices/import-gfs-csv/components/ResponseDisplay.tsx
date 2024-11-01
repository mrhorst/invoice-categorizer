import { useState } from 'react'
import { formatJsonResponse } from '../utils/responseUtils'
import { style } from '../styles/customStyles'
import { CsvResponse } from '@/app/interfaces/response.interface'
import { categorizeItem, createInvoice } from '@/utils/actions'
import BigNumber from 'bignumber.js'

const ResponseDisplay = ({
  data,
  fileName,
}: {
  data: CsvResponse | null
  fileName: string | null
}) => {
  const [isMatchedItemsVisible, setMatchedItemsVisible] = useState(false) // State to toggle MatchedItemDisplay
  const addToDb = () => {
    const {
      itemInfo,
      salesTax = new BigNumber(0),
      additionalCharges = new BigNumber(0),
    } = data?.message ?? {}
    console.log(data)
    createInvoice(
      itemInfo,
      salesTax,
      additionalCharges,
      data?.message.categoryTotals?.grandTotal ?? new BigNumber(0),
      fileName
    )
  }

  // Toggle function
  const toggleMatchedItems = () => {
    setMatchedItemsVisible(!isMatchedItemsVisible)
  }

  return data && data.message ? (
    <div className={style.responseSuccess}>
      <Totals data={data} fileName={fileName} />
      <UnmatchedItemDisplay data={data} addToDb={addToDb} />

      <button onClick={toggleMatchedItems} className={style.button}>
        {isMatchedItemsVisible ? 'Hide Matched Items' : 'Show Matched Items'}
      </button>

      {/* Conditionally render MatchedItemDisplay based on state */}
      {isMatchedItemsVisible && <MatchedItemDisplay data={data} />}
    </div>
  ) : (
    <div className={style.responseNoData}>
      <h2 className={style.responseFont}>No data</h2>
    </div>
  )
}

const MatchedItemDisplay = ({ data }: { data: CsvResponse | null }) => {
  return data && data.message ? (
    <div className="mt-4">
      {data.message.categoryTotals?.matchedItems.map((item: any) => {
        return (
          <div
            className="p-2 top-4 border border-gray-500"
            key={item.itemNumber}
          >
            <p>Item code: {item.itemNumber}</p>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch]">
              Description: {item.itemDescription}
            </p>
            <p className="font-bold">Category: {item.category}</p>
            <p>Total after taxes and charges: {item.totalWithTax}</p>
          </div>
        )
      })}
    </div>
  ) : (
    <h1>No Matched Data</h1>
  )
}

const UnmatchedItemDisplay = ({
  data,
  addToDb,
}: {
  data: CsvResponse | null
  addToDb: () => void
}) => {
  const [selectedCategory, setSelectedCategory] = useState<{
    [key: string]: string
  }>({})
  const [isTaxable, setIsTaxable] = useState<boolean>(false)

  const handleAddToGfsList = (item: any) => {
    const itemInfo = {
      code: item.itemNumber,
      name: item.itemDescription,
      category: selectedCategory[item.itemNumber] || '',
      tax: isTaxable,
    }
    console.log('Is Taxable?', isTaxable)
    categorizeItem(itemInfo)
  }

  return data &&
    data.message?.categoryTotals.unmatchedItems &&
    data.message.categoryTotals.unmatchedItems.length > 0 ? (
    <div className="container mx-auto p-4">
      {data.message.categoryTotals.unmatchedItems.map((item: any) => {
        return (
          <div
            className="border border-gray-300 rounded-lg p-4 mb-6 shadow-md"
            key={item.itemNumber}
          >
            <p className="text-lg font-semibold mb-2">
              Item code: {item.itemNumber}
            </p>
            <p className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[25ch] mb-4">
              Description: {item.itemDescription}
            </p>
            <p className="text-sm mb-1">
              Total if taxable item: {item.totalWithTax}
            </p>
            <p className="text-sm mb-4">
              Total if Non-Taxable item: {item.totalWithoutTax}
            </p>

            {/* Dropdown for selecting category */}
            <div className="mb-4">
              <label
                htmlFor={`category-${item.itemNumber}`}
                className="block font-medium mb-1"
              >
                Category:
              </label>
              <select
                id={`category-${item.itemNumber}`}
                name="category"
                value={selectedCategory[item.itemNumber] || ''}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    [item.itemNumber]: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Select Category</option>
                <option value="Beverages">Beverages</option>
                <option value="Dairy">Dairy</option>
                <option value="Janitorial">
                  Janitorial & Cleaning Supplies
                </option>
                <option value="Operating Supplies">Operating Supplies</option>
                <option value="Other Food">Other Food</option>
                <option value="Paper Packaging">Paper Packaging</option>
                <option value="Produce">Produce</option>
              </select>
            </div>

            {/* Radio buttons for selecting taxable status */}
            <div className="mb-4">
              <span className="block font-medium mb-1">Taxable Status:</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`taxable-${item.itemNumber}`}
                    value="true"
                    checked={isTaxable === true}
                    onChange={() => setIsTaxable(!isTaxable)}
                    className="mr-2"
                  />
                  Taxable
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`taxable-${item.itemNumber}`}
                    value="false"
                    checked={isTaxable === false}
                    onChange={() => setIsTaxable(!isTaxable)}
                    className="mr-2"
                  />
                  Non-Taxable
                </label>
              </div>
            </div>

            <button
              onClick={() => handleAddToGfsList(item)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add to GFS Code List
            </button>
          </div>
        )
      })}
    </div>
  ) : (
    <div className="text-center mt-8">
      <h1 className="text-xl font-semibold mb-4">
        No Unmatched Data. Safe to add to database!
      </h1>
      <button
        onClick={addToDb}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add To DB
      </button>
    </div>
  )
}

const Totals = ({ data, fileName }: any) => {
  return (
    <>
      <h1 className={style.responseFont + ' pb-1'}>Subject:</h1>
      <p>{fileName}</p>
      <h1 className={style.responseFont + ' pt-3 pb-1'}>Body:</h1>
      <p className="whitespace-pre-wrap">
        {formatJsonResponse(data.message.categoryTotals.totals)}
      </p>
      <h1 className={style.responseFont + ' pt-3'}>
        Invoice GrandTotal: {data.message.categoryTotals.grandTotal}
      </h1>
    </>
  )
}

export default ResponseDisplay
