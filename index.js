'use strict'

require('dotenv').config()

const assert = require('assert')
const { Client, Intents } = require('discord.js')
const fetch = require('node-fetch')
const storage = require('node-persist')
const { v4: uuid } = require('uuid')

assert.ok(
  process.env.BOT_TOKEN,
  'Bot token is required. Please set BOT_TOKEN env var'
)
assert.ok(
  process.env.COINGECKO_COIN_ID,
  'CoinGecko coin ID is required. Please set COINGECKO_COIN_ID'
)

const config = require('./config.json')
const activityList = require('./lib/activity-list')
const delay = require('./lib/delay')
const fetchCoinData = require('./lib/fetch-coin-data')
const nicknameList = require('./lib/nickname-list')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const rotateActivities = async () => {
  console.log('Rotating Activities')
  let index = 0

  while (true) {
    const { market_data: marketData } = await fetchCoinData()
    const activity = activityList[index++](marketData)
    console.log(`Setting activity to ${activity}`)
    await client.user.setActivity(activity, { type: 'WATCHING' })
    if (index >= activityList.length) {
      index = 0
    }
    await delay(10)
  }
}

const rotateNicknames = async () => {
  console.log('Rotating Nicknames')
  let index = 0
  const availableGuilds = client.guilds.cache.filter((guild) => guild.available)

  while (true) {
    const { market_data: marketData, symbol } = await fetchCoinData()
    const nickname = nicknameList[index++](symbol, marketData)
    if (index >= nicknameList.length) {
      index = 0
    }
    console.log(`Setting nickname to ${nickname}`)
    for (const [id, guild] of availableGuilds) {
      await guild.me.edit({ nick: nickname }, uuid())
    }
    await delay(20)
  }
}

const onReady = async () => {
  // Initial market data fetch
  await fetchCoinData()

  rotateNicknames()
  await delay(1)
  rotateActivities()
}

const main = async () => {
  await storage.init()

  client.once('ready', onReady)
  client.login(process.env.BOT_TOKEN)
}

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error)
})

main().catch(console.error)
