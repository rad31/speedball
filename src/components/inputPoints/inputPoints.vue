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
import { bus } from 'C:/Users/Ronny/speedballprototype/src/main.js'
import winnersInputRow from './components/winnersInputRow.vue'
import losersInputRow from './components/losersInputRow.vue'
import inputStatHeaders from './components/inputStatHeaders.vue'

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
    'winnersInputRow': winnersInputRow,
    'losersInputRow': losersInputRow,
    'inputStatHeaders': inputStatHeaders,
  },
  data() {
    return {
      numberOfPlayers: [0],
      matchedNames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    submitStats() {
      for (var i = 0; i < this.numberOfPlayers.length * 2; i++) {
        if (this.matchedNames[i] == 0) {
          this.playerStats.push({
            name: this.capitalizeFirstLetter(this.$refs.p[i].inputStats.name),
            gamesPlayed: this.$refs.p[i].inputStats.gamesPlayed,
            wins: this.$refs.p[i].inputStats.wins,
            losses: this.$refs.p[i].inputStats.losses,
            beersFinished: this.$refs.p[i].inputStats.beersFinished,
            knockOffs: this.$refs.p[i].inputStats.knockOffs,
            firstFinishes: this.$refs.p[i].inputStats.firstFinishes,
            canCatches: this.$refs.p[i].inputStats.canCatches,
            ballCatches: this.$refs.p[i].inputStats.ballCatches
          })
          this.computedStats.push({
            name: this.capitalizeFirstLetter(this.$refs.p[i].inputStats.name),
            playerRating: 0,
            winPercentage: 0,
            pointsPerGame: 0,
          })
          this.normalizedStats.push({
          winPercentage: 0,
          pointsPerGame: 0
          })
        }
      }
      this.numberOfPlayers = [0]
      for (var i = 0; i < this.numberOfPlayers.length * 2; i++){
        this.$refs.p[i].inputStats.name = '',
        this.$refs.p[i].inputStats.beersFinished = 0,
        this.$refs.p[i].inputStats.knockOffs = 0,
        this.$refs.p[i].inputStats.firstFinishes = 0,
        this.$refs.p[i].inputStats.canCatches = 0,
        this.$refs.p[i].inputStats.ballCatches = 0

      }
      for (var i = 0; i > this.matchedNames.length; i++) {
        this.matchedNames[i] = 0
      }
      return this.updateComputedStats()
    },
    submitConditionsFirstFinishes() {
      var firstFinishers = 0
      for (var i = 0; i < this.numberOfPlayers.length * 2; i++) {
        firstFinishers += this.$refs.p[i].inputStats.firstFinishes
      }
      if (firstFinishers > 1) {
      alert('Only one player could have finished first...')
      } else {
        return this.submitConditionsNameMatched()
      }
    },
    submitConditionsNameMatched() {
      for (var i = 0; i < this.playerStats.length; i++) {
        for (var j = 0; j < this.numberOfPlayers.length * 2; j++) {
          if (this.playerStats[i].name == this.capitalizeFirstLetter(this.$refs.p[j].inputStats.name)) {
            this.playerStats[i].gamesPlayed += this.$refs.p[j].inputStats.gamesPlayed
            this.playerStats[i].wins += this.$refs.p[j].inputStats.wins
            this.playerStats[i].losses += this.$refs.p[j].inputStats.losses
            this.playerStats[i].beersFinished += this.$refs.p[j].inputStats.beersFinished
            this.playerStats[i].knockOffs += this.$refs.p[j].inputStats.knockOffs
            this.playerStats[i].firstFinishes += this.$refs.p[j].inputStats.firstFinishes
            this.playerStats[i].canCatches += this.$refs.p[j].inputStats.canCatches
            this.playerStats[i].ballCatches += this.$refs.p[j].inputStats.ballCatches
            this.matchedNames[j] = 1
          }
        }
      }
      return this.submitStats()
    },
    updateComputedStats() {
      for (var i = 0; i < this.computedStats.length; i++) {
        this.computedStats[i].winPercentage = (
          (
            this.playerStats[i].wins / this.playerStats[i].gamesPlayed
          ) * 100
        ).toFixed(1)
        this.computedStats[i].pointsPerGame = (
          (
            this.playerStats[i].beersFinished
            + this.playerStats[i].knockOffs
            + this.playerStats[i].firstFinishes
            + this.playerStats[i].canCatches
            + this.playerStats[i].ballCatches
          ) / this.playerStats[i].gamesPlayed
        ).toFixed(2)
      }
      return this.updateNormalizedStats()
    },
    updateNormalizedStats() {
      for (var i = 0; i < this.playerStats.length; i++) {
        if (this.playerStats[i].gamesPlayed > this.averageGamesPlayed) {
          this.normalizedStats[i].pointsPerGame = (
            this.averageGamesPlayed / this.playerStats[i].gamesPlayed *
            (
              this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].pointsPerGame
              + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
            )
              + (1 - this.averageGamesPlayed / this.playerStats[i].gamesPlayed) * this.computedStats[i].pointsPerGame
          )
        } else {
          this.normalizedStats[i].pointsPerGame = (
            this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].pointsPerGame
            + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
          )
        }
        if (this.playerStats[i].gamesPlayed > this.averageGamesPlayed) {
          this.normalizedStats[i].winPercentage = (
            this.averageGamesPlayed / this.playerStats[i].gamesPlayed
            * (
                this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].winPercentage
                + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
              )
              + (1 - this.averageGamesPlayed / this.playerStats[i].gamesPlayed) * this.computedStats[i].winPercentage
          )
        } else {
          this.normalizedStats[i].winPercentage = (
            this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].winPercentage
            + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
          )
        }
      }
      return this.updatePlayerRating()
    },
    updatePlayerRating() {
      for (var i = 0; i < this.computedStats.length; i++) {
        this.computedStats[i].playerRating = (
          (
            this.normalizedStats[i].winPercentage / this.maxNormalizedWinPercentage
            + this.normalizedStats[i].pointsPerGame / this.maxNormalizedPointsPerGame
          ) * 500
        ).toFixed(0)
      }
    }
  },
  computed: {
    averageGamesPlayed() {
      var totalValue = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        totalValue += this.playerStats[i].gamesPlayed
      }
      return totalValue / this.playerStats.length
    },
    maxGamesPlayed() {
      var maxValue = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        if (maxValue < this.playerStats[i].gamesPlayed) {
          maxValue = this.playerStats[i].gamesPlayed
        }
      }
      return maxValue
    },
    maxNormalizedWinPercentage() {
      var maxValue = 0
      for (var i = 0; i < this.normalizedStats.length; i++) {
        if (maxValue < this.normalizedStats[i].winPercentage) {
          maxValue = this.normalizedStats[i].winPercentage
        }
      }
      return maxValue
    },
    maxNormalizedPointsPerGame() {
      var maxValue = 0
      for (var i = 0; i < this.normalizedStats.length; i++) {
        if (maxValue < this.normalizedStats[i].pointsPerGame) {
          maxValue = this.normalizedStats[i].pointsPerGame
        }
      }
      return maxValue
    },
    averageWinPercentage() {
      var totalValue = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        totalValue += this.playerStats[i].gamesPlayed
      }
      return totalValue / this.playerStats.length
    },
    averagePointsPerGame() {
      var totalValue = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        totalValue += this.playerStats[i].gamesPlayed
      }
      return totalValue / this.playerStats.length
    }
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
