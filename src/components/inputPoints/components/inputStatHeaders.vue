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

p, input {
  align-content: center;
  font-size: 10px;
  font-weight: lighter;
  font-family: Georgia, sans-serif;
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  margin: 0;
  padding: 8px;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  border-width: 0;
  min-width: 40px;
}

body {
background: #333333;
max-width: 960px;
align-content: center;
margin: auto;
}

.statsDiv {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
}

.statHeaders {
  background: #ffffcc;
}

</style>
