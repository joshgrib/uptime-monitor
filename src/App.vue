<template>
  <v-app id="app">
    <v-app-bar
      app
      dense
      clipped-left
      color="primary"
    >
      <v-toolbar-title>
        <span class="headline font-weight-thin">
          uptime-monitor
        </span>
        <span class="subtitle-1 font-weight-bold font-italic">
          collect uptime info from different URLs
        </span>
      </v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row>
          <v-col
            v-for="({ route, requests, timing }, idx) in routeStats"
            :key="idx"
          >
            <v-card>
              <v-card-title class="headline mb-1">
                {{ route }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-sparkline
                      :value="timing.times"
                      auto-draw
                      smooth
                      gradientDirection="top"
                      :gradient="['red', 'yellow', 'green']"
                      height="50"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <h3>Requests</h3>
                    <p>Total: {{ requests.total }}</p>
                    <p>Failed: {{ requests.failed }}</p>
                    <p>Succeeded: {{ requests.success }}</p>
                  </v-col>
                  <v-col>
                    <h3>Timing</h3>
                    <p>Total: {{ timing.samples }}</p>
                    <p>Total wait time: {{ timing.totalWaitTime }} ms</p>
                    <p>Average wait time: {{ timing.average }} ms</p>
                    <p>{{ timing.times }}</p>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="error"
                  @click="deleteRoute(route)"
                >
                  <v-icon left>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <h2>History</h2>
          {{ history }}
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'

const API_BASE = 'http://localhost:3000'

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
      const response = await axios.get(`${API_BASE}/history`)
      this.history = response.data
    },
    async deleteRoute (route) {
      return await axios.get(`${API_BASE}/routes/remove`, { route })
    }
  }
}
</script>
