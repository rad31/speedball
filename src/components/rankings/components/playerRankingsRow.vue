<template>
  <div>
    <div v-for='(player, index) in computedStats' class='statsDiv'>
      <p v-for='stat in computedStats[index]'>{{stat}}</p>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    computedStats: {
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
  grid-template-columns: repeat(4, 1fr);
}

</style>
