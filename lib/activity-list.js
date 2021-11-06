'use strict'

const config = require('../config.json')

const buildActivity = (label, prop, suffix, marketData) => {
  return `${label}: ${marketData[prop]}${suffix ? suffix : ''}`
}

module.exports = config.activities.map(
  ({ label, prop, suffix }) =>
    (marketData) =>
      buildActivity(label, prop, suffix, marketData)
)
