import BigNumber from 'bignumber.js'
export interface Item {
  'Item Number': string
  'Item Description': string
  'Price (Extended)': string
  'Quantity Shipped': string
  'Price (Case/Unit)': string
  Category: Category
  itemQty: BigNumber
  extendedPrice: BigNumber
  taxable: boolean
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
  totalWithoutTax: BigNumber
}
