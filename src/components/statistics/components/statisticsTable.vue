<template>
  <div>
    <table>
      <tr class="statHeadersDiv">
        <th
          v-for="stat in statHeaders"
          :class="{selected: stat.type === statSorterKey.type}"
          class="clickable statHeaders"
          @click="statSorter(); updateCharts(); updatePlayerSelected();"
        >
          {{ stat.text }}
        </th>
      </tr>
      <div v-for="player in displayedStats">
        <tr
          class="statCellsDiv clickable"
          @click="selectRow(); updateCharts(); updatePlayerSelected();"
          ref="row"
        >
          <td
            v-for="stat in statHeaders"
            :class="{selected: stat.type === statSorterKey.type}"
          >
            {{ player[stat.type] }}
          </td>
        </tr>
        <div
          v-if="playerSelected === player.name"
          class="chartsDiv"
        >
          <PieChart
            class="pieChart"
            :pieChartData="pieChartData"
            :pieChartOptions="pieChartOptions"
            :height="300"
            :width="800"
            >
          </PieChart>
          <RadarChart
            class="radarChart"
            :radarChartData="radarChartData"
            :height="380"
            :width="800"
            >
          </RadarChart>
        </div>
      </div>
    </table>
  </div>
</template>

<script>
import PieChart from "./PieChart.js"
import RadarChart from "./RadarChart.js"

export default {
  props: [
    "playerStats",
    "playerStatsPerGame",
    "statHeaders",
    "filterSelected",
    "pageSelected",
    "statSorterKey",
    "statSelected",
    "playerSelected",
    "updatePlayerSelected",
    "max"
  ],
  components: {
    "PieChart": PieChart,
    "RadarChart": RadarChart
  },
  data() {
    return {
      pieChartData: {
        labels: ["Finishes", "First Finishes", "Knock Offs", "Saves", "Denies"],
        datasets: [
          {
            borderWidth: 1,
            borderColor: "#efefef",
            backgroundColor: ["#c2574e","#eab364","#acc078","#94aeac","#68829e"],
            hoverBackgroundColor: ["#c2574e","#eab364","#acc078","#94aeac","#68829e"],
            data: []
          }
        ]
      },
      pieChartOptions: {
        tooltips: {
          enabled: false,
          bodyFontFamily: "'Antic', sans-serif",
          bodyFontSize: 12,
          backgroundColor: "#404040"

        },
        legend: {
          display: true,
          position: "left",
          labels: {
            fontSize: 12,
            fontFamily: "'Antic', sans-serif",
            fontColor: "#101010",
          }
        },
        maintainAspectRatio: false
      },
      radarChartData: null
    }
  },
  methods: {
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
      for (let i = 0; i < this.playerStats.length; i++) {
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
      this.pieChartData.datasets[0].data = this.computedPieChartStats
      this.radarChartData = this.computedRadarChartStats
      this.statSorter()
      this.$nextTick(function() {
        this.statSorter()
        this.updatePlayerSelected()
      })
    }
  },
  computed: {
    displayedStats() {
      let self = this.selectedStats
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
      let self = []
      if (this.statSelected === "statTotals") {
        self = this.playerStats
      } else if (this.statSelected === "statsPerGame") {
        for (let i = 0; i < this.playerStatsPerGame.length; i++) {
          self.push({...this.playerStatsPerGame[i]})
          for (let j in self[i]) {
            if (j !== "name" && j !== "gamesPlayed") {
              self[i][j] = self[i][j].toFixed(2)
            }
          }
        }
      }
      return self
    },
    computedPieChartStats() {
      let self = null
      for (let i = 0; i < this.playerStats.length; i++) {
        if (this.playerSelected === this.playerStats[i].name) {
          self = [
            this.playerStats[i].finishes,
            this.playerStats[i].firstFinishes,
            this.playerStats[i].knockOffs,
            this.playerStats[i].saves,
            this.playerStats[i].denies
          ]
        }
      }
      return self
    },
    computedRadarChartStats() {
      let max = {
        finishes: this.max(this.playerStatsPerGame).finishes,
        firstFinishes: this.max(this.playerStatsPerGame).firstFinishes,
        knockOffs: this.max(this.playerStatsPerGame).knockOffs,
        saves: this.max(this.playerStatsPerGame).saves,
        denies: this.max(this.playerStatsPerGame).denies
      }
      for (let i in max) {
        if (max[i] === 0) {
          max[i] = 1}
      }
      let self = null
      for (let i = 0; i < this.playerStatsPerGame.length; i++) {
        if (this.playerSelected === this.playerStatsPerGame[i].name) {
          self = [
            this.playerStatsPerGame[i].finishes / max.finishes,
            this.playerStatsPerGame[i].firstFinishes / max.firstFinishes,
            this.playerStatsPerGame[i].knockOffs / max.knockOffs,
            this.playerStatsPerGame[i].saves / max.saves,
            this.playerStatsPerGame[i].denies / max.denies
          ]
        }
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
  grid-template-columns: 8fr repeat(8, 3fr);
}
.statCellsDiv:hover {
  background: #efefef;
}
.playerSelected {
  background: #efefef;
}
.chartsDiv {
  display: grid;
  grid-template-columns: 4fr 4fr 4fr 4fr;
  background: #f7f7f7;
}
.pieChart {
  display: grid;
  grid-column: 2 / 3;
  margin: auto;
  background: #f7f7f7;
  padding: 30px 0px 30px 100px;
  height: 150px;
  width: 400px;
}
.radarChart {
  display: grid;
  grid-column: 3 / 4;
  margin: auto;
  background: #f7f7f7;
  padding: 10px 30px 10px 0px;
  height: 190px;
  width: 400px;
}
</style>
