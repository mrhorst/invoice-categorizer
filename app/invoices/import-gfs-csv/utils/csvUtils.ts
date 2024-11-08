import { NextApiRequest } from 'next'
import BigNumber from 'bignumber.js'
import {
  Item,
  Category,
  UnmatchedItems,
  MatchedItems,
} from '@/app/interfaces/item.interface'

interface ReadStreamResult {
  itemInfo: any
  vendorName: any
  invoiceNumber: string
  salesTax: number
  additionalCharges: number
}

async function readStreamToJsonArray(
  request: NextApiRequest
): Promise<ReadStreamResult> {
  const chunks: Uint8Array[] = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  const buffer = Buffer.concat(chunks)
  return JSON.parse(buffer.toString())
}

function calculateCategoryTotals(
  items: Item[],
  categoryList: Category[],
  salesTax: number,
  additionalCharges: number
) {
  const totals: { [category: string]: BigNumber } = {}
  let grandTotal = new BigNumber(0) // Initialize grand total
  const unmatchedItems: UnmatchedItems[] = []
  const matchedItems: MatchedItems[] = []

  try {
    items.forEach((item) => {
      if (!item) return
      const itemNumber = item['Item Number']
      const itemDescription = item['Item Description']
      const extendedPrice = new BigNumber(item['Price (Extended)'])
      // const qtyShipped = item['Quantity Shipped']

      const categoryEntry = categoryList.find(
        (entry) => entry.code === itemNumber
      )

      if (categoryEntry) {
        const category = categoryEntry.category

        let totalWithTax = categoryEntry.tax
          ? extendedPrice.plus(
              extendedPrice
                .multipliedBy(salesTax / 100) // Add tax if applicable
                .decimalPlaces(2, BigNumber.ROUND_HALF_DOWN) // Round to 2 decimal places
            )
          : extendedPrice // otherwise, no tax

        matchedItems.push({
          //add matched item details to array
          itemNumber,
          itemDescription,
          category,
          totalWithTax,
          totalWithoutTax: extendedPrice,
        })

        // Add to category total
        totals[category] = totals[category]
          ? totals[category].plus(totalWithTax)
          : totalWithTax

        // Add to grand total
        grandTotal = grandTotal.plus(totalWithTax)
      } else {
        // if no matching category is found, add to unmatched items
        let totalWithTax = extendedPrice.plus(
          extendedPrice
            .multipliedBy(salesTax / 100) // add tax...
            .decimalPlaces(2, BigNumber.ROUND_HALF_DOWN) // ...and round to 2 decimal places
        )

        let totalWithoutTax = extendedPrice // no tax

        // add unmatched item details to array
        unmatchedItems.push({
          itemNumber,
          itemDescription,
          totalWithTax,
          totalWithoutTax,
        })

        // Add to grand total
        grandTotal = grandTotal.plus(totalWithoutTax)
      }
    })
  } catch (error) {
    console.error(error)
  }

  // Apply additional charges evenly across categories and unmatched items
  const totalItems = matchedItems.length + unmatchedItems.length // Total number of items
  const numberOfCategories = Object.keys(totals).length

  if (additionalCharges && numberOfCategories > 0) {
    const chargePerItem = new BigNumber(additionalCharges)
      .dividedBy(totalItems)
      .decimalPlaces(2, BigNumber.ROUND_DOWN)

    const chargePerCategory = new BigNumber(additionalCharges)
      .dividedBy(numberOfCategories)
      .decimalPlaces(2, BigNumber.ROUND_DOWN)

    const totalChargesForCategories =
      chargePerCategory.multipliedBy(numberOfCategories)

    const mod = new BigNumber(additionalCharges).minus(
      totalChargesForCategories
    )

    // Distribute charges to categories
    Object.keys(totals).forEach((category) => {
      totals[category] = totals[category].plus(chargePerCategory)
    })

    // Find the category with the highest total
    const maxTotalCategory = Object.keys(totals).reduce((max, current) => {
      return totals[current].gt(totals[max]) ? current : max
    }, Object.keys(totals)[0])

    // Add the mod value to the total of the category with the highest total
    totals[maxTotalCategory] = totals[maxTotalCategory].plus(mod)

    // Distribute charges to matched items
    matchedItems.forEach((matchedItem) => {
      matchedItem.totalWithTax = matchedItem.totalWithTax.plus(chargePerItem)
    })

    // Distribute charges to unmatched items
    unmatchedItems.forEach((unmatchedItem) => {
      unmatchedItem.totalWithTax =
        unmatchedItem.totalWithTax.plus(chargePerItem)
      unmatchedItem.totalWithoutTax =
        unmatchedItem.totalWithoutTax.plus(chargePerItem)
    })

    // Add additional charges to the grand total
    grandTotal = grandTotal.plus(additionalCharges)
  }

  // Return the category totals, grand total of invoice, and the matched/unmatched items
  return {
    totals,
    grandTotal,
    matchedItems,
    unmatchedItems,
  }
}

export { readStreamToJsonArray, calculateCategoryTotals }
