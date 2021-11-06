'use strict'

const fetch = require('node-fetch')
const storage = require('node-persist')

const delay = require('./delay')

const fetchCoinData = async () => {
  const coinData = await storage.getItem('coinData')

  const isFresh = await storage.getItem('coinData.isFresh')
  const isFetching = await storage.getItem('coinData.isFetching')
  if (isFresh || isFetching) {
    // If data is available then immediately return it
    if (coinData) {
      return coinData
    }

    // Otherwise, wait a bit and attempt fetch again
    await delay(5)
    return fetchCoinData()
  }

  console.log('Fetching coin data')
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${process.env.COINGECKO_COIN_ID}`
  )
  const responseJson = await response.json()
  await storage.setItem('coinData', responseJson)
  await storage.setItem('coinData.isFresh', true, { ttl: 60000 })
  await storage.removeItem('coinData.isFetching')
  return fetchCoinData()
}

module.exports = fetchCoinData
