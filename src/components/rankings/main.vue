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
      <rankingsTable
        :playerStatsSelected="playerStatsSelected"
        :statHeaders="statHeaders"
        :statSorterKey="statSorterKey"
        :statSelectorKey="statSelectorKey"
        class="component"
      >
      </rankingsTable>
    </div>
  </div>
</template>

<script>
import rankingsTable from "./components/rankingsTable.vue"

export default {
  props: {
    playerStats: {
      type: Array
    },
    playerStatsLastFiveGames: {
      type: Array
    },
    playerStatsOneVsOne: {
      type: Array
    }
  },
  components: {
    "rankingsTable": rankingsTable
  },
  data() {
    return {
      statHeaders: [
        {type: "name", text: "Name", selected: false},
        {type: "playerRating", text: "Player Rating", selected: true},
        {type: "winPercentage", text: "Win Percentage", selected: false},
        {type: "pointsPerGame", text: "PointsPerGame", selected: false}
      ],
      buttons: [
        {type: "overallRankings", text: "Overall Rankings", selected: true},
        {type: "lastFiveGames", text: "Last Five Games", selected: false},
        {type: "oneVsOne", text: "One vs One", selected: false}
      ],
      statSorterKey: {type: "playerRating", order: "descending"},
      statSelectorKey: "overallRankings"
    }
  },
  methods: {
    statSelector() {
      for (var i = 0; i < this.buttons.length; i++) {
        if (event.target.innerText === this.buttons[i].text) {
          this.statSelectorKey = this.buttons[i].type
          this.buttons[i].selected = true
        } else if (event.target.innerText !== this.buttons[i].text) {
          this.buttons[i].selected = false
        }
      }
    }
  },
  computed: {
    playerStatsSelected() {
      var self = []
      if (this.statSelectorKey === "overallRankings") {
        for (var i = 0; i < this.playerStats.length; i++) {
          self.push({
            name: this.playerStats[i].name,
            gamesPlayed: this.playerStats[i].gamesPlayed,
            wins: this.playerStats[i].wins,
            losses: this.playerStats[i].losses,
            beersFinished: this.playerStats[i].beersFinished,
            firstFinishes: this.playerStats[i].firstFinishes,
            knockOffs: this.playerStats[i].knockOffs,
            canCatches: this.playerStats[i].canCatches,
            ballCatches: this.playerStats[i].ballCatches
          })
        }
      } else if (this.statSelectorKey === "lastFiveGames") {
        for (var i = 0; i < this.playerStatsLastFiveGames.length; i++) {
          self.push({
            name: this.playerStatsLastFiveGames[i].name,
            gamesPlayed: this.playerStatsLastFiveGames[i].gamesPlayed,
            wins: this.playerStatsLastFiveGames[i].wins,
            losses: this.playerStatsLastFiveGames[i].losses,
            beersFinished: this.playerStatsLastFiveGames[i].beersFinished,
            firstFinishes: this.playerStatsLastFiveGames[i].firstFinishes,
            knockOffs: this.playerStatsLastFiveGames[i].knockOffs,
            canCatches: this.playerStatsLastFiveGames[i].canCatches,
            ballCatches: this.playerStatsLastFiveGames[i].ballCatches
          })
        }
      } else if (this.statSelectorKey === "oneVsOne") {
        for (var i = 0; i < this.playerStatsOneVsOne.length; i++) {
          self.push({
            name: this.playerStatsOneVsOne[i].name,
            gamesPlayed: this.playerStatsOneVsOne[i].gamesPlayed,
            wins: this.playerStatsOneVsOne[i].wins,
            losses: this.playerStatsOneVsOne[i].losses,
            beersFinished: this.playerStatsOneVsOne[i].beersFinished,
            firstFinishes: this.playerStatsOneVsOne[i].firstFinishes,
            knockOffs: this.playerStatsOneVsOne[i].knockOffs,
            canCatches: this.playerStatsOneVsOne[i].canCatches,
            ballCatches: this.playerStatsOneVsOne[i].ballCatches
          })
        }
      }
      return self
    }
  }
}
</script>

<style scoped>
.buttonsDiv {
  grid-template-columns: repeat(5, 1fr);
}
.overallRankings {
  grid-column: 2 / 3;
}
.lastFiveGames {
  grid-column: 3 / 4;
}
.oneVsOne {
  grid-column: 4 / 5;
}
</style>
