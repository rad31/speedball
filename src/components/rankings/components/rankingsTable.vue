<template>
  <div>
    <table>
      <tr class="statHeadersDiv">
        <th v-for="stat in statHeaders" :class="{selected: stat.selected}" class="clickable statHeaders" @click="statSorter()">
          {{ stat.text }}
        </th>
      </tr>
      <tr class="statCellsDiv" v-for="player in displayedStats">
        <td :class="{selected: statHeaders[0].selected}"> {{player.name}} </td>
        <td :class="{selected: statHeaders[1].selected}"> {{player.playerRating}} </td>
        <td :class="{selected: statHeaders[2].selected}"> {{player.winPercentage}} </td>
        <td :class="{selected: statHeaders[3].selected}"> {{player.pointsPerGame}} </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    playerStats: {
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
      for (var i in this.statHeaders) {
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
      if (this.statSelectorKey === "overallRankings") {
        for (var i in this.playerStats) {
          self.push({

          })
        }
      } else if (this.statSelectorKey === "lastFiveGames") {
        for (var i in this.playerStats) {
          self.push({

          })
        }
      }
    } else if (this.statSelectorKey === "oneVsOne") {
      for (var i in this.playerStats) {
        self.push({

        })
      }
    }
      return self
    },

















    ,
    computed: {
      computedStats() {
        var self = []
        for (var i in this.playerStats) {
          self.push({
            name: this.playerStats[i].name,
            winPercentage: (this.playerStats[i].wins / this.playerStats[i].gamesPlayed) * 100,
            pointsPerGame: (
              this.playerStats[i].beersFinished
              + this.playerStats[i].firstFinishes
              + this.playerStats[i].knockOffs
              + this.playerStats[i].canCatches
              + this.playerStats[i].ballCatches
            ) / this.playerStats[i].gamesPlayed
          })
        }
        return self
      },
      playerRankings() {
        var self = []
        for (var i in this.playerStats) {
          self.push({
            name: this.playerStats[i].name,
            playerRating: (
              (
                (this.normalizedStats[i].winPercentage - this.winPercentageNormMin) / (this.winPercentageNormMax - this.winPercentageNormMin)
                + (this.normalizedStats[i].pointsPerGame - this.pointsPerGameNormMin) / (this.pointsPerGameNormMax- this.pointsPerGameNormMin)
              ) * 500
            ).toFixed(0),
            winPercentage: this.computedStats[i].winPercentage.toFixed(1),
            pointsPerGame: this.computedStats[i].pointsPerGame.toFixed(2)
          })
        }
        return self
      },
      normalizedStats() {
        var self = []
        for (var i in this.playerStats) {
          self.push({
            name: this.playerStats[i].name,
            winPercentage: 0,
            pointsPerGame: 0
          })
        if (this.playerStats[i].gamesPlayed > this.gamesPlayedAvg) {
            self[i].pointsPerGame = (
              this.gamesPlayedAvg / this.playerStats[i].gamesPlayed
              * (
                this.playerStats[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].pointsPerGame
                + (1 - this.playerStats[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
              ) + (1 - this.gamesPlayedAvg / this.playerStats[i].gamesPlayed) * this.computedStats[i].pointsPerGame
            )
            self[i].winPercentage = (
              this.gamesPlayedAvg / this.playerStats[i].gamesPlayed
              * (
                this.playerStats[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].winPercentage
                + (1 - this.playerStats[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
              ) + (1 - this.gamesPlayedAvg / this.playerStats[i].gamesPlayed) * this.computedStats[i].winPercentage
            )
          } else {
            self[i].pointsPerGame = (
              this.playerStats[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].pointsPerGame
              + (1 - this.playerStats[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
            )
            self[i].winPercentage = (
              this.playerStats[i].gamesPlayed / this.gamesPlayedMax * this.computedStats[i].winPercentage
              + (1 - this.playerStats[i].gamesPlayed / this.gamesPlayedMax) * this.pointsPerGameAvg
            )
          }
        }
        return self
      },
      winPercentageAvg() {
        var self = 0
        for (var i in this.playerStats) {
          self += this.computedStats[i].winPercentage
        }
        return self / this.playerStats.length
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
        for (var i in this.playerStats) {
          self += this.computedStats[i].pointsPerGame
        }
        return self / this.playerStats.length
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
        for (var i in this.playerStats) {
          self += this.playerStats[i].gamesPlayed
        }
        return self / this.playerStats.length
      },
      gamesPlayedMax() {
        var self = 0
        for (var i in this.playerStats) {
          if (self < this.playerStats[i].gamesPlayed) {
            self = this.playerStats[i].gamesPlayed
          }
        }
        return self
      }
  }
}
</script>

<style scoped>
.statHeadersDiv, .statCellsDiv {
  grid-template-columns: repeat(4, 1fr);
}
.statCellsDiv:hover {
  background: #eaeaea;
}
.statHeaders:hover {
  background: #c0c0c0;
  border-radius: 2px;
}
</style>
