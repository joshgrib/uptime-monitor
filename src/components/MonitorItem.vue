<template>
  <article
    class="bg-gray-200 rounded-lg shadow-inner my-2 p-2"
  >
    <header class="text-lg">
      {{ url }}
    </header>
    <p>{{ url }}</p>
  </article>
</template>
<script>
export default {
  name: 'monitor-item',
  props: {
    url: {
      type: String,
      default () { return 'http://www.example.com' }
    }
  }
}
</script>