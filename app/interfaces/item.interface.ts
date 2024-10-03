import BigNumber from 'bignumber.js'
export interface Item {
  'Item Number': string
  'Item Description': string
  'Price (Extended)': string
}

export interface Category {
  code: string
  name: string
  category: string
  tax: boolean
}

export interface UnmatchedItems {
  itemNumber: string
  itemDescription: string
  totalWithTax: BigNumber
  totalWithoutTax: BigNumber
}

export interface MatchedItems {
  itemNumber: string
  itemDescription: string
  category: string
  totalWithTax: BigNumber
}
