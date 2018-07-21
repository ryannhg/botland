const codes = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  underscore: '\x1b[4m',
  colors: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  }
}

const wrapIn = (code) => (text) => code + text + codes.reset

module.exports = {
  black: wrapIn(codes.colors.black),
  red: wrapIn(codes.colors.red),
  green: wrapIn(codes.colors.green),
  yellow: wrapIn(codes.colors.yellow),
  blue: wrapIn(codes.colors.blue),
  magenta: wrapIn(codes.colors.magenta),
  cyan: wrapIn(codes.colors.cyan),
  white: wrapIn(codes.colors.white),
  bold: wrapIn(codes.bold),
  underscore: wrapIn(codes.bold)
}
