<template>
  <div>
    <div class='statHeadersDiv'>
      <p>Player</p>
      <p>Player Rating</p>
      <p>Win Percentage</p>
      <p>Points Per Game</p>
    </div>
    <playerRankingsRow :computedStats='computedStats'></playerRankingsRow>
  </div>
</template>

<script>
import { bus } from 'C:/Users/Ronny/speedballprototype/src/main.js'
import playerRankingsRow from './components/playerRankingsRow.vue'

export default {
  props: {
    playerStats: {
      type: Array
    },
    computedStats: {
      type: Array
    },
    normalizedStats: {
      type: Array
    }

  },
  components: {
    'playerRankingsRow': playerRankingsRow
  },
}
</script>

<style scoped>

.statHeadersDiv {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-top: 5px;
  background: #89c32b;
}

</style>
