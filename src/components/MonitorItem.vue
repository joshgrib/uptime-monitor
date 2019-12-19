<template>
  <article class="bg-gray-200 rounded-lg shadow-inner my-2 p-2">
    <header>
      <a
        :href="url"
        target="_blank"
        class="font-mono text-lg hover:text-orange-500"
      >
        {{ url }}
      </a>
      <button
        type="button"
        class="float-right bg-red-500 hover:bg-red-700 text-white font-bold px-2 rounded"
        @click="$emit('delete')"
      >
        Delete
      </button>
    </header>
    <section class="p-2">
      <p class="text-lg">
        <span class="font-bold">
          {{ averageResponseTime }}
        </span>
        -
        <span>
          {{ uptime }} uptime
        </span>
        - {{ history.length }} requests
      </p>
    </section>
  </article>
</template>

<script>
export default {
  name: 'monitor-item',
  props: {
    url: {
      type: String,
      default () { return 'http://www.example.com' }
    },
    history: {
      type: Array,
      default () { return [] }
    }
  },
  computed: {
    successHistory () {
      return this.history.filter(h => h.responseTime !== -1)
    },
    uptime () {
      if (this.history.length === 0) return `0%`
      const uptimeFrac = this.successHistory.length / this.history.length
      return `${(uptimeFrac * 100).toFixed(0)}%`
    },
    averageResponseTime () {
      if (this.successHistory.length === 0) return `No history`
      const samples = this.successHistory.map(h => h.responseTime)
      const totalWaitTime = samples.reduce((acc, curr) => acc + curr, 0)
      return `${(totalWaitTime / samples.length).toFixed(2)}ms`
    }
  }
}
</script>
