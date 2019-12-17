<template>
  <v-card>
    <v-card-title class="mb-1">
      {{ route }}
    </v-card-title>
    <v-card-text>
      <v-alert
        v-if="history.length === 0"
        :value="true"
        type="info"
      >
        No history yet!
      </v-alert>
      <dev v-else>
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
              Speed
            </header>
            <v-rating
              readonly
              v-model="timing.speedRating"
              half-increments
              background-color="primary lighten-3"
              color="primary"
            />
          </v-col>
          <v-col>
            <header class="text-uppercase">
              Recent failures
            </header>
            <ul>
              <li v-if="recentFailures.length === 0">None!</li>
              <li
                v-else
                v-for="(failure, idx) in recentFailures"
                :key="idx"
              >
                {{ failure.timestamp }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </dev>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        @click="$emit('delete')"
      >
        <v-icon left>mdi-delete</v-icon>
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'RouteCard',
  props: {
    route: {
      type: String,
      required: true
    },
    history: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    failHistory () {
      return this.history.filter(h => h.responseTime === -1)
    },
    successHistory () {
      return this.history.filter(h => h.responseTime !== -1)
    },
    requests () {
      return {
        total: this.history.length,
        failed: this.failHistory.length,
        success: this.successHistory.length
      }
    },
    timing () {
      const responseTimes = this.successHistory.map(h => h.responseTime)
      const samples = responseTimes.length
      const totalWaitTime = responseTimes.reduce((acc, curr) => acc + curr, 0)
      const average = totalWaitTime / responseTimes.length
      return {
        samples,
        totalWaitTime,
        average,
        times: responseTimes,
        speedRating: ((5000 - average) / 5000) * 5
      }
    },
    recentFailures () {
      const history = [...this.failHistory]
      return history.sort((a, b) => {
        return a.timestamp > b.timestamp ? -1 : 1
      })
    }
  }
}
</script>
