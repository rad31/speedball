<template>
  <div>
    <div class='buttonsDiv'>
      <p class='statTotals buttons clickable'>Stat totals</p>
      <p class='statsPerGame buttons clickable'>Stats per game</p>
    </div>
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
    </div>
    <div>
      <playerStatsRow :playerStats='playerStats'></playerStatsRow>
    </div>
  </div>
</template>

<script>
import { bus } from 'C:/Users/Ronny/speedballprototype/src/main.js'
import playerStatsRow from './components/playerStatsRow.vue'

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
    'playerStatsRow': playerStatsRow
  }
}
</script>

<style scoped>

.buttonsDiv {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  padding: 20px;
  background: #2baac3;
}

.buttons {
  background: #eeeeee;
  font-size: 12px;
  border-radius: 4px;
}

.statTotals {
  grid-column: 2 / 3;
}

.statsPerGame {
  grid-column: 3 / 4;
}

.statHeadersDiv {
  display: grid;
  grid-template-columns: 2fr repeat(8, 1fr);
  padding-top: 5px;
  background: #2baac3;
}

.statHeaders {
  background: #2baac3;
  border-radius: 3px;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #a8979f;
}

</style>
