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
  </v-app>
</template>

<script>
import MainDashboard from './components/MainDashboard'

export default {
  name: 'app',
  components: { MainDashboard },
  data () {
    return {
      title: 'uptime-monitor',
      subtitle: 'collect uptime info from different URLs',
      footer: '© 2019 - Josh Gribbon'
    }
  }
}
</script>
