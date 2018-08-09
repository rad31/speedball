<template>
  <div>
    <div>
      <RankingsTable
        :playerRankings="playerRankings"
        :statHeaders="statHeaders"
        :statSorterKey="statSorterKey"
        :updatePlayerSelected="updatePlayerSelected"
        :filterSelected="filterSelected"
        :playerSelected="playerSelected"
        :pageSelected="pageSelected"
        :rankingsSnapshots="rankingsSnapshots"
        @changePlayerSelected="changePlayerSelected($event)"
        @changeStatSorterKeyType="changeStatSorterKeyType($event)"
        @changeStatSorterKeyOrder="changeStatSorterKeyOrder($event)"
        class="component"
        ref="table"
      >
      </RankingsTable>
    </div>
  </div>
</template>

<script>
import RankingsTable from "./Components/RankingsTable.vue"

export default {
  props: [
    "filterSelected",
    "playerRankings",
    "playerSelected",
    "pageSelected",
    "updatePlayerSelected",
    "rankingsSnapshots"
  ],
  components: {
    "RankingsTable": RankingsTable
  },
  data() {
    return {
      statHeaders: [
        {type: "name", text: "Name"},
        {type: "playerRating", text: "Player Rating"},
        {type: "winPercentage", text: "Win Percentage"},
        {type: "weightedWinPercentage", text: "Weighted W%"},
        {type: "pointsPerGame", text: "Points Per Game"}
      ],
      statSorterKey: {type: "playerRating", order: "descending"},
    }
  },
  methods: {
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
</style>
