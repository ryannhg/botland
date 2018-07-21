const io = require('./io')
const db = require('./db')
const format = require('./format')
const { isOneOf, exists, isEmpty } = require('./utils')

const main = () =>
  io.clear()
    .then(_ => db.get('user.name').value() === undefined
      ? welcomeNewUser()
      : bots.guido.greet()
    )
    .then(understand(bots.guido))

const exitCommands = [
  'bye', 'exit', 'quit', 'see ya', 'peace!'
]
const botSwitchCommands = [
  'hey', 'yo'
]

const isExitCommand = isOneOf(exitCommands)
const isBotSwitchCommand = isOneOf(botSwitchCommands)

const bots = {
  guido: require('./bots/guido')({ exitCommands, botSwitchCommands }),
  wendy: require('./bots/wendy')
}

const botToSwitchTo = (message) => {
  const [ firstWord, secondWord, ...otherWords ] = message.split(' ').filter(exists)
  const isBotName = isOneOf(Object.keys(bots))
  const isSwitchingToBot = isBotSwitchCommand(firstWord) && isBotName(secondWord) && isEmpty(otherWords)
  return isSwitchingToBot ? bots[secondWord] : undefined
}

const isSwitchingToBot = (message) =>
  botToSwitchTo(message) !== undefined

const isAskingForBotList = (message) =>
  message === 'list'

const listBots = (bot) =>
  bot.ask(`Here are the available bots:

  ${Object.keys(bots).map((name) => `${format.bold(bots[name].formattedName())} - ${bots[name].description()}`).join('\n  ')}
`).then(understand(bot))

const switchToBot = (bot) =>
  bot.greet().then(understand(bot))

const talkTo = (bot) =>
  bot.talk().then(understand(bot))

// Help
const understand = (bot) => (reply) =>
  isExitCommand(reply)
    ? io.exit()
    : isAskingForBotList(reply)
      ? listBots(bot)
      : isSwitchingToBot(reply)
        ? switchToBot(botToSwitchTo(reply))
        : talkTo(bot)

const welcomeNewUser = () =>
  bots.guido.ask(`What's your name?`)
    .then(name => db.set('user.name', name).write())
    .then(bots.guido.greet)
    .catch(console.error)

main()
