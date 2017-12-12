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

.result {
  font-size: 0.75em;
  background: #cc5577;
  text-align: left;
}

.buttonsDiv {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 5px;
  padding: 5px;
  background: #ffffcc;
}

.buttons {
  background: #cc5577;
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
  background: #bb4466;
}

</style>
