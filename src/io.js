const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})
const { log } = require('./utils')

module.exports = {
  clear: () => Promise.resolve(console.clear()),
  print: (msg) => Promise.resolve(log(msg)),
  ask: (question) => new Promise(resolve => rl.question(question, resolve)),
  exit: () => Promise.resolve(process.exit(0))
}
