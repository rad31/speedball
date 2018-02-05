<template>
  <div>
    <div class="mainDiv">
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
      <component
        :is="component"
        :matchCount="matchCount"
        :playerStats="playerStats"
        :playerStatsOneVsOne="playerStatsOneVsOne"
        :playerStatsLastFiveGames="playerStatsLastFiveGames"
        class="component"
      ></component>
    </div>
  </div>
</template>

<script>
import inputPoints from "./components/inputPoints/main.vue"
import rankings from "./components/rankings/main.vue"
import statistics from "./components/statistics/main.vue"
import { firebaseMatchData } from"./firebase"
import { firebaseMatchCount } from"./firebase"
export default {
  components: {
    "inputPoints": inputPoints,
    "rankings": rankings,
    "statistics": statistics
  },
  data() {
    return {
      pages: [
        {type: "rankings", text: "Rankings", selected: false},
        {type: "statistics", text: "Statistics", selected: true},
        {type: "inputPoints", text: "Input Points", selected: false}
      ],
      component: "statistics"
    }
  },
  methods: {
    test() {
      console.log(this.playerStatsLastFiveGames)
      console.log(this.playerStatsOneVsOne)
    },
    componentSelector() {
      for (var i in this.pages) {
        if (event.target.innerText === this.pages[i].text) {
          this.component = this.pages[i].type
          this.pages[i].selected = true
        } else if (event.target.innerText !== this.pages[i].text) {
          this.pages[i].selected = false
        }
      }
    }
  },
  computed: {
    playerStats() {
      var mergedStats = []
      var nameMatch = false
      for (var i = 0; i < this.matchData.length; i++) {
        for (var j = 0; j < mergedStats.length; j++) {
          if (this.matchData[i].name == mergedStats[j].name) {
            for (var k in mergedStats[j]) {
              if (k !== "name" && k !== "playersPerTeam" && k !== "matchNumber") {
                mergedStats[j][k] += this.matchData[i][k]
              }
            }
            nameMatch = true
          }
        }
        if (nameMatch == false) {
          mergedStats.push({
            name: this.matchData[i].name,
            gamesPlayed: this.matchData[i].gamesPlayed,
            wins: this.matchData[i].wins,
            losses: this.matchData[i].losses,
            beersFinished: this.matchData[i].beersFinished,
            firstFinishes: this.matchData[i].firstFinishes,
            knockOffs: this.matchData[i].knockOffs,
            canCatches: this.matchData[i].canCatches,
            ballCatches: this.matchData[i].ballCatches
          })
        }
        nameMatch = false
      }
      return mergedStats
    },
    playerStatsLastFiveGames() {
      var playersWithFiveGames = []
      for (var i = 0; i < this.playerStats.length; i++) {
        if (this.playerStats[i].gamesPlayed >= 5) {
          playersWithFiveGames.push({
            name: this.playerStats[i].name,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            beersFinished: 0,
            firstFinishes: 0,
            knockOffs: 0,
            canCatches: 0,
            ballCatches: 0
          })
        }
      }
      for (var i = 0; i < playersWithFiveGames.length; i++) {
        var gameCount = 0
        for (var j = this.matchData.length - 1; j >= 0; j--) {
          if (gameCount < 5 && this.matchData[j].name === playersWithFiveGames[i].name) {
            for (var k in playersWithFiveGames[i]) {
              if (k !== "name") {
                playersWithFiveGames[i][k] += this.matchData[j][k]
              }
            }
            gameCount += 1
          } else if (gameCount >= 5) {
            break
          }
        }
      }
      return playersWithFiveGames
    },
    playerStatsOneVsOne() {
      var mergedStats = []
      var nameMatch = false
      for (var i = 0; i < this.matchData.length; i++) {
        if (this.matchData[i].playersPerTeam == 1) {
          for (var j = 0; j < mergedStats.length; j++) {
            if (this.matchData[i].name == mergedStats[j].name) {
              for (var k in mergedStats[j]) {
                if (k !== "name" && k !== "playersPerTeam" && k !== "matchNumber") {
                  mergedStats[j][k] += this.matchData[i][k]
                }
              }
              nameMatch = true
            }
          }
          if (nameMatch == false) {
            mergedStats.push({
              name: this.matchData[i].name,
              gamesPlayed: this.matchData[i].gamesPlayed,
              wins: this.matchData[i].wins,
              losses: this.matchData[i].losses,
              beersFinished: this.matchData[i].beersFinished,
              firstFinishes: this.matchData[i].firstFinishes,
              knockOffs: this.matchData[i].knockOffs,
              canCatches: this.matchData[i].canCatches,
              ballCatches: this.matchData[i].ballCatches
            })
          }
          nameMatch = false
        }
      }
      return mergedStats
    }
  },
  firebase: {
    matchData: firebaseMatchData,
    matchCount: firebaseMatchCount
  }
}
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Antic|Josefin+Sans|Taviraj");
  p, input, td, th {
    align-content: center;
    color: #101010;
    font-size: 10px;
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
    min-width: 40px;
  }
  table {
    align-content: center;
    color: #101010;
    font-size: 10px;
    font-weight: lighter;
    font-family: "Antic", sans-serif;
    display: grid;
    grid-template-columns: 1fr;
    text-align: center;
    margin: 0;
    -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    border-width: 0;
    min-width: 40px;
  }
  body {
    background: #ffffff;
    align-content: center;
    margin: auto;
  }
  .component {
    max-width: 760px;
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
    font-size: 12px;
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
  .statCellsDiv:hover {
    background: #efefef;
  }
  .selected {
    font-weight: bold;
  }
</style>

<style scoped>
  .title {
    font-size: 24px;
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
    font-size: 12px;
    background: #404040;
    color: #ffffff;
  }
  .pages:hover {
    background: #505050;
    border-radius: 5px;
  }
  .pageSelected {
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
</style>
