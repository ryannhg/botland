const bot = require('../bot')
const format = require('../format')

module.exports =
  bot.make('Wendy', format.magenta, {
    description: 'Get the latest weather.',
    talk: (bot) => bot.ask('I cant do anything yet...')
  })
