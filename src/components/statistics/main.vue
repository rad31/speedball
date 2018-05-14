<template>
  <div>
    <div>
      <div class="buttonsDiv">
        <p
          v-for="button in buttons"
          @click="statSelector(); updatePlayerSelected()"
          :class="[{buttonSelected: button.type === statSelected}, button.type]"
          class="statTotals buttons clickable"
        >
          {{ button.text }}
        </p>
      </div>
      <StatisticsTable
        :playerStats="playerStats"
        :playerStatsPerGame="playerStatsPerGame"
        :playerSelected="playerSelected"
        :filterSelected="filterSelected"
        :pageSelected="pageSelected"
        :statHeaders="statHeaders"
        :statSorterKey="statSorterKey"
        :statSelected="statSelected"
        :max="max"
        :updatePlayerSelected="updatePlayerSelected"
        @changePlayerSelected="changePlayerSelected($event)"
        @changeStatSorterKeyType="changeStatSorterKeyType($event)"
        @changeStatSorterKeyOrder="changeStatSorterKeyOrder($event)"
        class="component"
        ref="table"
      >
      </StatisticsTable>
    </div>
  </div>
</template>

<script>
  import StatisticsTable from "./Components/StatisticsTable.vue"

  export default {
    props: [
      "playerStats",
      "playerStatsPerGame",
      "filterSelected",
      "pageSelected",
      "max",
      "playerSelected",
      "updatePlayerSelected"
    ],
    components: {
      "StatisticsTable": StatisticsTable
    },
    data() {
      return {
        statHeaders: [
          {type: "name", text: "Name"},
          {type: "gamesPlayed", text: "GP"},
          {type: "wins", text: "W"},
          {type: "losses", text: "L"},
          {type: "finishes", text: "F"},
          {type: "firstFinishes", text: "FF"},
          {type: "knockOffs", text: "KO"},
          {type: "saves", text: "S"},
          {type: "denies", text: "D"}
        ],
        buttons: [
          {type: "statTotals", text: "Stat Totals"},
          {type: "statsPerGame", text: "Stats Per Game"}
        ],
        statSorterKey: {type: "gamesPlayed", order: "descending"},
        statSelected: "statTotals"
      }
    },
    methods: {
      statSelector() {
        for (let i = 0; i < this.buttons.length; i++) {
          if (event.target.innerText === this.buttons[i].text) {
            this.statSelected = this.buttons[i].type
          }
        }
      },
      changePlayerSelected(e) {
        this.$emit("changePlayerSelected", e)
      },
      changeStatSorterKeyType(e) {
        this.statSorterKey.type = e
      },
      changeStatSorterKeyOrder(e) {
        this.statSorterKey.order = e
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
