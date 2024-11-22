import React, { useState } from 'react'
import { CsvResponse } from '@/app/interfaces/response.interface'
import { categorizeItem, createInvoice } from '@/utils/actions'
import BigNumber from 'bignumber.js'

const ResponseDisplay = ({
  data,
  fileName,
  grandTotal,
  categoriesTotal,
  setGrandTotal,
  setCategoriesTotal,
}: {
  data: CsvResponse | null
  fileName: string | null
  grandTotal: BigNumber | null
  categoriesTotal: { [category: string]: BigNumber }
  setGrandTotal: (value: BigNumber) => void
  setCategoriesTotal: (totals: { [category: string]: BigNumber }) => void
}) => {
  const [isMatchedItemsVisible, setMatchedItemsVisible] = useState(false)

  const addToDb = () => {
    const {
      itemInfo,
      salesTax = new BigNumber(0),
      additionalCharges = new BigNumber(0),
    } = data?.message ?? {}
    createInvoice(
      itemInfo,
      salesTax,
      additionalCharges,
      grandTotal ?? new BigNumber(0),
      fileName
    )
  }

  const toggleMatchedItems = () => {
    setMatchedItemsVisible(!isMatchedItemsVisible)
  }

  return data && data.message ? (
    <div className="p-3 rounded-lg shadow-lg flex flex-col">
      <div className="flex gap-4">
        <UnmatchedItemDisplay data={data} addToDb={addToDb} />
        <Totals
          fileName={fileName}
          grandTotal={grandTotal}
          categoriesTotal={categoriesTotal}
          setGrandTotal={setGrandTotal}
          setCategoriesTotal={setCategoriesTotal}
        />
      </div>

      <button
        onClick={toggleMatchedItems}
        className="bg-blue-600 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-700 transition duration-300 w-auto self-center"
      >
        {isMatchedItemsVisible ? 'Hide Matched Items' : 'Show Matched Items'}
      </button>

      {isMatchedItemsVisible && <MatchedItemDisplay data={data} />}
    </div>
  ) : (
    <div className="bg-red-50 p-4 rounded-lg shadow-lg">
      <h2 className="text-red-700 font-semibold">No data available</h2>
    </div>
  )
}

const MatchedItemDisplay = ({ data }: { data: CsvResponse | null }) => {
  return data && data.message ? (
    <div className="mt-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
      {data.message.categoryTotals?.matchedItems.map((item: any) => (
        <div
          className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50 shadow"
          key={item.itemNumber}
        >
          <p className="font-semibold">Item code: {item.itemNumber}</p>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] text-gray-700">
            Description: {item.itemDescription}
          </p>
          <p className="font-semibold">Category: {item.category}</p>
          <p>Total after taxes and charges: {item.totalWithTax}</p>
        </div>
      ))}
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
  const [taxableStatus, setTaxableStatus] = useState<{
    [key: string]: boolean
  }>({})

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
  const handleAddToGfsList = (item: any) => {
    const itemInfo = {
      code: item.itemNumber,
      name: item.itemDescription,
      category: selectedCategory[item.itemNumber] || '',
      tax: taxableStatus[item.itemNumber] || false,
    }
    // console.log('Is Taxable?', isTaxable)
    categorizeItem(itemInfo)
  }

  const uniqueUnmatchedItems =
    data?.message.categoryTotals.unmatchedItems?.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.itemNumber === item.itemNumber)
    )

  return data &&
    data.message?.categoryTotals.unmatchedItems &&
    data.message.categoryTotals.unmatchedItems.length > 0 ? (
    <div className="container mx-auto p-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
      {uniqueUnmatchedItems?.map((item: any) => (
        <div
          key={item.itemNumber}
          className="border border-red-500 bg-red-50 rounded-lg p-4 mb-6 shadow-md"
        >
          <p className="text-lg font-semibold mb-2 text-red-700">
            Item Not Found: {item.itemNumber}
          </p>
          <p className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[35ch] mb-4">
            Description: {item.itemDescription}
          </p>
          <p className="text-sm mb-1">
            Total if taxable item: {item.totalWithTax}
          </p>
          <p className="text-sm mb-4">
            Total if Non-Taxable item: {item.totalWithoutTax}
          </p>

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
              <option value="Dough">Dough</option>
              <option value="Janitorial & Cleaning Supplies">
                Janitorial & Cleaning Supplies
              </option>
              <option value="Operating Supplies">Operating Supplies</option>
              <option value="Other Food">Other Food</option>
              <option value="Paper Packaging">Paper Packaging</option>
              <option value="Poultry">Poultry</option>
              <option value="Produce">Produce</option>
            </select>
          </div>

          <div className="mb-4">
            <span className="block font-medium mb-1">Taxable Status:</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`taxable-${item.itemNumber}`}
                  value="true"
                  checked={taxableStatus[item.itemNumber] === true}
                  onChange={() =>
                    setTaxableStatus({
                      ...taxableStatus,
                      [item.itemNumber]: true,
                    })
                  }
                  className="mr-2"
                />
                Taxable
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`taxable-${item.itemNumber}`}
                  value="false"
                  checked={taxableStatus[item.itemNumber] === false}
                  onChange={() =>
                    setTaxableStatus({
                      ...taxableStatus,
                      [item.itemNumber]: false,
                    })
                  }
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
      ))}
    </div>
  ) : (
    <div className="text-center mt-8">
      <h1 className="text-xl font-semibold mb-4">
        No Unmatched Data. {/*Safe to add to database!|*/}
      </h1>
      {/*<button
        onClick={addToDb}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add To DB
      </button>*/}
    </div>
  )
}

