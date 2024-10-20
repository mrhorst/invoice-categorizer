'use server'

import db from './db'
import { Item } from '@/app/interfaces/item.interface'
import BigNumber from 'bignumber.js'
import { gfsCode } from '@/app/api/config/gfs_code'
const SALES_TAX = 7 // Hardcoded for now.

export const createInvoice = async (
  items: Item[] | undefined,
  fileName: any
) => {
  if (items == undefined) {
    throw new Error('Items are undefined. Please check file.')
  }

  try {
    const { vendorName, invoiceNumber, year, fullYear, month, day } =
      await extractInvoiceInfo(fileName)

    const date = new Date(`${fullYear}-${month}-${day}`)
    const itemTotals = getItemTotals(items)?.toString()
    const vendor = await findOrCreateVendor(vendorName)

    await findOrCreateInvoice(invoiceNumber, vendor, date, itemTotals)

    await findOrAddItemToInvoice(items, invoiceNumber)
  } catch (e) {
    console.error(e)
  }
}

const findOrAddItemToInvoice = async (items: any, invoiceNumber: any) => {
  try {
    const listOfAddedItems: any = []
    await Promise.all(
      items.map(async (item: any) => {
        const itemCategory = await findOrCreateCategory(item)

        // Check if item already exists
        let itemCreated = await db.item.findFirst({
          where: {
            invoiceId: invoiceNumber,
            itemCode: item['Item Number'],
          },
        })

        if (!itemCreated) {
          const taxable =
              gfsCode.find((entry) => entry.code === item['Item Number'])
                ?.tax ?? false,
            itemCreated = await db.item.create({
              data: {
                // invoiceId: invoiceNumber,
                invoice: {
                  connect: {
                    invoiceNumber: invoiceNumber,
                  },
                },
                itemCode: item['Item Number'],
                description: item['Item Description'],
                category: {
                  connect: {
                    id: itemCategory?.id,
                  },
                },
                price: item['Price (Case/Unit)'],
                extendedPrice: item['Price (Extended)'],
                itemQty: item['Quantity Shipped'],
                taxRate: SALES_TAX,
                taxable: taxable,
              },
            })
          listOfAddedItems.push(itemCreated)
        }
      })
    )
    return listOfAddedItems
  } catch (e) {
    console.error(e)
  }
}

const findOrCreateInvoice = async (
  invoiceNumber: any,
  vendor: any,
  date: any,
  itemTotals: any
) => {
  try {
    let upsertInvoice = await db.invoice.upsert({
      where: {
        invoiceNumber: invoiceNumber,
      },
      update: {
        total: Number(itemTotals),
        date: date,
        vendorId: vendor?.id,
      },
      create: {
        invoiceNumber: invoiceNumber,
        vendorId: vendor?.id,
        date: date,
        total: Number(itemTotals),
      },
    })
    return upsertInvoice
  } catch (e) {
    console.error(
      '***********************************\nERROR AT findOrCreateInvoice:\n' + e
    )
  }
}
const extractInvoiceInfo = async (fileName: any) => {
  // fileName has the following format: VENDOR DD.MM.YY #INVOICE_NUMBER
  const [month, day, year] = fileName
    .split(' ')[1]
    .match(/\d{2}\.\d{2}\.\d{2}/)[0]
    .split('.')

  const fullYear = `20${year}`

  const vendorName = fileName.split(' ')[0]
  const invoiceNumber = fileName.split(' ')[2].split('#')[1] // Extract invoice number from file name and get rid of the # sign
  return {
    vendorName,
    invoiceNumber,
    year,
    fullYear,
    month,
    day,
  }
}

const findOrCreateVendor = async (vendorName: any) => {
  try {
    let vendor = await db.vendor.findFirst({
      where: {
        name: vendorName,
      },
    })

    if (!vendor) {
      vendor = await db.vendor.create({
        data: {
          name: vendorName,
        },
      })
    }

    return vendor
  } catch (e) {
    console.error(
      '***********************************\nERROR AT findOrCreateVendor:\n' + e
    )
  }
}

const getItemTotals = (items: Item[]) => {
  let total = new BigNumber(0)
  try {
    items.map((item) => {
      total = total.plus(
        BigNumber(item['Price (Case/Unit)']).multipliedBy(
          item['Quantity Shipped']
        )
      )
    })
    return total
  } catch (e) {
    console.error(
      '***********************************\nERROR AT getItemTotals:\n' + e
    )
  }
}

const findOrCreateCategory = async (itemCategory: any) => {
  try {
    const itemFound = gfsCode.find(
      (entry: any) => entry.code == itemCategory['Item Number']
    )

    if (!itemFound) {
      throw Error(
        'Category not found. Please add item to proper category before proceeding.'
      )
    }

    let upsertCategory = await db.category.upsert({
      where: {
        name: itemFound?.category,
      },
      update: {
        name: itemFound?.category,
      },
      create: {
        name: itemFound?.category,
      },
    })
    return upsertCategory
  } catch (e) {
    console.error(
      '***********************************\nERROR AT findOrCreateCategory: ' + e
    )
  }
}
