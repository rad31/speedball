<template>
  <div class='statsDiv'>
    <p class='statHeaders'>Player</p>
    <p class='statHeaders'>BF</p>
    <p class='statHeaders'>KO</p>
    <p class='statHeaders'>FF</p>
    <p class='statHeaders'>CC</p>
    <p class='statHeaders'>BC</p>
  </div>
</template>

<script>

export default {

  data() {
    return {

    }
  },
  methods: {

  }
}

</script>

<style scoped>

.statsDiv {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
}

.statHeaders {
  background: #985e6d;
}

</style>
