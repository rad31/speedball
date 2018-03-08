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
        <tr class="statCellsDiv">
          <td
            v-for="stat in statHeaders"
            :class="{selected: stat.selected}"
          >
            {{ player[stat.type] }}
          </td>
        </tr>
      </div>
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
  data() {
    return {
      playerSelected: ""
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
    playerSelector() {
      for (let i = 0; i < this.displayedStats.length; i++) {
        if (this.playerSelected === this.displayedStats[i].name) {
          this.x = []
          this.x.push({

          })
          this.y = []
          this.y.push({

          })
        }
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
</style>
