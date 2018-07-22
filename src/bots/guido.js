const bot = require('../bot')
const format = require('../format')

module.exports = ({ exitCommands, botSwitchCommands, updateNameCommands }) =>
  bot.make('Guido', format.cyan, {
    description: 'Your friendly Botland guide.',
    talk: (bot) => bot.ask(`What would you like to do?

    ${format.bold('list')} - list available bots
    ${format.bold(`${botSwitchCommands[0]} <botname>`)} - talk to another bot
  
    ${format.bold(updateNameCommands[0])} - change your name

    ${format.bold(exitCommands.join(', '))} - exit botland
  `)
  })