const Totals = ({
  fileName,
  grandTotal,
  categoriesTotal,
  setGrandTotal,
  setCategoriesTotal,
}: {
  fileName: string | null
  grandTotal: BigNumber | null
  categoriesTotal: { [category: string]: BigNumber }
  setGrandTotal: (value: BigNumber) => void
  setCategoriesTotal: (totals: { [category: string]: BigNumber }) => void
}) => {
  const handleGrandTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGrandTotal = new BigNumber(e.target.value)
    setGrandTotal(newGrandTotal)
  }

  const handleCategoryTotalChange = (
    category: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCategoryTotal = new BigNumber(e.target.value)
    const updatedCategoriesTotal = {
      ...categoriesTotal,
      [category]: newCategoryTotal,
    }

    // Update the state for category totals
    setCategoriesTotal(updatedCategoriesTotal)

    // Recalculate grandTotal based on updated category totals
    const updatedGrandTotal = Object.values(updatedCategoriesTotal).reduce(
      (acc, total) => acc.plus(total),
      new BigNumber(0)
    )
    setGrandTotal(updatedGrandTotal)
  }

  const copyCategoryTotals = () => {
    navigator.clipboard.writeText(
      Object.keys(categoriesTotal)
        .map((category) => `${category}: ${categoriesTotal[category]}`)
        .join('\n')
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="w-1/2 pr-4">
            <h1 className="text-lg font-semibold mb-2">Subject:</h1>
            <p className="text-sm">{fileName}</p>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold mt-4 mb-4">Body:</p>
              <button
                onClick={copyCategoryTotals}
                className="flex gap-1 h-5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 text-xs py-0.5 px-1.5 rounded shadow-sm transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5h-3a2.25 2.25 0 00-2.25 2.25v11.25A2.25 2.25 0 005.25 20.25h9.75a2.25 2.25 0 002.25-2.25v-3M15 3.75H8.25v3h6.75m0-3v3m0-3a2.25 2.25 0 012.25 2.25v11.25m-6.75-2.25h6.75M8.25 10.5h5.25M8.25 13.5h2.25"
                  />
                </svg>
                Copy categories
              </button>
            </div>
            <div className="space-y-1">
              {Object.keys(categoriesTotal).map((category) => (
                <p key={category} className="text-sm">
                  {category}: {Number(categoriesTotal[category]).toFixed(2)}
                </p>
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <h2 className="text-lg font-semibold mb-2">
              Adjust Category Totals
            </h2>
            <div className="space-y-2">
              {Object.entries(categoriesTotal).map(([category, total]) => (
                <div key={category} className="flex items-center gap-4">
                  <label
                    htmlFor={`total-${category}`}
                    className="w-1/2 text-sm font-medium text-gray-700"
                  >
                    {category}:
                  </label>
                  <input
                    id={`total-${category}`}
                    type="number"
                    step="0.01"
                    value={total ? Number(total).toFixed(2) : '0.00'}
                    onChange={(e) => handleCategoryTotalChange(category, e)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <label
            htmlFor="grandTotal"
            className="font-semibold text-sm text-gray-700"
          >
            Grand Total:
          </label>
          <input
            id="grandTotal"
            type="number"
            value={grandTotal ? Number(grandTotal).toFixed(2) : '0.00'}
            onChange={handleGrandTotalChange}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
      </div>
    </>
  )
}

export default ResponseDisplay
