import { http, HttpResponse } from 'msw'
import { factory, primaryKey } from '@mswjs/data'
import { Stock } from '../features/stock/stockSlice'
import { CreateProductRequest, OrderGroupItem, OrderItemResponseBody, OrderResponseBodyFailure } from '../models/apiModels'
import { v7 as uuidv7 } from 'uuid'
import { AUTHORIZATION } from '../const'
import { ActiveSession } from '../features/user/userSlice'
import { Product } from '../models/apiModels'

const ARTIFICIAL_DELAY_MS = 300
const NUM_PRODUCT = 3

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const tempImageUrl = `/assets/cat-placeholder.webp`

/* RNG setup */

// Set up a seeded random number generator, so that we get
// a consistent set of users / entries each time the page loads.
// This can be reset by deleting this localStorage value,
// or turned off by setting `useSeededRNG` to false.

// let useSeededRNG = false

// if (useSeededRNG) {
//   let randomSeedString = localStorage.getItem('randomTimestampSeed') as string //TODO not for nextjs
//   let seedDate

//   if (randomSeedString) {
//     seedDate = new Date(randomSeedString)
//   } else {
//     seedDate = new Date()
//     randomSeedString = seedDate.toISOString()
//     localStorage.setItem('randomTimestampSeed', randomSeedString)
//   }

//   faker.seed(seedDate.getTime())
// }

const db = factory({
  product: {
    id: primaryKey(String),
    name: String,
    price: String,
    description: String,
    imageUrl: String,
  },
  store: {
    id: primaryKey(String),
    name: String,
    description: String,
    lat: Number,
    long: Number,
    imageUrl: String,
  },
  stock: {
    storeIdProductId: primaryKey(String), // composite key not supported
    storeId: String,
    productId: String,
    stock: Number,
  },
  order: {
    primaryKey: primaryKey(String),
    storeId: String,
    productId: String,
    pricePerOne: Number,
    selectedAmount: Number,
    userId: String,
    time: Number,
    orderGroupId: String,
  },
})

// Load database from localStorage if available
const loadDatabase = () => {
  const storedData = localStorage.getItem('mswjs-db')
  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Object.keys(parsedData).forEach((model) => {
      parsedData[model].forEach((record: any) => {
        db[model].create(record)
      })
    })
  } else {
    // Generate initial data if not available in localStorage
    generateInitialData()
    saveDatabase()
  }
}

// Save database to localStorage
const saveDatabase = () => {
  const data = {
    product: db.product.getAll(),
    store: db.store.getAll(),
    stock: db.stock.getAll(),
    order: db.order.getAll(),
  }
  localStorage.setItem('mswjs-db', JSON.stringify(data))
}

export const storeImageUrls = [
`/assets/household.jpg`,
`/assets/electronic_accessories.jpg`,
`/assets/cat-placeholder.webp`
];

export const imageUrls = [
  ...storeImageUrls,
  '/assets/ace_air_cond_cooler.jpg',
  `/assets/roku_smart_door.jpg`,
  `/assets/champange.jpg`,
  `/assets/toaster.jpg`,
  `/assets/tplink.jpg`,
  `/assets/samsung_monitor.jpg`,
  `/assets/amazon_sd_128.jpg`,
  `/assets/lightning.jpg`
]

const product1 : Product = {
  id: uuidv7(),
  name: "Ace Cooler Air Conditioner",
  price: "1000",
  description: "a versatile and efficient cooling companion for your desk or workspace. Beat the heat and stay comfortable during hot summer days with this compact tower fan.",
  imageUrl: imageUrls[storeImageUrls.length + 0]
}

const product2 : Product = {
  id: uuidv7(),
  name: "Roku Smart Home Indoor Smart Plug",
  price: "49.99",
  description: "Control your home from anywhere: Worried you left the curling iron on? Check the status of your Roku Indoor Smart Plug and turn it on or off with a tap in the Roku Smart Home mobile app. Includes 1 smart plug.",
  imageUrl: imageUrls[storeImageUrls.length + 1]
}

const product3 : Product = {
  id: uuidv7(),
  name: "Mikasa Lana Stemless Champagne Flutes Glasses",
  price: "150",
  description: "these trendy and contemporary stemless flutes are perfect for celebrating special occasions",
  imageUrl: imageUrls[storeImageUrls.length + 2]
}

