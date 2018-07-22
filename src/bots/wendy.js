const axios = require('axios')
const bot = require('../bot')
const db = require('../db')
const format = require('../format')
const { debug } = require('../utils')

const weather = {
  for: (zip) =>
    axios.get(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${zip}%22)&format=json`)
}

const getWeather = () =>
  weather.for(getZipCode())

const getZipCode = () =>
  db.get('wendy.zipCode').value() || undefined

const needsZipCode = () =>
  getZipCode() === undefined

const requestZipCode = (bot) =>
  bot.ask(`What's your zip code?`)

const hasZipCode = (message) =>
  message.length === 5 && !isNaN(parseInt(message))

const storeZipCode = (bot, zipCode) =>
  Promise.resolve(db.set('wendy.zipCode', zipCode).write())

const formatWeather = ({ temp, text }) =>
  `${text} - ${temp}°F`

const formatWeatherRange = ({ low, high, text }) =>
  `${text} - ${low} to ${high}°F`

const getTodaysWeather = (bot) =>
  getWeather()
    .then(({ data }) => data.query.results.channel.item.condition)
    .then(formatWeather)
    .then(forecast => bot.ask(forecast))

const getWeekForecast = (bot) =>
  getWeather()
    .then(({ data }) => data.query.results.channel.item.forecast)
    .then((forecasts) => bot.ask(`Here's the weekly forecast:

  ${forecasts.slice(0, 7).map(forecast => `${format.bold(forecast.day)}: ${formatWeatherRange(forecast)}`).join('\n  ')}
`))

const offerHelp = (bot) =>
  bot.ask(`Here are the available commands:

  ${format.bold('today')} - get today's weather
  ${format.bold('forecast')} - get this week's forecast

  ${format.bold('location')} - set a new location
`)

module.exports =
  bot.make('Wendy', format.magenta, {
    description: 'Get the latest weather.',
    talk: (bot, message) =>
      needsZipCode() && hasZipCode(message)
        ? storeZipCode(bot, message)
          .then(_ => bot.ask(`Awesome, getting weather for ${message}.`))
        : needsZipCode()
          ? requestZipCode(bot)
          : message === 'today'
            ? getTodaysWeather(bot)
            : message === 'forecast'
              ? getWeekForecast(bot)
              : message === 'location'
                ? storeZipCode(bot, undefined)
                  .then(_ => requestZipCode(bot))
                : offerHelp(bot)
  })
