const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const Pinger = require('./pinger')
const jsonConvert = require('./jsonConvert')
const db = require('./db')

const app = express()

const INIT_SAVE_RATE_MS = 1000 * 30
const INIT_PING_RATE_MS = 1000 * 15

/*******************************************************************************
 * Middleware
 ******************************************************************************/
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('(serve) :method :status :response-time ms - :url'))

/*******************************************************************************
 * Routes
 ******************************************************************************/
app.get('/routes', (req, res) => {
  res.json(pinger.routes)
})
// GET /routes/add?route=http://fast.com?param=one
app.get('/routes/add', (req, res) => {
  const newRoute = req.query.route
  if (!newRoute) {
    return res.status(500).send(`Query string must contain 'route' parameter`)
  }
  pinger.addRoute(newRoute)
  res.send(`Added new route: "${newRoute}"`)
})
app.get('/routes/remove', (req, res) => {
  const routeToRemove = req.query.route
  if (!routeToRemove) {
    return res.status(500).send(`Query string must contain 'route' parameter`)
  }
  pinger.removeRoute(routeToRemove)
  res.send(`Removed route: "${routeToRemove}"`)
})
app.get('/history', (req, res) => {
  res.json(pinger.history)
})
app.get('/set-refresh/:refreshMs', (req, res) => {
  pinger.changeRefreshRate(req.params.refreshMs)
  res.send(`Refresh time is now ${pinger.refreshMs}ms`)
})
app.get('/', async (req, res) => {
  const result = await pinger.pingAll()
  const html = jsonConvert.toHtmlTable(result)
  res.send(html)
})

/*******************************************************************************
 * Startup
 ******************************************************************************/
/**
 * A function to run in an interval and save pinger history
 */
console.log('Loading history...')
const defaultData = {
  routes: ['http://www.google.com', 'https://stackoverflow.com', 'http://fast.com'],
  history: [],
  refreshMs: INIT_PING_RATE_MS
}
let { routes, history, refreshMs } = db.load(defaultData)
const pinger = new Pinger(routes, history, refreshMs)

const port = process.env.PORT || 3000
app.listen(port, () => {
  setInterval(() => {
    console.log('Saving history...')
    const { routes, history } = pinger
    db.save({ routes, history, refreshMs })
  }, INIT_SAVE_RATE_MS)
  console.log(`Listening on port ${port}...`)
})
