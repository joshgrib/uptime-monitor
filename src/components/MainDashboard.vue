<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field
          v-model="newRouteValue"
          label="Add a new URL"
          prepend-icon="mdi-plus"
          outlined
          dense
          :rules="newRouteRules"
          @keyup.enter="addRoute"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="({ route, requests, timing }, idx) in routeStats"
        :key="idx"
      >
        <v-card>
          <v-card-title class="mb-1">
            {{ route }}
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
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
              <v-col class="text-center">
                <header class="text-uppercase">Uptime</header>
                <v-progress-circular
                  :value="requests.success / requests.total * 100"
                  color="success"
                  :size="90"
                  :width="10"
                >
                  <span class="headline">
                    {{ (requests.success / requests.total * 100).toFixed(0) }}%
                  </span>
                  <br>
                </v-progress-circular>
                <p>{{ requests.total }} total requests</p>
              </v-col>
              <v-col class="text-center">
                <header class="text-uppercase">
                  Spped
                </header>
                <v-rating
                  readonly
                  v-model="timing.speedRating"
                  half-increments
                  background-color="primary lighten-3"
                  color="primary"
                />
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
  </v-container>
</template>

<script>
import axios from 'axios'

const API_BASE = 'http://localhost:3000'

export default {
  name: 'MainDashboard',
  data () {
    return {
      routes: [],
      history: [],
      newRouteValue: undefined,
      newRouteRules: [v => /.+\..+/.test(v)|| 'Must be a valid domain']
    }
  },
  mounted () {
    this.loadHistory()
  },
  computed: {
    routeStats () {
      const routes = this.routes
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
        const average = totalWaitTime / responseTimes.length
        const timing = {
          samples,
          totalWaitTime,
          average,
          times: responseTimes,
          speedRating: ((5000 - average) / 5000) * 5
        }
        return { route, requests, timing }
      })
    }
  },
  methods: {
    async loadHistory () {
      this.routes = (await axios.get(`${API_BASE}/routes`)).data
      this.history = (await axios.get(`${API_BASE}/history`)).data
    },
    async deleteRoute (route) {
      await axios.get(`${API_BASE}/routes/remove`, {
        params: { route }
      })
      this.loadHistory()
    },
    async addRoute () {
      const route = this.newRouteValue
      await axios.get(`${API_BASE}/routes/add`, {
        params: { route }
      })
      this.newRouteValue = undefined
      this.loadHistory()
    }
  }
}
</script>
