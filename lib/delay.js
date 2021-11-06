'use strict'

module.exports = async (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000))
