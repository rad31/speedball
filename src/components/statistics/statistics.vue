<template>
  <div class='statHeadersDiv'>
    <p class='statHeaders clickable'>Player</p>
    <p class='statHeaders clickable'>GP</p>
    <p class='statHeaders clickable'>W</p>
    <p class='statHeaders clickable'>L</p>
    <p class='statHeaders clickable'>BF</p>
    <p class='statHeaders clickable'>KO</p>
    <p class='statHeaders clickable'>FF</p>
    <p class='statHeaders clickable'>BC</p>
    <p class='statHeaders clickable'>CC</p>
    <p class='statHeaders clickable'>PG</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
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

.statHeadersDiv {
  display: grid;
  grid-template-columns: 3fr repeat(9, 1fr);
}

.statHeaders {
  background: #ffffcc;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #eeeebb;
}

</style>
