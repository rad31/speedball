<template>
  <div v-on:increasePlayersClicked='increasePlayers($event)'>
    <div class='buttonsDiv'>
      <p @click='increasePlayers' class='increasePlayers buttons clickable'>Increase players</p>
      <p @click='decreasePlayers' class='decreasePlayers buttons clickable'>Decrease players</p>
      <p class='submitStats buttons clickable'>Submit stats</p>
    </div>
    <p class='result'>Winning Team</p>
    <inputStatHeaders></inputStatHeaders>
    <winnersInputRow v-if='numberOfPlayers >= 1'></winnersInputRow>
    <winnersInputRow v-if='numberOfPlayers >= 2'></winnersInputRow>
    <winnersInputRow v-if='numberOfPlayers >= 3'></winnersInputRow>
    <winnersInputRow v-if='numberOfPlayers >= 4'></winnersInputRow>
    <winnersInputRow v-if='numberOfPlayers >= 5'></winnersInputRow>
    <winnersInputRow v-if='numberOfPlayers >= 6'></winnersInputRow>
    <p class='result'>Losing Team</p>
    <inputStatHeaders></inputStatHeaders>
    <losersInputRow v-if='numberOfPlayers >= 1'></losersInputRow>
    <losersInputRow v-if='numberOfPlayers >= 2'></losersInputRow>
    <losersInputRow v-if='numberOfPlayers >= 3'></losersInputRow>
    <losersInputRow v-if='numberOfPlayers >= 4'></losersInputRow>
    <losersInputRow v-if='numberOfPlayers >= 5'></losersInputRow>
    <losersInputRow v-if='numberOfPlayers >= 6'></losersInputRow>
  </div>
</template>

<script>
import winnersInputRow from './components/winnersInputRow.vue'
import losersInputRow from './components/losersInputRow.vue'
import inputStatHeaders from './components/inputStatHeaders.vue'

export default {

  components: {
    'winnersInputRow': winnersInputRow,
    'losersInputRow': losersInputRow,
    'inputStatHeaders': inputStatHeaders,

  },
  data() {
    return {
      numberOfPlayers: 1
    }
  },
  methods: {
    increasePlayers () {
      if (this.numberOfPlayers <= 5) {
        this.numberOfPlayers += 1
      }
    },
    decreasePlayers () {
      if (this.numberOfPlayers >= 1) {
        this.numberOfPlayers -= 1
      }
    }
  }
}
</script>

<style scoped>

.result {
  font-size: 0.75em;
  background: #192231;
  text-align: left;
}

.buttonsDiv {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 5px;
  padding: 5px;
  background: #985e6d;
}

.buttons {
  background: #192231;
  font-size: 12px;
  border-radius: 4px
}

.increasePlayers {
  grid-column: 1 / 2
}

.decreasePlayers {
  grid-column: 2 / 3
}

.submitStats {
  grid-column: 7 / 8;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  font-weight: bold;
}

</style>