const product4 : Product = {
  id: uuidv7(),
  name: "Slice Toaster, 7 Toaster",
  price: "199.99",
  description: "1 - 7 Toasting levels plus Reheat setting",
  imageUrl: imageUrls[storeImageUrls.length + 3]
}

const product5 : Product = {
  id: uuidv7(),
  name: "TP-Link AX3000 WiFi 6 Router",
  price: "3000",
  description: "802.11ax Wireless Router, Gigabit, Dual Band Internet Router, VPN Router, OneMesh Compatible (Archer AX55)",
  imageUrl: imageUrls[storeImageUrls.length + 4]
}
const product6 : Product = {
  id: uuidv7(),
  name: "SAMSUNG 27\" Odyssey G32A",
  price: "6999.99",
  description: "Performance oriented gamers require a monitor that can keep up. With up to a 165hz refresh rate, extreme 1ms MPRT response time and full FreeSync Premium support, you can be sure that the Odyssey G32A Gaming Monitor has the performance to keep up with your skill. Game in Full HD with Eye Saver Mode and Flicker Free technology to protect eyes from stress and fatigue",
  imageUrl: imageUrls[storeImageUrls.length + 5]
}

const product7 : Product = {
  id: uuidv7(),
  name: "Amazon Basics Micro SDXC Memory Card 128 GB",
  price: "1200",
  description: "The Amazon Basics MicroSDXC offers up to 100mb/s transfer speed and up to 1TB of memory for faster-loading apps, rapid data transfers, and seamless recording and storing of 4K UHD videos, photos, music, and more. It's designed to keep your data safe in even the harshest environments, and features an IPX6 rating, as well as resistance to high temperatures, shocks, X-rays and magnetic fields. It also comes with a handy adapter, so it can be used on any device that supports SD cards.",
  imageUrl: imageUrls[storeImageUrls.length + 6]
}

const product8 : Product = {
  id: uuidv7(),
  name: "iPhone Charger Lightning Cable USB 10FT",
  price: "49.90",
  description: "Apple MFi certified Lightning Cable is guaranteed not to pop up warning messages, ensuring your Lightning devices load and charge safely and quickly at the fastest possible speed.",
  imageUrl: imageUrls[storeImageUrls.length + 7]
}

const productsForStore1 = [product1, product2, product3, product4];
const productsForStore2 = [product5, product6, product7, product8];
// const productsForStore3 = [product1, product2, product7, product8];

const allProducts = [product1, product2, product3, product4, product5, product6, product7, product8];


// Generate initial data
const generateInitialData = () => {

  const store1 = db.store.create({
    id: 'STORE1',
    name: 'Household Shop',
    description: 'Find all your house item needs here',
    lat: 53.54192,
    long: 10.00678,
    imageUrl: storeImageUrls[0],
  })

  const store2 = db.store.create({
    id: 'STORE2',
    name: 'Electronics accessories shop',
    description: 'Discover smart solutions for everyday life',
    lat: 53.549921,
    long: 10.006781,
    imageUrl: storeImageUrls[1],
  })

  // const store3 = db.store.create({
  //   id: 'STORE3',
  //   name: 'H and E accessories shop',
  //   description: 'Sell both household and electronics here',
  //   lat: 53.555882,
  //   long: 10.003781,
  //   imageUrl: storeImageUrls[2],
  // })

  allProducts.forEach(product => {
    db.product.create({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
    })
  })

  productsForStore1.forEach(product => {
    db.stock.create({
      storeIdProductId: String(store1.id + '|' + product.id),
      storeId: String(store1.id),
      productId: String(product.id),
      stock: Number(3),
    })
  })

  productsForStore2.forEach(product => {
    db.stock.create({
      storeIdProductId: String(store2.id + '|' + product.id),
      storeId: String(store2.id),
      productId: String(product.id),
      stock: Number(5),
    })
  })

  // productsForStore3.forEach(product => {
  //   db.stock.create({
  //     storeIdProductId: String(store3.id + '|' + product.id),
  //     storeId: String(store3.id),
  //     productId: String(product.id),
  //     stock: Number(7),
  //   })
  // })

}

