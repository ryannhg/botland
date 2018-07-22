const io = require('./io')
const db = require('./db')
const format = require('./format')
const { isOneOf, exists, isEmpty } = require('./utils')

const dontHaveUsersName = () =>
  db.get('user.name').value() === undefined

const main = (bot) =>
  io.clear()
    .then(_ => dontHaveUsersName()
      ? askForUsersName(bot)
      : bot.greet()
    )
    .then(understand(bot))
    .catch(console.error)

const exitCommands = [
  'bye', 'exit', 'quit', 'see ya', 'peace!'
]
const botSwitchCommands = [
  'hey', 'yo'
]
const updateNameCommands = [
  'change name', 'new name', 'update name', 'thats not my name'
]

const isExitCommand = isOneOf(exitCommands)
const isBotSwitchCommand = isOneOf(botSwitchCommands)
const wantsToUpdateName = isOneOf(updateNameCommands)

const bots = {
  guido: require('./bots/guido')({ exitCommands, botSwitchCommands, updateNameCommands }),
  wendy: require('./bots/wendy')
}

const botToSwitchTo = (message) =>
  botName(message)
    ? bots[botName(message)]
    : undefined

const botName = (message) => {
  const [ firstWord, secondWord, ...otherWords ] = message.split(' ').filter(exists)
  const isBotName = isOneOf(Object.keys(bots))
  const isSwitchingToBot = isBotSwitchCommand(firstWord) && isBotName(secondWord) && isEmpty(otherWords)
  return isSwitchingToBot ? secondWord : undefined
}

const isSwitchingToBot = (message) =>
  botToSwitchTo(message) !== undefined

const isAskingForBotList = (message) =>
  message === 'list'

const listBots = (bot) =>
  bot.ask(`Here are the available bots:

  ${Object.keys(bots).map((name) => `${format.bold(bots[name].formattedName())} - ${bots[name].description()}`).join('\n  ')}
`).then(understand(bot))

const switchToBot = (name, bot) =>
  Promise.resolve(db.set('lastBot', name).write())
    .then(_ => bot.greet())
    .then(understand(bot))

const talkTo = (bot, message) =>
  bot.talk(message).then(understand(bot))

const understand = (bot) => (reply) =>
  isExitCommand(reply)
    ? io.exit()
    : wantsToUpdateName(reply)
      ? askForUsersName(bot).then(understand(bot))
      : isAskingForBotList(reply)
        ? listBots(bot)
        : isSwitchingToBot(reply)
          ? switchToBot(botName(reply), botToSwitchTo(reply))
          : talkTo(bot, reply)

const saveUsername = (name) =>
  db.set('user.name', name).write()

const askForUsersName = (bot) =>
  bot.ask(`What's your name?`)
    .then(saveUsername)
    .then(_ => bot.greet())

const lastBot = () =>
  bots[db.get('lastBot').value() || 'guido']

main(lastBot())
