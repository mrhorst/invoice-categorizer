import BigNumber from 'bignumber.js'
import { UnmatchedItems, MatchedItems } from '../interfaces/item.interface'

export interface CsvResponse {
  message?: {
    totals: { [category: string]: BigNumber }
    grandTotal: BigNumber
    matchedItems: MatchedItems[]
    unmatchedItems?: UnmatchedItems[]
  }
}
