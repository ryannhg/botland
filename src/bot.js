const io = require('./io')
const db = require('./db')
const format = require('./format')
const { randomlyPickFrom } = require('./utils')

const username = () =>
  db.get('user.name').value() || 'You'

const parse = (message) =>
  message
    .split('{{user}}').join(username())

const greetings = [
  'Hey {{user}}, how can I help?',
  'Hey there!',
  'Looking good, {{user}}.',
  `What's up, my dude?`,
  'Sup?'
]

module.exports = {
  make: (name, color, { talk, description } = {}) => ({
    name,
    formattedName () { return color(name) },
    ask: (question) => io.ask(`${color(format.bold(name))}: ${parse(question)}\n${format.bold(username())}: `),
    description () { return description || `I don't know what ${this.name} does.` },
    greet () { return this.ask(randomlyPickFrom(greetings)) },
    talk (message) { return talk(this, message) }
  })
}
