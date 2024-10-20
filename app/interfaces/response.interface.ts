import BigNumber from 'bignumber.js'
import {
  UnmatchedItems,
  MatchedItems,
  Item,
} from '../interfaces/item.interface'
import { Decimal } from '@prisma/client/runtime/library'

export interface CsvResponse {
  message?: {
    categoryTotals: {
      totals: { [category: string]: BigNumber }
      grandTotal: BigNumber
      matchedItems: MatchedItems[]
      unmatchedItems?: UnmatchedItems[]
    }
    itemInfo: Item[]
    salesTax: BigNumber
    additionalCharges: BigNumber
  }
}
