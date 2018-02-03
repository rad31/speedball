<template>
  <div>
    <table>
      <tr class="rankingsHeadersDiv">
        <th v-for="stat in statTypes" class="clickable rankingsHeaders" @click="statSelector">
          {{ stat.abbr }}
        </th>
      </tr>
      <tr class="rankingsData" v-for="(player, index) in orderedCompleteComputedStats">
        <td v-for="stat in orderedCompleteComputedStats[index]">
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
    },
    completeComputedStats: {
      type: Array
    }
  },
  data() {
    return {
      statTypes: [
        {type: 'name', abbr: 'Name'},
        {type: 'playerRating', abbr: 'Player Rating'},
        {type: 'winPercentage', abbr: 'Win Percentage'},
        {type: 'pointsPerGame', abbr: 'Points per Game'}
      ],
      orderedCompleteComputedStats: this.completeComputedStats.sort(
        function (a, b) {
          if (a.name < b.name) {
            return -1
          } else if (a.name > b.name) {
            return 1
          }
        }
      ),
      selected: '',
    }
  },
  methods: {
    statSelector() {
      for (var i = 0; i < this.statTypes.length; i++) {
        if (this.statTypes[i].abbr == event.target.innerText) {
          if (this.selected == this.statTypes[i].type) {
            this.orderedCompleteComputedStats.reverse()
          } else {
            this.selected = this.statTypes[i].type
            if (this.selected == 'name') {
              this.orderedCompleteComputedStats.sort(
                (a, b) => {
                  if (a.name < b.name) {
                    return -1
                  } else if (a.name > b.name) {
                    return 1
                  }
                }
              )
            } else {
              this.orderedCompleteComputedStats.sort(
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

..buttonsDiv {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  padding: 20px;
  background: #89c32b;
}

.buttons {
  background: #eeeeee;
  font-size: 12px;
  border-radius: 4px;
}

.rankingsHeadersDiv {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-top: 5px;
  background: #89c32b;
}

.rankingsHeaders {
  background: #89c32b;
  border-radius: 3px;
}

.rankingsData {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #a8979f;
}
</style>
