<template>
  <form class="leading-tight mb-3 rounded-full shadow-lg">
    <input
      v-model="newUrlText"
      type="text"
      placeholder="http://www.my-url.to/ping"
      class="p-3 w-4/5 bg-gray-100 text-gray-700 rounded-l-full"
    >
    <button
      type="button"
      class="p-3 w-1/5 text-white font-bold bg-blue-500 hover:bg-blue-700 rounded-r-full"
      @click="submit"
    >
      Add (<kbd>Enter</kbd>)
    </button>
  </form>
</template>
<script>
export default {
  name: 'add-url-form',
  data () {
    return {
      newUrlText: undefined
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.newUrlText)
      this.newUrlText = undefined
    }
  }
}
</script>
