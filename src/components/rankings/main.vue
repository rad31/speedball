<template>
  <div>
    <div>
      <RankingsTable
        :playerStats="playerStats"
        :playerRankings="playerRankings"
        :rankingsSnapshots="rankingsSnapshots"
        :statHeaders="statHeaders"
        :statSorterKey="statSorterKey"
        :checkRowSelected="checkRowSelected"
        :filters="filters"
        :pageDisplayed="pageDisplayed"
        :rowSelected="rowSelected"
        class="component"
        ref="rTable"
      >
      </RankingsTable>
    </div>
  </div>
</template>

<script>
import RankingsTable from "./Components/RankingsTable.vue"

export default {
  props: [
    "filters",
    "pageDisplayed",
    "playerStats",
    "playerRankings",
    "rankingsSnapshots",
    "rowSelected",
    "checkRowSelected"
  ],
  components: {
    "RankingsTable": RankingsTable
  },
  data() {
    return {
      statHeaders: [
        {type: "name", text: "Name", selected: false},
        {type: "playerRating", text: "Player Rating", selected: true},
        {type: "winPercentage", text: "Win Percentage", selected: false},
        {type: "pointsPerGame", text: "Points Per Game", selected: false}
      ],
      statSorterKey: {type: "playerRating", order: "descending"},
    }
  }
}
</script>

<style scoped>
</style>
