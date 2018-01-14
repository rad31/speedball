<template>
  <div>
    <table>
      <tr class="statHeadersDiv">
        <th v-for="stat in statTypes" class="clickable statTypes" @click="statSelector">
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
import { bus } from 'C:/Users/Ronny/speedballprototype/src/main.js'
import playerStatsRow from './components/playerStatsRow.vue'

export default {
  props: {
    statTypes: {
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
  data() {
    return {
      orderedPlayerStats: this.playerStats.sort(
        function (a, b) {
          if (a.name < b.name) {
            return -1
          } else if (a.name > b.name) {
            return 1
          }
        }
      ),
      selected: ''
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
    }
  }
}
</script>

<style scoped>

.buttonsDiv {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  grid-template-columns: 2fr repeat(8, 1fr);
  padding-top: 5px;
  background: #2baac3;
}

.statHeaders {
  background: #2baac3;
  border-radius: 3px;
}

.statsDiv {
  display: grid;
  grid-template-columns: 2fr repeat(8, 1fr);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #a8979f;
}

</style>
