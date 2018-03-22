<template>
  <div>
    <table>
      <tr class="statHeadersDiv">
        <th
          v-for="stat in statHeaders"
          :class="{selected: stat.selected}"
          class="clickable statHeaders"
          @click="statSorter()"
        >
          {{ stat.text }}
        </th>
      </tr>
      <div v-for="player in displayedStats">
        <tr
          class="statCellsDiv clickable"
          @click="displayChart"
          ref="row"
        >
          <td
            v-for="stat in statHeaders"
            :class="{selected: stat.selected}"
          >
            {{ player[stat.type] }}
          </td>
        </tr>
        <div
          v-if="playerSelected === player.name"
          class="chartsDiv"
        >
          <StatisticsCharts
            class="statisticsCharts"
            :chartData="pieChartData"
            :chartOptions="chartOptions"
            :height="125"
            >
          </StatisticsCharts>
        </div>
      </div>
    </table>
  </div>
</template>

<script>
import StatisticsCharts from "./StatisticsCharts.js"

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
  components: {
    "StatisticsCharts": StatisticsCharts
  },
  data() {
    return {
      playerSelected: "",
      pieChartData: {
        labels: ["Finishes", "First Finishes", "Knock Offs", "Saves", "Denies"],
        datasets: [
          {
            label: "Breakdown of Points",
            borderWidth: 0,
            borderColor: "#808080",
            backgroundColor: [
//              "#e0e070","#aebd38","#598234","#68829e","#757790"
              "#c2574e","#eab364","#acc078","#94aeac","#68829e"
            ],
            data: []
          }
        ]
      },
      chartOptions: {
        tooltips: {
          enabled: true,
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
      }
    }
  },
  methods: {
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
    displayChart() {
      this.pieChartData.datasets[0].data = []
      for (let i = 0; i < this.playerStats.length; i++) {
        this.$refs.row[i].classList.remove("rowSelected")
      }
      if (this.playerSelected !== event.target.parentNode.childNodes[0].innerText) {
        this.playerSelected = event.target.parentNode.childNodes[0].innerText
        this.pieChartData.datasets[0].data = this.computedChartStats
        event.target.parentNode.classList.add("rowSelected")
      } else {
        this.playerSelected = ""
      }
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
      if (this.statSelectorKey === "statTotals") {
        for (let i = 0; i < this.playerStats.length; i++) {
          self.push({
            name: this.playerStats[i].name,
            gamesPlayed: this.playerStats[i].gamesPlayed,
            wins: this.playerStats[i].wins,
            losses: this.playerStats[i].losses,
            finishes: this.playerStats[i].finishes,
            firstFinishes: this.playerStats[i].firstFinishes,
            knockOffs: this.playerStats[i].knockOffs,
            saves: this.playerStats[i].saves,
            denies: this.playerStats[i].denies
          })
        }
      } else if (this.statSelectorKey === "statsPerGame") {
        for (let i = 0; i < this.playerStats.length; i++) {
          self.push({
            name: this.playerStats[i].name,
            gamesPlayed: this.playerStats[i].gamesPlayed,
            wins: (this.playerStats[i].wins / this.playerStats[i].gamesPlayed).toFixed(2),
            losses: (this.playerStats[i].losses / this.playerStats[i].gamesPlayed).toFixed(2),
            finishes: (this.playerStats[i].finishes / this.playerStats[i].gamesPlayed).toFixed(2),
            firstFinishes: (this.playerStats[i].firstFinishes / this.playerStats[i].gamesPlayed).toFixed(2),
            knockOffs: (this.playerStats[i].knockOffs / this.playerStats[i].gamesPlayed).toFixed(2),
            saves: (this.playerStats[i].saves / this.playerStats[i].gamesPlayed).toFixed(2),
            denies: (this.playerStats[i].denies / this.playerStats[i].gamesPlayed).toFixed(2)
          })
        }
      }
      return self
    },
    computedChartStats() {
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
.rowSelected {
  background: #efefef;
}
.chartsDiv {
  display: grid;
  grid-template-columns: 4fr 8fr 3fr;
  background: #f7f7f7;
  padding: 15px;
}
.statisticsCharts {
  display: grid;
  grid-column: 2 / 3;
  margin: auto;
  background: #f7f7f7;
}
</style>
