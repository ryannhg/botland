const bot = require('../bot')
const format = require('../format')

module.exports =
  bot.make('Wendy', format.magenta, {
    description: 'Get the latest weather.',
    talk: (bot, message) =>
      message === 'today'
        ? bot.ask(`Getting today's weather...`)
        : bot.ask(`I don't understand.`)
  })
