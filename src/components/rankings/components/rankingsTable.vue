<template>
  <div>
    <table>
      <tr class="statHeadersDiv">
        <th
          v-for="stat in statHeaders"
          :class="{selected: statSorterKey.type === stat.type}"
          class="clickable statHeaders"
          @click="statSorter(); updateCharts(); updatePlayerSelected()"
        >
          {{ stat.text }}
        </th>
      </tr>
      <div v-for="player in displayedRankings">
        <tr
          class="statCellsDiv clickable"
          @click="selectRow(); updateCharts(); updatePlayerSelected();"
          ref="row"
        >
          <td
            v-for="stat in statHeaders"
            :class="{selected: statSorterKey.type === stat.type}"
          >
            {{ player[stat.type] }}
          </td>
        </tr>
        <div
          v-if="playerSelected === player.name"
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
    "playerRankings",
    "statHeaders",
    "statSorterKey",
    "playerSelected",
    "filterSelected",
    "pageSelected",
    "updatePlayerSelected",
    "rankingsSnapshots"
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
            this.$emit("changeStatSorterKeyType", this.statHeaders[i].type)
            this.$emit("changeStatSorterKeyOrder", "ascending")
          }
        }
      }
      if (this.statSorterKey.order === "descending") {
        this.$emit("changeStatSorterKeyOrder", "ascending")
      } else if (this.statSorterKey.order === "ascending") {
        this.$emit("changeStatSorterKeyOrder", "descending")
      }
    },
    selectRow() {
      for (let i = 0; i < this.playerRankings.length; i++) {
        this.$refs.row[i].classList.remove("playerSelected")
      }
      if (this.playerSelected !== event.target.parentNode.childNodes[0].innerText) {
        this.$emit("changePlayerSelected", event.target.parentNode.childNodes[0].innerText)
        event.target.parentNode.classList.add("playerSelected")
      } else {
        this.$emit("changePlayerSelected", "")
      }
    },
    updateCharts() {
      if (this.playerSelected !== "" && this.rankingsSnapshots[this.filterSelected] !== undefined) {
        this.computedChartData.playerRating = this.rankingsSnapshots[this.filterSelected][this.playerSelected].playerRating
        this.computedChartData.winPercentage = this.rankingsSnapshots[this.filterSelected][this.playerSelected].winPercentage
        this.computedChartData.pointsPerGame = this.rankingsSnapshots[this.filterSelected][this.playerSelected].pointsPerGame
        this.computedChartData.labels = this.rankingsSnapshots[this.filterSelected][this.playerSelected].gamesPlayed
      }
      this.statSorter()
      this.$nextTick(function() {
        this.statSorter()
        this.updatePlayerSelected()
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
        self[i].weightedWinPercentage = self[i].weightedWinPercentage.toFixed(1),
        self[i].pointsPerGame = self[i].pointsPerGame.toFixed(2)

      }
      return self
    }
  },
  watch: {
    filterSelected: function() {
      return this.updateCharts()
    },
    pageSelected: function() {
      return this.$nextTick(function() {
        return this.updateCharts()
      })
    },
    playerSelected: function() {
      return this.updateCharts()
    }
  }
}

</script>

<style scoped>
.statHeadersDiv, .statCellsDiv {
  grid-template-columns: repeat(5, 8fr);
}
.statCellsDiv:hover {
  background: #efefef;
}
.playerSelected {
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
