'use server'

import { Item } from '@/app/interfaces/item.interface'
import BigNumber from 'bignumber.js'
import prisma from '@/utils/db'

async function getGfsItems() {
  try {
    return await prisma?.gFS_Items.findMany()
  } catch (e) {
    console.error(e)
  }
}

export const createInvoice = async (
  items: Item[] | undefined,
  salesTax: BigNumber,
  additionalCharges: BigNumber,
  grandTotal: BigNumber,
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

    const invoiceInfo = {
      invoiceNumber,
      vendor,
      date,
      itemTotals,
      grandTotal,
      salesTax,
      additionalCharges,
    }

    await findOrCreateInvoice(invoiceInfo)

    await findOrAddItemToInvoice(items, invoiceNumber)
  } catch (e) {
    console.error(e)
  }
}

const findOrAddItemToInvoice = async (items: any, invoiceNumber: any) => {
  try {
    const gfsCode = await getGfsItems()
    const listOfAddedItems: any = []
    await Promise.all(
      items.map(async (item: any) => {
        const itemCategory = await findOrCreateCategory(item)

        // Check if item already exists
        let itemCreated = await prisma?.item.findFirst({
          where: {
            invoiceId: invoiceNumber,
            itemCode: item['Item Number'],
          },
        })

        if (!itemCreated) {
          const taxable =
              gfsCode?.find((entry) => entry.code === item['Item Number'])
                ?.tax ?? false,
            itemCreated = await prisma?.item.create({
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

const findOrCreateInvoice = async (invoiceInfo: any) => {
  try {
    let upsertInvoice = await prisma?.invoice.upsert({
      where: {
        invoiceNumber: invoiceInfo.invoiceNumber,
      },
      update: {
        total: Number(invoiceInfo.itemTotals),
        date: invoiceInfo.date,
        vendorId: invoiceInfo.vendor?.id,
        additionalCharges: invoiceInfo.additionalCharges,
        salesTax: invoiceInfo.salesTax,
        grandTotal: invoiceInfo.grandTotal,
      },
      create: {
        invoiceNumber: invoiceInfo.invoiceNumber,
        vendorId: invoiceInfo.vendor?.id,
        date: invoiceInfo.date,
        salesTax: invoiceInfo.salesTax,
        additionalCharges: invoiceInfo.additionalCharges,
        total: Number(invoiceInfo.itemTotals),
        grandTotal: invoiceInfo.grandTotal,
      },
    })
    // console.log(invoiceInfo)
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
    let vendor = await prisma?.vendor.findFirst({
      where: {
        name: vendorName,
      },
    })

    if (!vendor) {
      vendor = await prisma?.vendor.create({
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
    const gfsCode = await getGfsItems()
    const itemFound = gfsCode?.find(
      (entry: any) => entry.code == itemCategory['Item Number']
    )

    if (!itemFound) {
      throw Error(
        'Category not found. Please add item to proper category before proceeding.'
      )
    }

    let upsertCategory = await prisma?.category.upsert({
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

export const categorizeItem = async (item: any) => {
  try {
    // const gfsCode = await getGfsItems()

    await prisma?.gFS_Items.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        category: item.category,
        tax: item.tax,
      },
      create: {
        code: item.code,
        name: item.name,
        category: item.category,
        tax: item.tax,
      },
    })
    // const newContent = `export const gfsCode=${JSON.stringify(newGfsCode)}`
    // const filePath = path.resolve('app', 'api', 'config', 'gfs_code.ts')

    // fs.writeFile(filePath, newContent, (err) => {
    //   if (err) {
    //     console.error('Error writing to file:', err)
    //   } else {
    //     console.log('File successfully overwritten!')
    //   }
    // })
  } catch (e) {
    console.error(
      '***********************************\nERROR AT categorizeItem: ' + e
    )
  }
}
