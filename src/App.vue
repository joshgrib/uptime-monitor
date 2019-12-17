<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">
        <!-- <img alt="Vue logo" style="height: 40px" src="./assets/bb-stats.jpg"> -->
        <h1>
          uptime-monitor
          <small class="text-muted">collect uptime info from different URLsI</small>
        </h1>
      </a>
    </nav>
    <section class="container-fluid">
      <div class="row wrap">
        <article
          v-for="({ route, requests, timing }, idx) in routeStats"
          :key="idx"
          class="col-sm-3"
        >
          <h2>{{ route }}</h2>
          <h3>Requests</h3>
          <p>Total: {{ requests.total }}</p>
          <p>Failed: {{ requests.failed }}</p>
          <p>Succeeded: {{ requests.success }}</p>
          <h3>Timing</h3>
          <p>Total: {{ timing.samples }}</p>
          <p>Total wait time: {{ timing.totalWaitTime }} ms</p>
          <p>Average wait time: {{ timing.average }} ms</p>
          <p>{{ timing.times }}</p>
        </article>
      </div>
    </section>
    <hr>
    {{ history }}
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      history: []
    }
  },
  mounted () {
    this.loadHistory()
  },
  computed: {
    routeStats () {
      const routes = [...new Set(this.history.map(h => h.route))]
      return routes.map(route => {
        const routeHistory = this.history.filter(h => h.route === route)
        const failedHistory = routeHistory.filter(h => h.responseTime === -1)
        const successHistory = routeHistory.filter(h => h.responseTime !== -1)
        const responseTimes = successHistory.map(h => h.responseTime)
        const requests = {
          total: routeHistory.length,
          failed: failedHistory.length,
          success: successHistory.length
        }
        const samples = responseTimes.length
        const totalWaitTime = responseTimes.reduce((acc, curr) => acc + curr, 0)
        const timing = {
          samples,
          totalWaitTime,
          average: totalWaitTime / responseTimes.length,
          times: responseTimes
        }
        return { route, requests, timing }
      })
    }
  },
  methods: {
    async loadHistory () {
      const response = await axios.get('http://localhost:3000/history')
      this.history = response.data
    }
  }
}
</script>
