<template>
  <div>
    <div>
      <p @click="test" class="title">National Speedball League</p>
      <div class="pagesDiv">
        <p
          v-for="page in pages"
          :class="[{pageSelected: page.selected}, page.type]"
          class="pages clickable"
          @click="componentSelector()"
        >
          {{ page.text }}
        </p>
      </div>
      <div
        class="filtersDiv"
        v-if="pageDisplayed.type !== 'inputPoints'"
      >
        <p
          v-for="filter in filters"
          @click="filterSelector(); checkRowSelected()"
          :class="[{filterSelected: filter.selected}, filter.type]"
          class="filters clickable"
        >
          {{ filter.text }}
        </p>
      </div>
      <keep-alive>
        <component
          :is="this.pageDisplayed.type"
          :matchCount="matchCount"
          :playerStats="playerStats"
          :playerStatsPerGame="playerStatsPerGame"
          :playerRankings="playerRankings"
          :rankingsSnapshots="rankingsSnapshots"
          :filters="filters"
          :pages="pages"
          :pageDisplayed="pageDisplayed"
          :popUp="popUp"
          :avg="avg"
          :max="max"
          :normalize="normalize"
          :rowSelected="rowSelected"
          :checkRowSelected="checkRowSelected"
          class="component"
          ref="page"
        >
        </component>
      </keep-alive>
    </div>
    <div
      v-show="this.popUp.displayed === true"
      class="popUpOverlay">
    </div>
  </div>
</template>

<script>
import InputPoints from "./Components/InputPoints/Main.vue"
import Rankings from "./Components/Rankings/Main.vue"
import Statistics from "./Components/Statistics/Main.vue"
import { firebaseMatchData } from "./firebase"
import { firebaseMatchCount } from "./firebase"
import { firebaseRankingsData } from "./firebase"

