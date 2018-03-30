<template>
  <div>
    <table>
      <tr class="statHeadersDiv">
        <th
          v-for="stat in statHeaders"
          :class="{selected: stat.selected}"
          class="clickable statHeaders"
          @click="statSorter(); checkRowSelected()"
        >
          {{ stat.text }}
        </th>
      </tr>
      <div v-for="player in displayedRankings">
        <tr
          class="statCellsDiv clickable"
          @click="selectRow(); updateCharts();"
          ref="rRow"
        >
          <td
            v-for="stat in statHeaders"
            :class="{selected: stat.selected}"
          >
            {{ player[stat.type] }}
          </td>
        </tr>
        <div
          v-if="rowSelected.name === player.name"
          class="chartsDiv"
          @click="test"
        >
          <PlayerRatingChart
            class="playerRatingChart"
            :playerRatingChartData="playerRatingChartData"
            :playerRatingChartLabels="playerRatingChartLabels"
            :computedChartData="computedChartData"
            ref="PRChart"
          >
          </PlayerRatingChart>
        </div>
      </div>
    </table>
  </div>
</template>

<script>
import PlayerRatingChart from "./PlayerRatingChart.js"

export default {
  props: [
    "filters",
    "pageDisplayed",
    "playerStats",
    "playerRankings",
    "rankingsSnapshots",
    "statHeaders",
    "statSorterKey",
    "rowSelected",
    "checkRowSelected"
  ],
  components: {
    "PlayerRatingChart": PlayerRatingChart
  },
  data() {
    return {
      playerRatingChartData: null,
      playerRatingChartLabels: null,
      computedChartData: {
        playerRating: null,
        winPercentage: null,
        pointsPerGame: null,
        labels: null,
      }
    }
  },
  methods: {
    test() {
    },
    statSorter() {
      for (let i = 0; i < this.statHeaders.length; i++) {
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
    },
    selectRow() {
      for (let i = 0; i < this.playerRankings.length; i++) {
        this.$refs.rRow[i].classList.remove("rowSelected")
      }
      if (this.rowSelected.name !== event.target.parentNode.childNodes[0].innerText) {
        this.rowSelected.name = event.target.parentNode.childNodes[0].innerText
        event.target.parentNode.classList.add("rowSelected")
      } else {
        this.rowSelected.name = ""
      }
    },
    updateCharts() {
      this.computedChartData.playerRating = this.computedChartStats.playerRating
      this.computedChartData.winPercentage = this.computedChartStats.winPercentage
      this.computedChartData.pointsPerGame = this.computedChartStats.pointsPerGame
      this.computedChartData.labels = this.computedChartStats.labels
      let playerSelected = {...this.rowSelected}
      this.rowSelected.name = ""
      this.$nextTick(function() {
        this.rowSelected.name = playerSelected.name
        return this.checkRowSelected()
      })
    }
  },
  computed: {
    displayedRankings() {
      let self = this.selectedRankings
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
    selectedRankings() {
      let self = []
      for (let i = 0; i < this.playerRankings.length; i++) {
        self.push({...this.playerRankings[i]})
        self[i].playerRating = self[i].playerRating.toFixed(0),
        self[i].winPercentage = self[i].winPercentage.toFixed(1),
        self[i].pointsPerGame = self[i].pointsPerGame.toFixed(2)

      }
      return self
    },
    computedChartStats() {
      let self = {
        labels: [0],
        playerRating: [0],
        winPercentage: [0],
        pointsPerGame: [0],
      }
      let matchCount = 1
      for (let i = 0; i < this.rankingsSnapshots.length; i++) {
        if (this.rowSelected.name === this.rankingsSnapshots[i].name) {
          for (let j = 0; j < this.rankingsSnapshots[i].winPercentage.length; j++) {
            if (j === 0) {
              self.playerRating.push(this.rankingsSnapshots[i].playerRating[j])
              self.winPercentage.push(this.rankingsSnapshots[i].winPercentage[j])
              self.pointsPerGame.push(this.rankingsSnapshots[i].pointsPerGame[j])
              self.labels.push(matchCount)
              matchCount++
            } else if (j !== 0) {
              if (this.rankingsSnapshots[i].gamesPlayed[j] !== this.rankingsSnapshots[i].gamesPlayed[j - 1]) {
                self.playerRating.push(this.rankingsSnapshots[i].playerRating[j])
                self.winPercentage.push(this.rankingsSnapshots[i].winPercentage[j])
                self.pointsPerGame.push(this.rankingsSnapshots[i].pointsPerGame[j])
                self.labels.push(matchCount)
                matchCount++
              }
            }
          }
        }
      }
      if (this.filters[1].selected === true && self.labels.length > 6) {
        for (let i = 0; i < self.labels.length; i++) {
          if (self.labels.length > 6) {
            self.playerRating.shift()
            self.winPercentage.shift()
            self.pointsPerGame.shift()
            self.labels.shift()
          } else if (self.labels.length === 6) {
            break
          }
        }
      }
      return self
    }
  },
  watch: {
    playerStats: function() {
      return this.updateCharts()
    }
  }
}

</script>

<style scoped>
.statHeadersDiv, .statCellsDiv {
  grid-template-columns: repeat(4, 8fr);
}
.statCellsDiv:hover {
  background: #efefef;
}
.rowSelected {
  background: #efefef;
}
.chartsDiv {
  display: grid;
  grid-template-columns: 4fr 8fr 4fr;
  background: #f7f7f7;
}
.playerRatingChart {
  display: grid;
  grid-column: 2 / 3;
  margin: auto;
  background: #f7f7f7;
  padding: 30px 0px 30px 100px;
  height: 200px;
  width: 500px;
}
</style>
