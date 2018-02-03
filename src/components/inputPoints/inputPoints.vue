<template>
  <div>
    <div class='buttonsDiv'>
      <p @click='increasePlayers' class='increasePlayers buttons clickable'>Increase players</p>
      <p @click='decreasePlayers' class='decreasePlayers buttons clickable'>Decrease players</p>
      <p @click='submitConditionsFirstFinishes' class='submitStats buttons clickable'>Submit stats</p>
    </div>
    <p class='result'>Winning Team</p>
    <inputStatHeaders></inputStatHeaders>
    <div v-for='players in numberOfPlayers'>
      <winnersInputRow ref='p'></winnersInputRow>
    </div>
    <p class='result'>Losing Team</p>
    <inputStatHeaders></inputStatHeaders>
    <div v-for='players in numberOfPlayers'>
      <losersInputRow ref='p'></losersInputRow>
    </div>
  </div>
</template>

<script>
import winnersInputRow from './components/winnersInputRow.vue'
import losersInputRow from './components/losersInputRow.vue'
import inputStatHeaders from './components/inputStatHeaders.vue'
import { firebaseMatchData } from 'C:/Users/Ronny/speedballprototype/src/firebase.js'
import { firebaseMatchCount } from 'C:/Users/Ronny/speedballprototype/src/firebase.js'

export default {
  props: {
    matchCount: {
      type: Array
    },
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
    'winnersInputRow': winnersInputRow,
    'losersInputRow': losersInputRow,
    'inputStatHeaders': inputStatHeaders,
  },
  data() {
    return {
      numberOfPlayers: [0],
      matchedNames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      var lower = string.toLowerCase()
      var firstLetter = lower.slice(0,1)
      return lower.replace(firstLetter, firstLetter.toUpperCase())
    },
    increasePlayers() {
      if (this.numberOfPlayers.length <= 5) {
        this.numberOfPlayers.push(0)
      }
    },
    decreasePlayers() {
      if (this.numberOfPlayers.length >= 2) {
        this.numberOfPlayers.pop()
      }
    },
    submitConditionsFirstFinishes() {
      var firstFinishers = 0
      for (var i = 0; i < this.numberOfPlayers.length * 2; i++) {
        firstFinishers += this.$refs.p[i].inputStats.firstFinishes
      }
      if (firstFinishers > 1) {
        alert('Only one player could have finished first.')
      } else if (firstFinishers == 0) {
        alert('First finisher was not recorded.')
      } else {
        return this.submitConditionsNameBlank()
      }
    },
    submitConditionsNameBlank() {
      var nameBlank = 0
      for (var i = 0; i < this.numberOfPlayers.length * 2; i++) {
        if (this.$refs.p[i].inputStats.name == "") {
          nameBlank += 1
        }
      }
      if (nameBlank > 0) {
        alert("Please enter all players' names.")
      } else {
        return this.submitStats()
      }
    },
    submitStats() {
      for (var i = 0; i < this.numberOfPlayers.length * 2; i++) {
        firebaseMatchData.push({
          name: this.capitalizeFirstLetter(this.$refs.p[i].inputStats.name),
          gamesPlayed: this.$refs.p[i].inputStats.gamesPlayed,
          wins: this.$refs.p[i].inputStats.wins,
          losses: this.$refs.p[i].inputStats.losses,
          beersFinished: this.$refs.p[i].inputStats.beersFinished,
          knockOffs: this.$refs.p[i].inputStats.knockOffs,
          firstFinishes: this.$refs.p[i].inputStats.firstFinishes,
          canCatches: this.$refs.p[i].inputStats.canCatches,
          ballCatches: this.$refs.p[i].inputStats.ballCatches,
          playersPerTeam: this.numberOfPlayers.length,
          matchNumber: this.matchCount.length + 1
        })
      }
      firebaseMatchCount.push(this.matchCount.length + 1)
      this.numberOfPlayers = []
    },
  }
}

</script>

<style scoped>

.result {
  font-size: 0.75em;
  background: #d3513b;
  text-align: left;
}

.buttonsDiv {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 20px;
  padding: 20px;
  background: #c3412b;
}

.buttons {
  background: #eeeeee;
  font-size: 12px;
  border-radius: 4px;
}

.increasePlayers {
  grid-column: 2 / 3;
}

.decreasePlayers {
  grid-column: 3 / 4;
}

.submitStats {
  grid-column: 4 / 5;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  font-weight: bold;
}

</style>
