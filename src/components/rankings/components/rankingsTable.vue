<template>
  <div>
    <table>
      <tr class="statHeadersDiv">
        <th v-for="stat in statHeaders" :class="{selected: stat.selected}" class="clickable statHeaders" @click="statSorter()">
          {{ stat.text }}
        </th>
      </tr>
      <tr class="statCellsDiv" v-for="player in displayedStats">
        <td v-for="stat in statHeaders" :class="{selected: stat.selected}">
          {{ player[stat.type] }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    playerStatsSelected: {
      type: Array
    },
    statHeaders: {
      type: Array
    },
    statSorterKey: {
      type: Object
    },
    statSelectorKey: {
      type: String
    }
  },
  methods: {
    statSorter() {
      for (var i = 0; i < this.statHeaders.length; i++) {
        if (event.target.innerText === this.statHeaders[i].text) {
          if (this.statSorterKey.type !== this.statHeaders[i].type) {
            this.statSorterKey.type = this.statHeaders[i].type
            this.statHeaders[i].selected = true
            this.statSorterKey.order = "ascending"
          }
        } else if (event.target.innerText !== this.statHeaders[i].text) {
          this.statHeaders[i].selected = false
        }
      }
      if (this.statSorterKey.order === "descending") {
        this.statSorterKey.order = "ascending"
      } else if (this.statSorterKey.order === "ascending") {
        this.statSorterKey.order = "descending"
      }
    }
  },
  computed: {
    displayedStats() {
      var self = this.selectedStats
      if (this.statSorterKey.type === "name") {
        if (this.statSorterKey.order === "descending") {
          self.sort(
            (a, b) => {
              if (a.name < b.name) {
                return -1
              } else if (a.name > b.name) {
                return 1
              }
            }
          )
        } else if (this.statSorterKey.order === "ascending") {
          self.sort(
            (a, b) => {
              if (a.name < b.name) {
                return 1
              } else if (a.name > b.name) {
                return -1
              }
            }
          )
        }
      } else if (this.statSorterKey.type !== "name") {
        if (this.statSorterKey.order === "descending") {
          self.sort(
            (a, b) => {
              return b[this.statSorterKey.type] - a[this.statSorterKey.type]
            }
          )
        } else if (this.statSorterKey.order === "ascending") {
          self.sort(
            (a, b) => {
              return a[this.statSorterKey.type] - b[this.statSorterKey.type]
            }
          )
        }
      }
      return self
    },
    selectedStats() {
      var self = []
      for (var i = 0; i < this.playerRankings.length; i++) {
        self.push({
          name: this.playerRankings[i].name,
          playerRating: (this.playerRankings[i].playerRating).toFixed(0),
          winPercentage: (this.playerRankings[i].winPercentage).toFixed(1),
          pointsPerGame: (this.playerRankings[i].pointsPerGame).toFixed(2)
        })
      }
      return self
    },
    computedStats() {
      var self = []
      for (var i = 0; i < this.playerStatsSelected.length; i++) {
        self.push({
          name: this.playerStatsSelected[i].name,
          winPercentage: (this.playerStatsSelected[i].wins / this.playerStatsSelected[i].gamesPlayed) * 100,
          pointsPerGame: (
            this.playerStatsSelected[i].beersFinished
            + this.playerStatsSelected[i].firstFinishes
            + this.playerStatsSelected[i].knockOffs
            + this.playerStatsSelected[i].canCatches
            + this.playerStatsSelected[i].ballCatches
          ) / this.playerStatsSelected[i].gamesPlayed
        })
      }
      return self
    },
    playerRankings() {
      var self = []
      for (var i = 0; i < this.playerStatsSelected.length; i++) {
        self.push({
          name: this.playerStatsSelected[i].name,
          playerRating: (
            (
              (this.normalizedStats[i].winPercentage - this.winPercentageNormMin) / (this.winPercentageNormMax - this.winPercentageNormMin)
              + (this.normalizedStats[i].pointsPerGame - this.pointsPerGameNormMin) / (this.pointsPerGameNormMax- this.pointsPerGameNormMin)
            ) * 500
          ),
          winPercentage: this.computedStats[i].winPercentage,
          pointsPerGame: this.computedStats[i].pointsPerGame
        })
      }
      return self
    },
    normalizedStats() {
      var self = []
      for (var i = 0; i < this.playerStatsSelected.length; i++) {
        self.push({
          name: this.playerStatsSelected[i].name,
          winPercentage: 0,
          pointsPerGame: 0
        })
      if (this.playerStatsSelected[i].gamesPlayed > this.gamesPlayedAvg) {
          self[i].pointsPerGame = (
            this.gamesPlayedAvg / this.playerStatsSelected[i].gamesPlayed
            * (
              this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].pointsPerGame
              + (1 - this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
            ) + (1 - this.gamesPlayedAvg / this.playerStatsSelected[i].gamesPlayed) * this.computedStats[i].pointsPerGame
          )
          self[i].winPercentage = (
            this.gamesPlayedAvg / this.playerStatsSelected[i].gamesPlayed
            * (
              this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].winPercentage
              + (1 - this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
            ) + (1 - this.gamesPlayedAvg / this.playerStatsSelected[i].gamesPlayed) * this.computedStats[i].winPercentage
          )
        } else {
          self[i].pointsPerGame = (
            this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].pointsPerGame
            + (1 - this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
          )
          self[i].winPercentage = (
            this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].winPercentage
            + (1 - this.playerStatsSelected[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
          )
        }
      }
      return self
    },
    winPercentageAvg() {
      var self = 0
      for (var i = 0; i < this.computedStats.length; i++) {
        self += this.computedStats[i].winPercentage
      }
      return self / this.computedStats.length
    },
    winPercentageNormMin() {
      var self = 1000
      for (var i in this.normalizedStats) {
        if (self > this.normalizedStats[i].winPercentage) {
          self = this.normalizedStats[i].winPercentage
        }
      }
      return self
    },
    winPercentageNormMax() {
      var self = 0
      for (var i in this.normalizedStats) {
        if (self < this.normalizedStats[i].winPercentage) {
          self = this.normalizedStats[i].winPercentage
        }
      }
      return self
    },
    pointsPerGameAvg() {
      var self = 0
      for (var i = 0; i < this.computedStats.length; i++) {
        self += this.computedStats[i].pointsPerGame
      }
      return self / this.computedStats.length
    },
    pointsPerGameNormMin() {
      var self = 1000
      for (var i in this.normalizedStats) {
        if (self > this.normalizedStats[i].pointsPerGame) {
          self = this.normalizedStats[i].pointsPerGame
        }
      }
      return self
    },
    pointsPerGameNormMax() {
      var self = 0
      for (var i in this.normalizedStats) {
        if (self < this.normalizedStats[i].pointsPerGame) {
          self = this.normalizedStats[i].pointsPerGame
        }
      }
      return self
    },
    gamesPlayedAvg() {
      var self = 0
      for (var i = 0; i < this.playerStatsSelected.length; i++) {
        self += this.playerStatsSelected[i].gamesPlayed
      }
      return self / this.playerStatsSelected.length
    },
    gamesPlayedMax() {
      var self = 0
      for (var i = 0; i < this.playerStatsSelected.length; i++) {
        if (self < this.playerStatsSelected[i].gamesPlayed) {
          self = this.playerStatsSelected[i].gamesPlayed
        }
      }
      return self
    }
  }
}

</script>

<style scoped>
.statHeadersDiv, .statCellsDiv {
  grid-template-columns: repeat(4, 8fr);
}
</style>
