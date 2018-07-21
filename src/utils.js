module.exports = {
  log: (thing) => console.log(thing) || thing,
  debug: (thing) => console.log(thing) || thing,
  randomlyPickFrom: (list) => list[parseInt(Math.random() * list.length)],
  isOneOf: (list) => (item) => list.indexOf(item) !== -1,
  exists: a => a,
  isEmpty: list => list.length === 0
}
