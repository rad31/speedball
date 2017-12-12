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

.statHeadersDiv {
  display: grid;
  grid-template-columns: 3fr repeat(9, 1fr);
  padding-top: 5px;
  background: #98878f;
}

.statHeaders {
  background: #98878f;
  border-radius: 3px;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #a8979f;
}

</style>
