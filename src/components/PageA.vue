<template>
  <div class="pagea">
    This is page A.
  </div>
</template>

<script>
export default {
  name: 'pagea',
  beforeMount: function () {
    if (this.$route.query.auth !== 'authenticated') {
      this.$router.push({ name: 'Login', query: { next: 'PageA' } })
    }
  }
}
</script>
