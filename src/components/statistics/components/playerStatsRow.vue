<template>
  <div class='statsDiv'>
      <p v-if='playerStats.length >= 1' v-for='stat in playerStats[0]'>{{stat}}</p>
      <p v-if='playerStats.length >= 2' v-for='stat in playerStats[1]'>{{stat}}</p>
      <p v-if='playerStats.length >= 3' v-for='stat in playerStats[2]'>{{stat}}</p>
      <p v-if='playerStats.length >= 4' v-for='stat in playerStats[3]'>{{stat}}</p>
      <p v-if='playerStats.length >= 5' v-for='stat in playerStats[4]'>{{stat}}</p>
      <p v-if='playerStats.length >= 6' v-for='stat in playerStats[5]'>{{stat}}</p>
      <p v-if='playerStats.length >= 7' v-for='stat in playerStats[6]'>{{stat}}</p>
      <p v-if='playerStats.length >= 8' v-for='stat in playerStats[7]'>{{stat}}</p>
      <p v-if='playerStats.length >= 9' v-for='stat in playerStats[8]'>{{stat}}</p>
      <p v-if='playerStats.length >= 10' v-for='stat in playerStats[9]'>{{stat}}</p>
      <p v-if='playerStats.length >= 11' v-for='stat in playerStats[10]'>{{stat}}</p>
      <p v-if='playerStats.length >= 12' v-for='stat in playerStats[11]'>{{stat}}</p>
      <p v-if='playerStats.length >= 13' v-for='stat in playerStats[12]'>{{stat}}</p>
  </div>
</template>

<script>

export default {
  props: {
    playerStats: {
      type: Array
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

.statsDiv {
  display: grid;
  grid-template-columns: 2fr repeat(8, 1fr);
}

</style>
