<template>
  <div>
    <div v-for='(player, index) in playerStats' class='statsDiv'>
      <p v-for='stat in playerStats[index]' :key='playerStats[index].name'>{{stat}}</p>
    </div>
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
