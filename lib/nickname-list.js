'use strict'

const config = require('../config.json')

const buildNickname = (
  currencyName,
  currencySymbol,
  coinSymbol,
  marketData
) => {
  const { current_price: currentPrice, price_change_24h: priceChange24h } =
    marketData
  const trend = priceChange24h > 0 ? '↗' : '↘'

  return `${coinSymbol.toUpperCase()} ${currencySymbol}${currentPrice[
    currencyName
  ].toFixed(3)} (${trend})`
}

module.exports = config.nicknames.map(
  ({ currencyName, currencySymbol }) =>
    (coinSymbol, marketData) =>
      buildNickname(currencyName, currencySymbol, coinSymbol, marketData)
)
