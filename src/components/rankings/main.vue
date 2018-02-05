<template>
  <div>
    <div class="buttonsDiv">
      <p class="overallStandings buttons clickable">Overall Standings</p>
      <p class="lastFiveGames buttons clickable">Last 5 Games</p>
      <p class="oneVsOne buttons clickable">1 vs 1</p>
    </div>
    <rankingsTable
      :playerStats="playerStats"
      :statHeaders="statHeaders"
      :statSorterKey="statSorterKey"
      :statSelectorKey="statSelectorKey"
      class="component"
    >
  </rankingsTable>
  </div>
</template>

<script>
export default {
  props: {
    playerStats: {
      type: Array
    }
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
      for (var i in this.buttons) {
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
.statHeadersDiv, .statCellsDiv {
  grid-template-columns: repeat(4, 1fr);
}
.buttonsDiv {
  grid-template-columns: repeat(5, 1fr);
}
.overallStandings {
  grid-column: 2 / 3;
}
.lastFiveGames {
  grid-column: 3 / 4;
}
.oneVsOne {
  grid-column: 4 / 5;
}
</style>
