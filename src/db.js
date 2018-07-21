const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('data.json'))

db.defaults({ user: {} })
  .write()

module.exports = db
