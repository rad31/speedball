<template>
  <div>
    <div class='buttonsDiv'>
      <p @click='displayStatTotals' class='statTotals buttons clickable'>Stat Totals</p>
      <p @click='displayStatsPerGame' class='statsPerGame buttons clickable'>Stats Per Game</p>
    </div>
    <table>
      <tr class="statHeadersDiv">
        <th v-for="stat in statTypes" class="clickable statHeaders" @click="statSelector">
          {{ stat.abbr }}
        </th>
      </tr>
      <tr class="statsDiv" v-for="(player, index) in orderedPlayerStats">
        <td v-for="stat in orderedPlayerStats[index]">
          {{ stat }}
        </td>
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
    computedStats: {
      type: Array
    },
    normalizedStats: {
      type: Array
    }
  },
  data() {
    return {
      statTypes: [
        {type: 'name', abbr: 'Name'},
        {type: 'gamesPlayed', abbr: 'GP'},
        {type: 'wins', abbr: 'W'},
        {type: 'losses', abbr: 'L'},
        {type: 'beersFinished', abbr: 'BF'},
        {type: 'knockOffs', abbr: 'KO'},
        {type: 'firstFinishes', abbr: 'FF'},
        {type: 'canCatches', abbr: 'CC'},
        {type: 'ballCatches', abbr: 'BC'}
      ],
      orderedPlayerStats: this.playerStats.sort(
        function (a, b) {
          if (a.name < b.name) {
            return -1
          } else if (a.name > b.name) {
            return 1
          }
        }
      ),
      selected: '',
      displayed: 'statTotals'
    }
  },
  methods: {
    statSelector() {
      for (var i = 0; i < this.statTypes.length; i++) {
        if (this.statTypes[i].abbr == event.target.innerText) {
          if (this.selected == this.statTypes[i].type) {
            this.orderedPlayerStats.reverse()
          } else {
            this.selected = this.statTypes[i].type
            if (this.selected == 'name') {
              this.orderedPlayerStats.sort(
                (a, b) => {
                  if (a.name < b.name) {
                    return -1
                  } else if (a.name > b.name) {
                    return 1
                  }
                }
              )
            } else {
              this.orderedPlayerStats.sort(
                (a, b) => {
                  return b[this.selected] - a[this.selected]
                }
              )
            }
          }
        }
      }
    },
    displayStatsPerGame() {
      if (this.displayed == "statTotals") {
        for (var i in this.orderedPlayerStats) {
          for (var j in this.orderedPlayerStats[i]) {
            if (j !== "name") {
              if (j !== "gamesPlayed") {
                this.orderedPlayerStats[i][j] = (
                  this.orderedPlayerStats[i][j] / this.orderedPlayerStats[i]["gamesPlayed"]
                ).toFixed(2)
              }
            }
          }
        }
        this.displayed = "statsPerGame"
      }
    },
    displayStatTotals() {
      if (this.displayed == "statsPerGame") {
        for (var i in this.orderedPlayerStats) {
          for (var j in this.orderedPlayerStats[i]) {
            if (j !== "name") {
              if (j !== "gamesPlayed") {
                this.orderedPlayerStats[i][j] = (
                  this.orderedPlayerStats[i][j] * this.orderedPlayerStats[i]["gamesPlayed"]
                ).toFixed(0)
              }
            }
          }
        }
        this.displayed = "statTotals"
      }
    }
  }
}
</script>

<style scoped>

.buttonsDiv {
  display: grid;
  grid-template-columns: 3fr 2fr 2fr 3fr;
  grid-column-gap: 20px;
  padding: 20px;
  background: #2baac3;
}

.buttons {
  background: #eeeeee;
  font-size: 12px;
  border-radius: 4px;
}

.statTotals {
  grid-column: 2 / 3;
}

.statsPerGame {
  grid-column: 3 / 4;
}

.statHeadersDiv {
  display: grid;
  grid-template-columns: 8fr repeat(8, 3fr);
  padding-top: 5px;
  background: #2baac3;
}

.statHeaders {
  background: #2baac3;
  border-radius: 3px;
}

.statsDiv {
  display: grid;
  grid-template-columns: 8fr repeat(8, 3fr);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #a8979f;
}

</style>
