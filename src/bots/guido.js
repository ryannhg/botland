const bot = require('../bot')
const format = require('../format')

module.exports = ({ exitCommands, botSwitchCommands }) =>
  bot.make('Guido', format.cyan, {
    description: 'Your friendly Botland guide.',
    talk: (bot) => bot.ask(`What would you like to do?

    ${format.bold('list')} - list available bots
    ${format.bold(`${botSwitchCommands.join(', ')} <botname>`)} - talk to another bot

    ${format.bold(exitCommands.join(', '))} - exit botland
  `)
  })
