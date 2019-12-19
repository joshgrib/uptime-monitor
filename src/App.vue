<template>
  <div>
    <header class="bg-orange-500 p-2 shadow">
      <h1>
        <code class="text-xl p-4">uptime-monitor</code>
        <span>collect uptime info from URLs</span>
      </h1>
    </header>
    <main class="p-4 mx-auto">
      <add-url-form @submit="addUrl" />
      <monitor-item
        v-for="(url, idx) in urls"
        :key="idx"
        :url="url"
      />
    </main>
    <footer class="bg-gray-900 text-white p-1">
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
      <main-dashboard />
      
    </v-app>
  </div>
</template>

<script>
import MainDashboard from './components/MainDashboard'
import AddUrlForm from './components/AddUrlForm'
import MonitorItem from './components/MonitorItem'

export default {
  name: 'app',
  components: {
    AddUrlForm,
    MonitorItem,
    MainDashboard
  },
  data () {
    return {
      urls: [
        'http://www.fast.com',
        'http://github.com',
        'http://google.com',
        'http://netflix.com',
        'http://www.example.com'
      ]
    }
  },
  methods: {
    addUrl (newUrl) {
      this.urls.push(newUrl)
    }
  }
}
</script>
