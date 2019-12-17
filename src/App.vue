<template>
  <div>
    <h1><code>uptime-monitor</code></h1>
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
  methods: {
    async loadHistory () {
      const response = await axios.get('http://localhost:3000/history')
      this.history = response.data
    }
  }
}
</script>
