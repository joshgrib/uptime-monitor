<template>
  <div class="min-h-screen">
    <header class="bg-orange-500 p-2 shadow">
      <h1>
        <code class="text-xl p-4">uptime-monitor</code>
        <span>collect uptime info from URLs</span>
      </h1>
    </header>
    <main class="p-4 mx-auto">
      <add-url-form @submit="addUrl" />
      <monitor-item
        v-for="(route, idx) in routes"
        :key="idx"
        :url="route"
        :history="history.filter(h => h.route === route)"
        @delete="deleteRoute(route)"
      />
    </main>
    <footer class="fixed w-full bottom-0 bg-gray-900 text-white p-1">
      <span>2019 - Josh Gribbon</span>
      <a
        class="text-blue-200 hover:text-orange-300"
        href="https://github.com/joshgrib/uptime-monitor"
        target="_blank"
      >
        Github
      </a>
    </footer>

    <v-app id="app">
      <!--
      <v-app-bar
        app
        dense
        clipped-left
        color="primary"
        class="wavy-bg"
      >
        <v-toolbar-title>
          <span class="headline font-weight-thin">
            {{ title }}
          </span>
          <span class="subtitle-1 font-weight-bold font-italic">
            {{ subtitle }}
          </span>
        </v-toolbar-title>
      </v-app-bar>

      <v-content>
        <main-dashboard />
      </v-content>

      <v-footer app>
        <span>{{ footer }}</span>
      </v-footer>
      -->
      
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'

import AddUrlForm from './components/AddUrlForm'
import MonitorItem from './components/MonitorItem'

const API_BASE = 'http://localhost:3000'

export default {
  name: 'app',
  components: {
    AddUrlForm,
    MonitorItem
  },
  data () {
    return {
      routes: [],
      history: [],
      urls: [
        'http://www.fast.com',
        'http://github.com',
        'http://google.com',
        'http://netflix.com',
        'http://www.example.com'
      ]
    }
  },
  mounted () {
    this.loadHistory()
  },
  methods: {
    async addUrl (route) {
      await axios.get(`${API_BASE}/routes/add`, {
        params: { route }
      })
      this.loadHistory()
    },
    async loadHistory () {
      this.routes = (await axios.get(`${API_BASE}/routes`)).data
      this.history = (await axios.get(`${API_BASE}/history`)).data
    },
    async deleteRoute (route) {
      await axios.get(`${API_BASE}/routes/remove`, {
        params: { route }
      })
      this.loadHistory()
    }
  }
}
</script>
