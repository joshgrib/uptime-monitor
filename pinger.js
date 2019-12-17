const axios = require('axios')

axios.interceptors.response.use(response => {
  const logFormat = '(axios) :method :status :response-time ms - :url'
  logStr = logFormat
    .replace(':method', response.config.method.toUpperCase())
    .replace(':url', response.config.url)
    .replace(':status', response.status )
    .replace(':response-time', response.headers['response.time'] || '?')
  console.log(logStr)
})

/**
 * Ping a URL
 * @param {string} url - The URL to ping
 * @returns The response time in milliseconds, or -1 if error
 */
async function ping (url) {
  const start = new Date()
  try {
  await axios.get(url)
  const end = new Date()
  return end - start
  } catch (err) {
    console.error(`Ping ERROR: ${url} - ${err.code}`)
    return -1
  }
}

const DEFAULT_REFRESH_MS = 1000 * 5
/**
 * Ping a list of URL routes and record history of response times
 */
class Pinger {
  /**
   * Create a new Pinger
   * @param {string[]} routes - The list of URLs to ping
   * @param {int} refreshMs - The ping frequency in milliseconds
   */
  constructor (routes = [], history = [], refreshMs = DEFAULT_REFRESH_MS) {
    this.routes = routes
    this.refreshMs = refreshMs
    this.history = history
    // start collecting history immediately
    this.recordHistory()
    this.refreshTimerId = setInterval(this.recordHistory.bind(this), this.refreshMs)
  }
  /**
   * Add a new route to ping
   * @param {string} route - A new route to ping
   */
  addRoute (route) {
    if (!this.routes.includes(route)) {
      this.routes.push(route)
    }
  }
  /**
   * Remove a route from the ping list
   * @param {string} route - The URL to stop pinging
   */
  removeRoute (route) {
    const idx = this.routes.indexOf(route)
    if (idx !== -1) {
      this.routes.splice(idx, 1)
    }
  }
  /**
   * Start recording history for all the routes
   */
  async recordHistory () {
    // FIXME: get history in parallel
    for(let route of this.routes) {
      const responseTime = await ping(route)
      const timestamp = new Date()
      this.history.push({ route, responseTime, timestamp })
    }
  }
  /**
   * Change the ping frequency
   * @param {int} refreshMs - The ping frequency in milliseconds
   */
  changeRefreshRate (refreshMs) {
    clearInterval(this.refreshTimerId)
    this.refreshMs = refreshMs
    this.refreshTimerId = setInterval(this.recordHistory.bind(this), this.refreshMs)
  }
  /**
   * Ping all routes
   * @returns The routes and response times
   */
  async pingAll () {
    let result = []
    for(let route of this.routes) {
      const responseTime = await ping(route)
      const timestamp = new Date()
      result.push({ route, responseTime, timestamp })
    }
    return result
  }
}

module.exports = Pinger
