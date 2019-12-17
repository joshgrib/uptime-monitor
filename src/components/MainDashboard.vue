<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field
          v-model="newRouteValue"
          color="success"
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
        v-for="(route, idx) in routes"
        :key="idx"
      >
        <route-card
          :route="route"
          :history="history.filter(h => h.route === route)"
          @delete="deleteRoute(route)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import RouteCard from './RouteCard'

const API_BASE = 'http://localhost:3000'

export default {
  name: 'MainDashboard',
  components: { RouteCard },
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
