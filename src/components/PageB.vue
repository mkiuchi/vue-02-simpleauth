<template>
  <div class="pageb">
    This is page B.
  </div>
</template>

<script>
export default {
  name: 'pageb',
  beforeMount: function () {
    if (this.$route.query.auth !== 'authenticated') {
      this.$router.push({ name: 'Login', query: { next: 'PageB' } })
    }
  }
}
</script>