export default {
  components: {
    "InputPoints": InputPoints,
    "Rankings": Rankings,
    "Statistics": Statistics,
  },
  data() {
    return {
      pages: [
        {type: "rankings", text: "Rankings", selected: true},
        {type: "statistics", text: "Statistics", selected: false},
        {type: "inputPoints", text: "Input Points", selected: false}
      ],
      filters: [
        {type: "overallRankings", text: "Overall", selected: true},
        {type: "lastFiveGames", text: "Last 5 Games", selected: false},
        {type: "oneVsOne", text: "1 vs 1", selected: false}
      ],
      pageDisplayed: {
        type: "rankings"
      },
      filterSelectorKey: "overallRankings",
      rowSelected: {name: ""},
      popUp: {
        displayed: false,
        error: false,
        message: ""
      }
    }
  },
  methods: {
    test() {
    },
    componentSelector() {
      for (let i = 0; i < this.pages.length; i++) {
        if (event.target.innerText === this.pages[i].text) {
          this.pageDisplayed.type = this.pages[i].type
          this.pages[i].selected = true
        } else if (event.target.innerText !== this.pages[i].text) {
          this.pages[i].selected = false
        }
      }
    },
    filterSelector() {
      for (let i = 0; i < this.filters.length; i++) {
        if (event.target.innerText === this.filters[i].text) {
          this.filterSelectorKey = this.filters[i].type
          this.filters[i].selected = true
        } else if (event.target.innerText !== this.filters[i].text) {
          this.filters[i].selected = false
        }
      }

// Option to hide charts when switching between rankings and statistics

      /*
      if (this.pageDisplayed.type === "rankings") {
        this.rowSelected.name = ""
        for (let i = 0; i < this.playerStats.length; i++) {
          this.$refs.page.$refs.rTable.$refs.rRow[i].classList.remove("rowSelected")
        }
      } else if (this.pageDisplayed.type === "statistics") {
        this.rowSelected.name = ""
        for (let i = 0; i < this.playerStats.length; i++) {
          this.$refs.page.$refs.sTable.$refs.sRow[i].classList.remove("rowSelected")
        }
      }*/
    },
    checkRowSelected() {
      if (this.pageDisplayed.type === "statistics") {
        this.$nextTick(function() {
          for (let i = 0; i < this.playerStats.length; i++) {
            this.$refs.page.$refs.sTable.$refs.sRow[i].classList.remove("rowSelected")
            if (this.$refs.page.$refs.sTable.$refs.sRow[i].childNodes[0].innerText === this.rowSelected.name) {
              this.$refs.page.$refs.sTable.$refs.sRow[i].classList.add("rowSelected")
            }
          }
        })
      } else if (this.pageDisplayed.type === "rankings") {
        this.$nextTick(function() {
          for (let i = 0; i < this.playerStats.length; i++) {
            this.$refs.page.$refs.rTable.$refs.rRow[i].classList.remove("rowSelected")
            if (this.$refs.page.$refs.rTable.$refs.rRow[i].childNodes[0].innerText === this.rowSelected.name) {
              this.$refs.page.$refs.rTable.$refs.rRow[i].classList.add("rowSelected")
            }
          }
        })
      }
    },
    normalize(statArray) {
      const avgGamesPlayed = this.avg(statArray).gamesPlayed
      const maxGamesPlayed = this.max(statArray).gamesPlayed
      let avgStats = {}
      for (let i in statArray[0]) {
        if (i !== "name" && i !== "gamesPlayed" && i !== "winPercentage") {
          avgStats[i] = this.avg(statArray)[i]
        } else if (i === "winPercentage") {
          avgStats[i] = 50
        }
      }
      let newStatArray = []
      for (let i = 0; i < statArray.length; i++) {
        newStatArray.push({...statArray[i]})
      }
      return newStatArray.map(player => {
        const gamesAboveAvg = player.gamesPlayed - avgGamesPlayed
        const gamesBelowAvg = avgGamesPlayed - player.gamesPlayed
        const percentOfMax = player.gamesPlayed / maxGamesPlayed
        for (let stat in player) {
          if (stat !== "name" && stat !== "gamesPlayed") {
            const adjustedStat = percentOfMax * player[stat] + (1 - percentOfMax) * avgStats[stat]
            if (player.gamesPlayed > avgGamesPlayed) {
              const percentAboveAvg = gamesAboveAvg / player.gamesPlayed
              player[stat] = percentAboveAvg * player[stat] + (1 - percentAboveAvg) * adjustedStat
            } else if (player.gamesPlayed <= avgGamesPlayed) {
              const adjustedPercentAboveAvg = Math.pow(percentOfMax, gamesBelowAvg)
              player[stat] = adjustedPercentAboveAvg * player[stat] + (1 - adjustedPercentAboveAvg) * avgStats[stat]
            }
          }
        }
        return player
      })
    },
    avg(statArray) {
      let self = {}
      for (let i in statArray[0]) {
        let stat = 0
        if (i !== "name") {
          for (let j = 0; j < statArray.length; j++) {
            stat += statArray[j][i]
          }
          self[i] = stat / statArray.length
        }
      }
      return self
    },
    max(statArray) {
      let self = {}
      for (let i in statArray[0]) {
        let stat = 0
        if (i !== "name") {
          for (let j = 0; j < statArray.length; j++) {
            if (statArray[j][i] > stat) {
              stat = statArray[j][i]
            }
          }
          self[i] = stat
        }
      }
      return self
    }
  },
  computed: {
    playerStats() {
      let self = []
      let filteredStats = []
      if (this.filterSelectorKey === "overallRankings") {
        filteredStats = this.playerStatsOverall
      } else if (this.filterSelectorKey === "lastFiveGames") {
        filteredStats = this.playerStatsLastFiveGames
      } else if (this.filterSelectorKey === "oneVsOne") {
        filteredStats = this.playerStatsOneVsOne
      }
      for (let i = 0; i < filteredStats.length; i++) {
        self.push({...filteredStats[i]})
      }
      return self
    },
    playerStatsOverall() {
      let mergedStats = []
      let nameMatch = false
      for (let i = 0; i < this.matchData.length; i++) {
        for (let j in this.matchData[i]) {
          if (j !== ".key") {
            for (let k = 0; k < mergedStats.length; k++) {
              if (j === mergedStats[k].name) {
                for (let l in mergedStats[k]) {
                  if (l !== "name" && l !== "playersPerTeam") {
                    mergedStats[k][l] += this.matchData[i][j][l]
                  }
                }
                nameMatch = true
              }
            }
            if (nameMatch === false && j !== ".key") {
              mergedStats.push({
                name: j,
                gamesPlayed: this.matchData[i][j].gamesPlayed,
                wins: this.matchData[i][j].wins,
                losses: this.matchData[i][j].losses,
                finishes: this.matchData[i][j].finishes,
                firstFinishes: this.matchData[i][j].firstFinishes,
                knockOffs: this.matchData[i][j].knockOffs,
                saves: this.matchData[i][j].saves,
                denies: this.matchData[i][j].denies
              })
            }
            nameMatch = false
          }
        }
      }
      return mergedStats
    },
    playerStatsLastFiveGames() {
      let playersWithFiveGames = []
      for (let i = 0; i < this.playerStatsOverall.length; i++) {
        if (this.playerStatsOverall[i].gamesPlayed >= 5) {
          playersWithFiveGames.push({
            name: this.playerStatsOverall[i].name,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            finishes: 0,
            firstFinishes: 0,
            knockOffs: 0,
            saves: 0,
            denies: 0
          })
        }
      }
      for (let i = 0; i < playersWithFiveGames.length; i++) {
        let matchCount = 0
        for (let j = this.matchData.length - 1; j >= 0; j--) {
          if (matchCount < 5) {
            for (let k in this.matchData[j]) {
              if (k === playersWithFiveGames[i].name && k !== ".key") {
                for (let l in playersWithFiveGames[i]) {
                  if (l !== "name") {
                    playersWithFiveGames[i][l] += this.matchData[j][k][l]
                  }
                }
                matchCount += 1
              }
            }
          } else if (matchCount >= 5) {
            break
          }
        }
      }
      return playersWithFiveGames
    },
    playerStatsOneVsOne() {
      let mergedStats = []
      let nameMatch = false
      for (let i = 0; i < this.matchData.length; i++) {
        if (Object.keys(this.matchData[i]).length === 3) {
          for (let j in this.matchData[i]) {
            if (j !== ".key") {
              for (let k = 0; k < mergedStats.length; k++) {
                if (j === mergedStats[k].name) {
                  for (let l in mergedStats[k]) {
                    if (l !== "name" && l !== "playersPerTeam") {
                      mergedStats[k][l] += this.matchData[i][j][l]
                    }
                  }
                  nameMatch = true
                }
              }
              if (nameMatch === false && j !== ".key") {
                mergedStats.push({
                  name: j,
                  gamesPlayed: this.matchData[i][j].gamesPlayed,
                  wins: this.matchData[i][j].wins,
                  losses: this.matchData[i][j].losses,
                  finishes: this.matchData[i][j].finishes,
                  firstFinishes: this.matchData[i][j].firstFinishes,
                  knockOffs: this.matchData[i][j].knockOffs,
                  saves: this.matchData[i][j].saves,
                  denies: this.matchData[i][j].denies
                })
              }
              nameMatch = false
            }
          }
        }
      }
      return mergedStats
    },
    rankingsSnapshots() {
      let mergedStats = []
      let rankingsData = [...this.rankingsData]
      for (let i = 0; i< rankingsData.length; i++) {
        mergedStats.push({
          name: rankingsData[i][".key"],
          gamesPlayed: [],
          playerRating: [],
          winPercentage: [],
          pointsPerGame: []
        })
        for (let j in rankingsData[i].totalGamesPlayed) {
          for (let k in rankingsData[i].totalGamesPlayed[j]) {
            mergedStats[i][k].push(rankingsData[i].totalGamesPlayed[j][k])
          }
        }
      }
      return mergedStats
    },
    playerStatsPerGame() {
      let self = []
      for (let i = 0; i < this.playerStats.length; i++) {
        self.push({})
        for (let j in this.playerStats[i]) {
          if (j !== "name" && j !== "gamesPlayed") {
            self[i][j] = this.playerStats[i][j] / this.playerStats[i].gamesPlayed
          } else {
            self[i][j] = this.playerStats[i][j]
          }
        }
      }
      return self
    },
    computedStats() {
      let self = []
      for (let i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
          gamesPlayed: this.playerStats[i].gamesPlayed,
          winPercentage: (this.playerStats[i].wins / this.playerStats[i].gamesPlayed) * 100,
          pointsPerGame: (
            this.playerStats[i].finishes
            + this.playerStats[i].firstFinishes
            + this.playerStats[i].knockOffs
            + this.playerStats[i].saves
            + this.playerStats[i].denies
          ) / this.playerStats[i].gamesPlayed
        })
      }
      return self
    },
    playerRankings() {
      let self = []
      for (let i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
          gamesPlayed: this.playerStats[i].gamesPlayed,
          playerRating: (
            (
              this.normalize(this.computedStats)[i].winPercentage / this.max(this.normalize(this.computedStats)).winPercentage
              + this.normalize(this.computedStats)[i].pointsPerGame / this.max(this.normalize(this.computedStats)).pointsPerGame
            ) * 500
          ),
          winPercentage: this.computedStats[i].winPercentage,
          pointsPerGame: this.computedStats[i].pointsPerGame
        })
      }
      return self
    }
  },
  firebase: {
    matchData: firebaseMatchData,
    matchCount: firebaseMatchCount,
    rankingsData: firebaseRankingsData

  }
}
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Antic|Josefin+Sans|Taviraj");
  p, input, td, th {
    align-content: center;
    color: #101010;
    font-size: 12px;
    font-weight: lighter;
    font-family: "Antic", sans-serif;
    display: grid;
    grid-template-columns: 1fr;
    text-align: center;
    margin: 0;
    padding: 4px;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    border-width: 0;
  }
  table {
    align-content: center;
    color: #101010;
    font-size: 12px;
    font-weight: lighter;
    font-family: "Antic", sans-serif;
    display: grid;
    grid-template-columns: 1fr;
    text-align: center;
    margin: 0;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    border-width: 0;
  }
  body {
    background: #ffffff;
    align-content: center;
    margin: auto;
  }
  .component {
    max-width: 1080px;
    margin: auto;
    display: grid;
  }
  .clickable {
    cursor: pointer;
  }
  .buttonsDiv {
    display: grid;
    grid-column-gap: 20px;
    padding: 20px;
    background: #808080;
  }
  .buttons {
    background: #505050;
    color: #ffffff;
    font-size: 16px;
    border-radius: 4px;
  }
  .buttons:hover {
    background: #404040;
  }
  .buttonSelected {
    color: #f0f090;
  }
  .statHeadersDiv, .statCellsDiv {
    display: grid;
  }
  .statHeadersDiv, .statHeaders {
    background: #f0f090;
  }
  .statHeaders:hover {
    background: #e0e080;
    border-radius: 2px;
  }
  .statCellsDiv, input {
    background: #ffffff;
  }
  .selected {
    font-weight: bold;
  }
</style>

<style scoped>
  .title {
    font-size: 28px;
    font-weight: normal;
    color: #ffffff;
    background: #303030;
    padding: 20px;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
  }
  .pagesDiv {
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr) 2fr;
    grid-column-gap: 20px;
    background: #404040;
    padding: 10px
  }
  .pages {
    background: #404040;
    color: #ffffff;
    font-size: 16px;
    border-radius: 4px;
  }
  .pages:hover {
    background: #353535;
  }
  .filtersDiv {
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr) 2fr;
    grid-column-gap: 20px;
    background: #606060;
    padding: 10px
  }
  .filters {
    background: #606060;
    color: #ffffff;
    font-size: 16px;
    border-radius: 4px;
  }
  .filters:hover {
    background: #555555;
  }
  .filterSelected, .pageSelected {
    color: #f0f090;
  }
  .rankings {
    grid-column: 2 / 3;
  }
  .statistics {
    grid-column: 3 / 4;
  }
  .inputPoints {
    grid-column: 4 / 5;
  }
  .popUpOverlay {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(255, 255, 255, 0.5);
  }
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
