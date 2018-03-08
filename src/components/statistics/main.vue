<template>
  <div>
    <div class="container">
      <div class="buttonsDiv">
        <p
          v-for="button in buttons"
          @click="statSelector()"
          :class="[{buttonSelected: button.selected}, button.type]"
          class="statTotals buttons clickable"
        >
          {{ button.text }}
        </p>
      </div>
      <statisticsTable
        :playerStats="playerStats"
        :statHeaders="statHeaders"
        :statSorterKey="statSorterKey"
        :statSelectorKey="statSelectorKey"
        class="component"
      >
      </statisticsTable>
    </div>
  </div>
</template>

<script>
  import statisticsTable from "./components/statisticsTable.vue"

  export default {
    props: {
      playerStats: {
        type: Array
      }
    },
    components: {
      "statisticsTable": statisticsTable,
    },
    data() {
      return {
        statHeaders: [
          {type: "name", text: "Name", selected: false},
          {type: "gamesPlayed", text: "GP", selected: true},
          {type: "wins", text: "W", selected: false},
          {type: "losses", text: "L", selected: false},
          {type: "finishes", text: "F", selected: false},
          {type: "firstFinishes", text: "FF", selected: false},
          {type: "knockOffs", text: "KO", selected: false},
          {type: "saves", text: "S", selected: false},
          {type: "denies", text: "D", selected: false}
        ],
        buttons: [
          {type: "statTotals", text: "Stat Totals", selected: true},
          {type: "statsPerGame", text: "Stats Per Game", selected: false}
        ],
        statSorterKey: {type: "gamesPlayed", order: "descending"},
        statSelectorKey: "statTotals"
      }
    },
    methods: {
      statSelector() {
        for (let i = 0; i < this.buttons.length; i++) {
          if (event.target.innerText === this.buttons[i].text) {
            this.statSelectorKey = this.buttons[i].type
            this.buttons[i].selected = true
          } else if (event.target.innerText !== this.buttons[i].text) {
            this.buttons[i].selected = false
          }
        }
      }
    }
  }
</script>

<style scoped>
  .buttonsDiv {
    grid-template-columns: 3fr 2fr 2fr 3fr;
  }
  .statTotals {
    grid-column: 2 / 3;
  }
  .statsPerGame {
    grid-column: 3 / 4;
  }
</style>
