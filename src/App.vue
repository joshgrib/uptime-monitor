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
  </div>
</template>

<script>

import AddUrlForm from './components/AddUrlForm'
import MonitorItem from './components/MonitorItem'

import axios from 'axios'
const API_BASE = 'http://localhost:3000'

const fetch = async (url, params) => {
  return await axios.get(url, { params })
}

export default {
  name: 'app',
  components: {
    AddUrlForm,
    MonitorItem
  },
  data () {
    return {
      routes: [],
      history: []
    }
  },
  mounted () {
    this.loadHistory()
  },
  methods: {
    fetch: async (url, params) => await axios.get(url, { params }),
    async addUrl (route) {
      await fetch(`${API_BASE}/routes/add`, { route })
      this.loadHistory()
    },
    async loadHistory () {
      this.routes = (await fetch(`${API_BASE}/routes`)).data
      this.history = (await fetch(`${API_BASE}/history`)).data
    },
    async deleteRoute (route) {
      await fetch(`${API_BASE}/routes/remove`, { route })
      this.loadHistory()
    }
  }
}
</script>
