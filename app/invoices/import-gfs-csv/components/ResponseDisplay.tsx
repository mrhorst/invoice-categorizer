import { useState } from 'react'
import { formatJsonResponse } from '../utils/responseUtils'
import { style } from '../styles/customStyles'
import { CsvResponse } from '@/app/interfaces/response.interface'
import { createInvoice } from '@/utils/actions'

const ResponseDisplay = ({
  data,
  fileName,
}: {
  data: CsvResponse | null
  fileName: string | null
}) => {
  const [isMatchedItemsVisible, setMatchedItemsVisible] = useState(false) // State to toggle MatchedItemDisplay
  const addToDb = () => {
    // console.log(data)
    createInvoice(data?.message?.itemInfo, fileName)
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
  return data &&
    data.message?.categoryTotals.unmatchedItems &&
    data.message.categoryTotals.unmatchedItems.length > 0 ? (
    <div>
      {data.message.categoryTotals.unmatchedItems.map((item: any) => {
        return (
          <div
            className={`${style.responseNoData} whitespace-pre-wrap`}
            key={item.itemNumber}
          >
            <p>Item code: {item.itemNumber}</p>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[25ch]">
              Description: {item.itemDescription}
            </p>
            <p>Total if taxable item: {item.totalWithTax}</p>
            <p>Total if Non-Taxable item: {item.totalWithoutTax}</p>
          </div>
        )
      })}
    </div>
  ) : (
    <>
      <h1>No Unmatched Data. Safe to add to database!</h1>
      <button onClick={addToDb} className={style.button}>
        {'Add To DB'}
      </button>
    </>
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