// Initialize database
loadDatabase()

export const handlers = [
  http.get('https://mock-backend.com/product', async function () {
    const products = db.product.getAll()
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json({ products, total: products.length })
  }),
  http.post('https://mock-backend.com/product', async function ({ params, request }) {
    const newProduct = await request.json() as CreateProductRequest;
    const productId = uuidv7()
    const createdProduct = db.product.create({
      id: productId, 
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      imageUrl: newProduct.imageUrl
    });
    const authorization = request.headers.get(AUTHORIZATION)
    let token = authorization?.split(' ')[1];
    let tokenObj = JSON.parse(atob(token || "")) as ActiveSession;
    let storeOwner = tokenObj.storeOwner;
    
    const createdStock = db.stock.create({
      storeIdProductId: storeOwner+"|"+productId,
      storeId: storeOwner,
      productId: productId,
      stock: newProduct.stockAmount
    });
  
    await delay(ARTIFICIAL_DELAY_MS);
    saveDatabase();
    return HttpResponse.json(createdProduct);
  }),
  http.post('https://mock-backend.com/stock', async function ({ request }) {
    const newStock = await request.json() as Stock;
    const createdStock = db.stock.create({
      storeIdProductId: newStock.storeId+"|"+newStock.productId,
      productId: newStock.productId,
      stock: newStock.stockAmount
    });
  
    await delay(ARTIFICIAL_DELAY_MS);
    return HttpResponse.json(createdStock);
  }),
  http.get('https://mock-backend.com/store', async function () {
    const stores = db.store.getAll()
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json({ stores, total: stores.length })
  }),
  http.get('https://mock-backend.com/store/order', async ({ params, request }) => {
    const authorization = request.headers.get(AUTHORIZATION)
    let token = authorization?.split(' ')[1];
    let tokenObj = JSON.parse(atob(token || "")) as ActiveSession;
    let storeOwner = tokenObj.storeOwner;
    const orders = db.order.getAll().filter(order => order.storeId == storeOwner);
    const res: OrderItemResponseBody[] = [];
    // const allProducts = db.product.getAll();

    orders.forEach(item => {
      // const productEntity = allProducts.find((product) => product.id == item.productId)
      res.push({
        storeId: item.storeId,
        productId: item.productId,
        pricePerOne: item.pricePerOne,
        selectedAmount: item.selectedAmount,
        userId: item.userId,
        time: item.time,
        orderGroupId: item.orderGroupId,
        // product: {
        //   id: productEntity?.id || '',
        //   name: productEntity?.name || '',
        //   price: productEntity?.price || '',
        //   description: productEntity?.description || '',
        //   imageUrl: productEntity?.imageUrl || '',
        // },
      })
    })
    return HttpResponse.json(res)
  }),
  http.get('https://mock-backend.com/store/:storeId', async ({ params }) => {
    const stores = db.store.getAll()
    await delay(ARTIFICIAL_DELAY_MS)
    const { storeId } = params
    const store = stores.find((store) => store.id == storeId)
    return HttpResponse.json(store)
  }),
  http.put('https://mock-backend.com/store/:storeId', async ({ params, request }) => {
    const { storeId } = params;
    const updatedStore = await request.json();
  
    const store = db.store.findFirst({
      where: { id: { equals: storeId } },
    });
  
    if (store) {
      const updatedStoreData = db.store.update({
        where: { id: { equals: storeId } },
        data: updatedStore,
      });
  
      await delay(ARTIFICIAL_DELAY_MS);
      saveDatabase();
      return HttpResponse.json(updatedStoreData);
    }
  
    return new HttpResponse(null, { status: 404, statusText: 'Store not found' });
  }),
  http.get('https://mock-backend.com/stock/:storeId', async ({ params }) => {
    const { storeId } = params
    let stocks = db.stock.getAll()
    // let products = db.product.getAll()

    let stocksFiltered = stocks.filter((item) => item.storeId === storeId)
    let stocksFilteredWithProductData = stocksFiltered.map((stock) => {
      // let productMatched = products.filter((product) => product.id == stock.productId)[0]
      let stockJsonForFE = {
        storeId: stock.storeId,
        stockAmount: stock.stock,
        productId: stock.productId
        // product: productMatched,
      } as Stock
      return stockJsonForFE
    })
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(stocksFilteredWithProductData)
  }),
  // http.get('https://mock-backend.com/image/:assetId', async ({ params }) => {
  //   const { assetId } = params
  //   const fakerImageUrl = faker.image.url({ width: 500, height: 500 })
  //   const buffer = await fetch(fakerImageUrl).then((response) => response.arrayBuffer())
  //   return HttpResponse.arrayBuffer(buffer, {
  //     headers: {
  //       'Content-Type': 'image/jpeg',
  //     },
  //   })
  // }),
  http.get('https://mock-backend.com/product/:productId', async ({ params, request }) => {
    const { productId } = params;
    const allProducts = db.product.getAll();
    const productFound = allProducts.find(product => product.id == productId);
    await delay(ARTIFICIAL_DELAY_MS*2)
    return HttpResponse.json(productFound)
  }),
  http.get('https://mock-backend.com/order/group', async ({ params, request }) => {
    const authorization = request.headers.get(AUTHORIZATION)
    let token = authorization?.split(' ')[1];
    let tokenObj = JSON.parse(atob(token || "")) as ActiveSession;
    let userId = tokenObj.user;

    let orders = db.order.getAll()
    let ordersFiltered = orders.filter((item) => item.userId === userId)

    // Group orders by orderGroupId
    const orderGroups = ordersFiltered.reduce((groups, order) => {
      if (!groups[order.orderGroupId]) {
        groups[order.orderGroupId] = []
      }
      groups[order.orderGroupId].push(order)
      return groups
    }, {} as Record<string, typeof ordersFiltered>)

    // Create response
    const orderGroupsResponse = Object.keys(orderGroups).map((orderGroupId) => {
      const orders = orderGroups[orderGroupId]
      const totalPrice = orders.reduce((sum, order) => sum + order.pricePerOne * order.selectedAmount, 0)
      const stores = orders.map(order => {
        const store = db.store.findFirst({ where: { id: { equals: order.storeId } } })
        return { id: store?.id || '', name: store?.name || '' }
      })
      return {
        stores,
        orderGroupId,
        time: orders[0].time,
        totalPrice,
        userId: orders[0].userId,
        itemCount: orders.length
      } as OrderGroupItem
    })

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(orderGroupsResponse)
  }),
  http.get('https://mock-backend.com/order/group/:orderGroupId', async ({ request, params }) => {
    const authorization = request.headers.get(AUTHORIZATION)
    let token = authorization?.split(' ')[1];
    let tokenObj = JSON.parse(atob(token || "")) as ActiveSession;
    let userId = tokenObj.user;
    const { orderGroupId } = params
    let orders = db.order.getAll()

    const forCheckIfUnauthorizedOrNotAvailable = orders.filter((item) => item.orderGroupId === orderGroupId)
    if (!forCheckIfUnauthorizedOrNotAvailable[0] || forCheckIfUnauthorizedOrNotAvailable[0].userId != userId){
      return new HttpResponse(null, {
        status: 404,
        statusText: 'orderGroupId not found',
      })
    }

    let ordersFiltered = orders.filter((item) => item.orderGroupId === orderGroupId && item.userId == userId)
    // const allProducts = db.product.getAll()

    let ordersResponses = ordersFiltered.map((order) => {
      // const productEntity = allProducts.find((product) => product.id == order.productId)
      return {
        storeId: order.storeId,
        productId: order.productId,
        pricePerOne: order.pricePerOne,
        selectedAmount: order.selectedAmount,
        userId: order.userId,
        time: order.time,
        orderGroupId: orderGroupId,
        // product: {
        //   id: productEntity?.id || '',
        //   name: productEntity?.name || '',
        //   price: productEntity?.price || '',
        //   description: productEntity?.description || '',
        //   imageUrl: productEntity?.imageUrl || '',
        // },
      } as OrderItemResponseBody
    })

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(ordersResponses)
  }),
  http.post('https://mock-backend.com/checkout', async ({ request }) => {
    const authorization = request.headers.get(AUTHORIZATION)
    let token = authorization?.split(' ')[1];
    let tokenObj = JSON.parse(atob(token || "")) as ActiveSession;
    let userId = tokenObj.user;
    const genericAny = await request.json()
    const cartItems = genericAny as Cart[]

    // pass 1 validate if available stock, if one fail, will fail all
    for (const item of cartItems) {
      const stockItem = db.stock.findFirst({
        where: {
          storeId: {
            equals: item.storeId,
          },
          productId: {
            equals: item.productId,
          },
        },
      })

      const stockItemDeNull = stockItem?.stock || 0
      if (stockItemDeNull - item.selectedAmount < 0) {
        await delay(ARTIFICIAL_DELAY_MS)
        const product = db.product.getAll().find(product => product.id === stockItem?.productId);
        const store = db.store.getAll().find(store => store.id === stockItem?.storeId);

        const errorBody: OrderResponseBodyFailure = {
          statusCode: -2,
          statusDesc: `Product ${product?.name} of store ${store?.name} have stock of ${stockItemDeNull} while requested to buy ${item.selectedAmount}`,
        }
        return HttpResponse.json(errorBody)
      }
    }

    // pass 2 deduct stock from db
    const res: OrderItemResponseBody[] = []
    const orderGroupId = uuidv7()
    const allProducts = db.product.getAll()
    cartItems.forEach((item) => {
      const stockItem = db.stock.findFirst({
        where: {
          storeId: {
            equals: item.storeId,
          },
          productId: {
            equals: item.productId,
          },
        },
      })

      if (stockItem) {
        db.stock.update({
          where: {
            storeIdProductId: {
              equals: stockItem.storeIdProductId,
            },
          },
          data: {
            stock: stockItem.stock - item.selectedAmount,
          },
        })
      }
      const timeCommited = Date.now() //performance.now()
      // const productEntity = allProducts.find((product) => product.id == item.productId)
      res.push({
        storeId: item.storeId,
        productId: item.productId,
        pricePerOne: item.pricePerOne,
        selectedAmount: item.selectedAmount,
        userId: userId!,
        time: timeCommited,
        orderGroupId: orderGroupId,
        // product: {
        //   id: productEntity?.id || '',
        //   name: productEntity?.name || '',
        //   price: productEntity?.price || '',
        //   description: productEntity?.description || '',
        //   imageUrl: productEntity?.imageUrl || '',
        // },
      })
      db.order.create({
        primaryKey: `${userId}|${item.storeId}|${item.productId}|${item.pricePerOne}|${item.selectedAmount}|${orderGroupId}`,
        storeId: item.storeId,
        productId: item.productId,
        pricePerOne: item.pricePerOne,
        selectedAmount: item.selectedAmount,
        userId: userId,
        time: timeCommited,
        orderGroupId: orderGroupId,
      })
    })

    await delay(ARTIFICIAL_DELAY_MS)
    saveDatabase() // Save the updated database to localStorage
    console.log('checkout >> ', res)
    return HttpResponse.json(res)
  }),
  http.put('https://mock-backend.com/stock/:storeId/:productId', async ({ params, request }) => {
    const { storeId, productId } = params;
    const { stockAmount } = await request.json();
  
    const stockItem = db.stock.findFirst({
      where: {
        storeId: { equals: storeId },
        productId: { equals: productId },
      },
    });
  
    if (stockItem) {
      const updatedStock = db.stock.update({
        where: { storeIdProductId: { equals: stockItem.storeIdProductId } },
        data: { stock: stockAmount },
      });
  
      await delay(ARTIFICIAL_DELAY_MS);
      saveDatabase();
      return HttpResponse.json({
        storeId: updatedStock.storeId,
        stockAmount: updatedStock.stock,
        productId: updatedStock.productId,
      });
    }
  
    return new HttpResponse(null, { status: 404, statusText: 'Stock not found' });
  }),
  
  http.put('https://mock-backend.com/product/:productId', async ({ params, request }) => {
    const { productId } = params;
    const updatedProduct = await request.json();
  
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
  
    if (product) {
      const updatedProductData = db.product.update({
        where: { id: { equals: productId } },
        data: updatedProduct,
      });
  
      await delay(ARTIFICIAL_DELAY_MS);
      saveDatabase();
      return HttpResponse.json(updatedProductData);
    }
  
    return new HttpResponse(null, { status: 404, statusText: 'Product not found' });
  }),
]