<template>
  <div>
    <div>
      <p class="title">National Speedball League</p>
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
        :is="this.pageDisplayed.type"
        :matchCount="matchCount"
        :playerStats="playerStats"
        :playerStatsOneVsOne="playerStatsOneVsOne"
        :playerStatsLastFiveGames="playerStatsLastFiveGames"
        :playerRankings="playerRankings"
        :popUp="popUp"
        :pageDisplayed="pageDisplayed"
        :pages="pages"
        class="component"
      ></component>
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
import { firebaseRawData } from "./firebase"

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
      pageDisplayed: {
        type: "rankings"
      },
      popUp: {
        displayed: false,
        error: false,
        message: ""
      }
    }
  },
  methods: {
    componentSelector() {
      for (let i = 0; i < this.pages.length; i++) {
        if (event.target.innerText === this.pages[i].text) {
          this.pageDisplayed.type = this.pages[i].type
          this.pages[i].selected = true
        } else if (event.target.innerText !== this.pages[i].text) {
          this.pages[i].selected = false
        }
      }
    }
  },
  computed: {
    playerStats() {
      let mergedStats = []
      let nameMatch = false
      for (let i = 0; i < this.rawData.length; i++) {
        for (let j = 0; j < mergedStats.length; j++) {
          if (this.rawData[i].name === mergedStats[j].name) {
            for (let k in mergedStats[j]) {
              if (k !== "name" && k !== "playersPerTeam" && k !== "matchNumber") {
                mergedStats[j][k] += this.rawData[i][k]
              }
            }
            nameMatch = true
          }
        }
        if (nameMatch === false) {
          mergedStats.push({
            name: this.rawData[i].name,
            gamesPlayed: this.rawData[i].gamesPlayed,
            wins: this.rawData[i].wins,
            losses: this.rawData[i].losses,
            finishes: this.rawData[i].finishes,
            firstFinishes: this.rawData[i].firstFinishes,
            knockOffs: this.rawData[i].knockOffs,
            saves: this.rawData[i].saves,
            denies: this.rawData[i].denies
          })
        }
        nameMatch = false
      }
      return mergedStats
    },
    playerStatsLastFiveGames() {
      let playersWithFiveGames = []
      for (let i = 0; i < this.playerStats.length; i++) {
        if (this.playerStats[i].gamesPlayed >= 5) {
          playersWithFiveGames.push({
            name: this.playerStats[i].name,
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
        let gameCount = 0
        for (let j = this.rawData.length - 1; j >= 0; j--) {
          if (gameCount < 5 && this.rawData[j].name === playersWithFiveGames[i].name) {
            for (let k in playersWithFiveGames[i]) {
              if (k !== "name") {
                playersWithFiveGames[i][k] += this.rawData[j][k]
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
      let mergedStats = []
      let nameMatch = false
      for (let i = 0; i < this.rawData.length; i++) {
        if (this.rawData[i].playersPerTeam === 1) {
          for (let j = 0; j < mergedStats.length; j++) {
            if (this.rawData[i].name === mergedStats[j].name) {
              for (let k in mergedStats[j]) {
                if (k !== "name" && k !== "playersPerTeam" && k !== "matchNumber") {
                  mergedStats[j][k] += this.rawData[i][k]
                }
              }
              nameMatch = true
            }
          }
          if (nameMatch === false) {
            mergedStats.push({
              name: this.rawData[i].name,
              gamesPlayed: this.rawData[i].gamesPlayed,
              wins: this.rawData[i].wins,
              losses: this.rawData[i].losses,
              finishes: this.rawData[i].finishes,
              firstFinishes: this.rawData[i].firstFinishes,
              knockOffs: this.rawData[i].knockOffs,
              saves: this.rawData[i].saves,
              denies: this.rawData[i].denies
            })
          }
          nameMatch = false
        }
      }
      return mergedStats
    },
    computedStats() {
      let self = []
      for (let i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
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
    winPercentageNormMax() {
      let self = 0
      for (let i = 0; i < this.normalizedStats.length; i++) {
        if (self < this.normalizedStats[i].winPercentage) {
          self = this.normalizedStats[i].winPercentage
        }
      }
      return self
    },
    pointsPerGameAvg() {
      let self = 0
      for (let i = 0; i < this.computedStats.length; i++) {
        self += this.computedStats[i].pointsPerGame
      }
      return self / this.computedStats.length
    },
    pointsPerGameNormMax() {
      let self = 0
      for (let i = 0; i < this.normalizedStats.length; i++) {
        if (self < this.normalizedStats[i].pointsPerGame) {
          self = this.normalizedStats[i].pointsPerGame
        }
      }
      return self
    },
    gamesPlayedAvg() {
      let self = 0
      for (let i = 0; i < this.playerStats.length; i++) {
        self += this.playerStats[i].gamesPlayed
      }
      return self / this.playerStats.length
    },
    gamesPlayedMax() {
      let self = 0
      for (let i = 0; i < this.playerStats.length; i++) {
        if (self < this.playerStats[i].gamesPlayed) {
          self = this.playerStats[i].gamesPlayed
        }
      }
      return self
    },
    normalizedStats() {
      let self = []
      for (let i = 0; i < this.playerStats.length; i++) {
        let AVGWINPERCENTAGE = 50
        let gamesBelowAvg = this.gamesPlayedAvg - this.playerStats[i].gamesPlayed
        let gamesAboveAvg = this.playerStats[i].gamesPlayed - this.gamesPlayedAvg
        let normalize = function(_x1, _x2, _y1, _y2) {
          return _x1 / _x2 * _y1 + (1 - _x1 / _x2) * _y2
        }
        let insignificantNormalize = function(_x1, _x2, _x3, _y1, _y2) {
          return Math.pow(_x1, _x3) / Math.pow(_x2, _x3) * _y1 + (1 - Math.pow(_x1, _x3) / Math.pow(_x2, _x3)) * _y2
        }
        self.push({
          name: this.playerStats[i].name,
          winPercentage: 0,
          pointsPerGame: 0
        })
        if (this.playerStats[i].gamesPlayed > this.gamesPlayedAvg) {
          self[i].winPercentage = normalize(
            gamesAboveAvg,
            this.playerStats[i].gamesPlayed,
            this.computedStats[i].winPercentage,
            normalize(
              this.playerStats[i].gamesPlayed,
              this.gamesPlayedMax,
              this.computedStats[i].winPercentage,
              AVGWINPERCENTAGE
            )
          )
          self[i].pointsPerGame = normalize(
            gamesAboveAvg,
            this.playerStats[i].gamesPlayed,
            this.computedStats[i].pointsPerGame,
            normalize(
              this.playerStats[i].gamesPlayed,
              this.gamesPlayedMax,
              this.computedStats[i].pointsPerGame,
              this.pointsPerGameAvg
            )
          )
        } else {
          self[i].winPercentage = insignificantNormalize(
            this.playerStats[i].gamesPlayed,
            this.gamesPlayedMax,
            gamesBelowAvg,
            this.computedStats[i].winPercentage,
            AVGWINPERCENTAGE
          )
          self[i].pointsPerGame = insignificantNormalize(
            this.playerStats[i].gamesPlayed,
            this.gamesPlayedMax,
            gamesBelowAvg,
            this.computedStats[i].pointsPerGame,
            this.pointsPerGameAvg
          )
        }
      }
      return self
    },
    playerRankings() {
      let self = []
      for (let i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
          playerRating: (
            (
              (this.normalizedStats[i].winPercentage) / (this.winPercentageNormMax)
              + (this.normalizedStats[i].pointsPerGame) / (this.pointsPerGameNormMax)
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
    rankingsData: firebaseRankingsData,
    rawData: firebaseRawData

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
    font-size: 16px;
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
</style>
