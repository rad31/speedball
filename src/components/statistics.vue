<template>
  <div>
    <span class='playerName'>Player</span>
    <span class='statNames'>GP</span>
    <span class='statNames'>W</span>
    <span class='statNames'>L</span>
    <span class='statNames'>BF</span>
    <span class='statNames'>KO</span>
    <span class='statNames'>FF</span>
    <span class='statNames'>BC</span>
    <span class='statNames'>CC</span>
    <span class='statNames'>PG</span>
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

h1 {
  text-align: center;
}
.playerName {
  display: block;
  color: #999;
  margin: 10px, 0;
  text-align: center;
  float: left;
  background: #eee;
  width: 18%;
  margin: .5%;
  height: 20px;
  float: left;
}

.statNames {
  display: block;
  color: #999;
  margin: 10px, 0;
  text-align: center;
  float: left;
  background: #eee;
  width: 8%;
  margin: .5%;
  height: 20px;
  float: left;
}

</style>
