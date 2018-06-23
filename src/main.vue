<template>
  <div>
    <div>
      <p @click="test()" class="title">National Speedball League</p>
      <div class="pagesDiv">
        <p
          v-for="page in pages"
          :class="[{pageSelected: page.type === pageSelected}, page.type]"
          class="pages clickable"
          @click="pageSelector(); updatePlayerSelected()"
        >
          {{ page.text }}
        </p>
      </div>
      <div
        class="filtersDiv"
        v-show="pageSelected !== 'inputPoints'"
      >
        <p
          v-for="filter in filters"
          @click="filterSelector(); updatePlayerSelected()"
          :class="[{filterSelected: filter.type === filterSelected}, filter.type]"
          class="filters clickable"
        >
          {{ filter.text }}
        </p>
      </div>
      <Rankings
        v-show="pageSelected === 'rankings'"
        :playerStatsPerGame="playerStatsPerGame"
        :playerRankings="playerRankings"
        :rankingsSnapshots="rankingsSnapshots"
        :filterSelected="filterSelected"
        :playerSelected="playerSelected"
        :pageSelected="pageSelected"
        :updatePlayerSelected="updatePlayerSelected"
        @changePlayerSelected="changePlayerSelected($event)"
        class="component"
        ref="rankings"
      >
    </Rankings>
    <Statistics
    v-show="pageSelected === 'statistics'"
      :playerStats="playerStats"
      :playerStatsPerGame="playerStatsPerGame"
      :filterSelected="filterSelected"
      :playerSelected="playerSelected"
      :pageSelected="pageSelected"
      :max="max"
      :updatePlayerSelected="updatePlayerSelected"
      @changePlayerSelected="changePlayerSelected($event)"
      class="component"
      ref="statistics"
    >
    </Statistics>
    <InputPoints
      v-show="pageSelected === 'inputPoints'"
      :matchCount="matchCount"
      :playerStats="playerStats"
      :playerRankings="playerRankings"
      :rankingsSnapshots="rankingsSnapshots"
      :popUp="popUp"
      @changePopUpDisplayed="changePopUpDisplayed($event)"
      @changePopUpError="changePopUpError($event)"
      @changePopUpMessage="changePopUpMessage($event)"
      @changePageDisplayed="changePageDisplayed($event)"
      class="component"
      ref="inputPoints"
    >
  </InputPoints>
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
import { fbMatchCount2018 } from "./firebase"
import { fbMatchData2018 } from "./firebase"
import { fbRankingsData2018 } from "./firebase"

export default {
  components: {
    "InputPoints": InputPoints,
    "Rankings": Rankings,
    "Statistics": Statistics,
  },
  data() {
    return {
      pages: [
        {type: "rankings", text: "Rankings"},
        {type: "statistics", text: "Statistics"},
        {type: "inputPoints", text: "Input Points"}
      ],
      pageSelected: "rankings",
      filters: [
        {type: "overall", text: "Overall"},
        {type: "four", text: "4 vs 4"},
        {type: "three", text: "3 vs 3"},
        {type: "two", text: "2 vs 2"},
        {type: "one", text: "1 vs 1"}
      ],
      filterSelected: "overall",
      playerSelected: "",
      popUp: {
        displayed: false,
        error: false,
        message: ""
      },
/*      winProbability: {
        outcomes: [
          {value: 0, chance: 0.5},
          {value: 1, chance: 0.5}
        ],
        mean: 0.5
      }
*/
    }
  },
  methods: {
    test() {
    },
    addMatch() {
      fbMatchCount2018.push(this.matchCount2018.length + 1)
      const matchNumber = this.matchCount2018.length
      const matchDataIndex = matchNumber - 1
      const playersPerTeam = (Object.keys(this.matchData[matchDataIndex]).length - 1) / 2
      const playerRankings = this.playerRankings2
      let playerRating = {}
      let winnersPlayerRating = 0
      let losersPlayerRating = 0
      let winValue = 0
      let numberOfZeroes = "00"
      if (matchNumber >= 10) {
        numberOfZeroes = "0"
        if (matchNumber >= 100) {
          numberOfZeroes = ""
        }
      }
      for (let i in this.matchData[matchDataIndex]) { // loop through players in this match
        if (i !== ".key") {
          let isWinner = false
          let isLoser = false
          if (this.matchData[matchDataIndex][i]["wins"] === 1) { // check if winner
            isWinner = true
          } else if (this.matchData[matchDataIndex][i]["losses"] === 1) { // check if loser
            isLoser = true
          }
          if (playerRankings["overall"][i] !== undefined) {
            fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(i).child("playerRating").set(
              playerRankings["overall"][i].playerRating
            )
            playerRating[i] = playerRankings["overall"][i].playerRating
            if (isWinner === true) {
              winnersPlayerRating += playerRankings["overall"][i].playerRating
            } else if (isLoser === true) {
              losersPlayerRating += playerRankings["overall"][i].playerRating
            }
          } else if (playerRankings["overall"][i] === undefined) {
            fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(i).child("playerRating").set(500)
            playerRating[i] = 500
            if (isWinner === true) {
              winnersPlayerRating += 500
            } else if (isLoser === true) {
              losersPlayerRating += 500
            }
          }
          for (let j in this.matchData[matchDataIndex][i]) {
            fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(i).child(j).set(
              this.matchData[matchDataIndex][i][j]
            )
          }
        }
      }
      for (let j in this.matchData[matchDataIndex]) {
        if (j !== ".key") {
          if (this.matchData[matchDataIndex][j]["wins"] === 1) {
            let winnersRating = (winnersPlayerRating - playerRating[j] + 500)
            let winValue = 2 * losersPlayerRating / (winnersRating + losersPlayerRating)
            fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(j).child("winValue").set(winValue)
            fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(j).child("lossValue").set(0)
          } else if (this.matchData[matchDataIndex][j]["losses"] === 1) {
            let losersRating = (losersPlayerRating - playerRating[j] + 500)
            let lossValue = 2 * losersRating / (winnersPlayerRating + losersRating)
            fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(j).child("winValue").set(0)
            fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(j).child("lossValue").set(lossValue)
          }
        }
      }
      return this.updateRankingsSnapshots()
    },
    updateRankingsSnapshots() {
      this.$nextTick(function() {
        const matchNumber = this.matchCount2018.length
        let numberOfZeroes = "00"
        if (matchNumber >= 10) {
          numberOfZeroes = "0"
          if (matchNumber >= 100) {
            numberOfZeroes = ""
          }
        }
        for (let i in this.playerRankings2["overall"]) {
          fbRankingsData2018.child(i).child("totalGamesPlayed").child(`${numberOfZeroes}${matchNumber}`).set({
            gamesPlayed: this.playerRankings2["overall"][i].gamesPlayed,
            playerRating: this.playerRankings2["overall"][i].playerRating,
            winPercentage: this.playerRankings2["overall"][i].winPercentage,
            pointsPerGame: this.playerRankings2["overall"][i].pointsPerGame
          })
        }
      })
    },
    changePopUpDisplayed(e) {
      this.popUp.displayed = e
    },
    changePopUpError(e) {
      this.popUp.error = e
    },
    changePopUpMessage(e) {
      this.popUp.message = e
    },
    changePageDisplayed(e) {
      this.pageDisplayed = e
    },
    changePlayerSelected(e) {
      this.playerSelected = e
    },
    pageSelector() {
      for (let i = 0; i < this.pages.length; i++) {
        if (event.target.innerText === this.pages[i].text) {
          this.pageSelected = this.pages[i].type
        }
      }
    },
    filterSelector() {
      for (let i = 0; i < this.filters.length; i++) {
        if (event.target.innerText === this.filters[i].text) {
          this.filterSelected = this.filters[i].type
        }
      }
    },
    updatePlayerSelected() {
      this.$nextTick(function() {
        for (let i = 0; i < this.playerStats.length; i++) {
          this.$refs.rankings.$refs.table.$refs.row[i].classList.remove("playerSelected")
          this.$refs.statistics.$refs.table.$refs.row[i].classList.remove("playerSelected")
          if (this.$refs.rankings.$refs.table.$refs.row[i].childNodes[0].innerText === this.playerSelected) {
            this.$refs.rankings.$refs.table.$refs.row[i].classList.add("playerSelected")
          }
          if (this.$refs.statistics.$refs.table.$refs.row[i].childNodes[0].innerText === this.playerSelected) {
            this.$refs.statistics.$refs.table.$refs.row[i].classList.add("playerSelected")
          }
        }
      })
    },
    avg(statObject) {
      let total = {}
      let self = {}
      for (let i in statObject) {
        for (let j in statObject[i]) {
          total[j] = 0
        }
      break
      }
      for (let j in statObject) {
        for (let k in statObject[j]) {
          total[k] += statObject[j][k]
        }
      }
      for (let k in total) {
        if (k !== "gamesPlayed") {
          self[k] = total[k] / total.gamesPlayed
        }
      }
      return self
    },
    max(statObject) {
      let self = {}
      for (let i in statObject) {
        for (let j in statObject[i]) {
          self[j] = 0
        }
      break
      }
      for (let j in statObject) {
        for (let k in statObject[j]) {
          if (self[k] < statObject[j][k]) {
            self[k] = statObject[j][k]
          }
        }
      }
      return self
    },
    min(statObject) {
      let self = {}
      for (let i in statObject) {
        for (let j in statObject[i]) {
          self[j] = 10000
        }
      break
      }
      for (let j in statObject) {
        for (let k in statObject[j]) {
          if (self[k] > statObject[j][k]) {
            self[k] = statObject[j][k]
          }
        }
      }
      return self
    },
    normalize(statObject) {
      let self = {}
      const maxGamesPlayed = this.max(statObject).gamesPlayed
      const avgStats = this.avg(statObject)
      for (let i in statObject) {
        self[i] = {}
        const percentOfMax =
          Math.log(statObject[i].gamesPlayed + 1) / Math.log(maxGamesPlayed + 1)
        for (let j in statObject[i]) {
          if (j !== "gamesPlayed") {
            self[i][j] =
              percentOfMax * statObject[i][j] + (1 - percentOfMax) * avgStats[j]
          } else {
            self[i][j] = statObject[i][j]
          }
        }
      }
      return self
    }
    /*
    stochasticityFactor(p) {
      let self = []
      let values = []
      let chances = []
      for (let i = 0; i < 10; i++) {
        let total = 0
        values.push([])
        chances.push([])
        if (i === 0) {
          for (let j = 0; j < p.outcomes.length; j++) {
            values[i].push(p.outcomes[j].value)
            chances[i].push(p.outcomes[j].chance)
          }
        } else if (i > 0) {
          for (let j = 0; j < p.outcomes.length; j++) {
            for (let k = 0; k < values[i - 1].length; k++) {
              values[i].push(values[i - 1][k] + p.outcomes[j].value)
              chances[i].push(chances[i - 1][k] * p.outcomes[j].chance)
            }
          }
        }
        for (let j = 0; j < values[i].length; j++) {
          const valueDeviation = values[i][j] / (i + 1) - p.mean
          total += valueDeviation * valueDeviation * chances[i][j]
        }
        total = 1 - Math.pow(total, 0.5) / p.mean
        self.push(total)
      }
      return self
    },
    */
  },
  computed: {
    matchDataSeparated() {
      let separatedStats = []
      for (let i = 0; i < 4; i++) {
        separatedStats.push([])
        for (let j = 0; j < this.matchData2018.length; j++) {
          if (Object.keys(this.matchData2018[j]).length === (i + 1) * 2 + 1) {
            for (let k in this.matchData2018[j]) {
              if (k !== ".key") {
                separatedStats[i].push({
                  name: k,
                  gamesPlayed: this.matchData2018[j][k].gamesPlayed,
                  wins: this.matchData2018[j][k].wins,
                  winValue: this.matchData2018[j][k].winValue,
                  losses: this.matchData2018[j][k].losses,
                  lossValue: this.matchData2018[j][k].lossValue,
                  finishes: this.matchData2018[j][k].finishes,
                  firstFinishes: this.matchData2018[j][k].firstFinishes,
                  knockOffs: this.matchData2018[j][k].knockOffs,
                  saves: this.matchData2018[j][k].saves,
                  denies: this.matchData2018[j][k].denies
                })
              }
            }
          }
        }
      }
      separatedStats.push([])
      for (let j = 0; j < this.matchData2018.length; j++) {
        for (let k in this.matchData2018[j]) {
          if (k !== ".key") {
            separatedStats[4].push({
              name: k,
              gamesPlayed: this.matchData2018[j][k].gamesPlayed,
              wins: this.matchData2018[j][k].wins,
              winValue: this.matchData2018[j][k].winValue,
              losses: this.matchData2018[j][k].losses,
              lossValue: this.matchData2018[j][k].lossValue,
              finishes: this.matchData2018[j][k].finishes,
              firstFinishes: this.matchData2018[j][k].firstFinishes,
              knockOffs: this.matchData2018[j][k].knockOffs,
              saves: this.matchData2018[j][k].saves,
              denies: this.matchData2018[j][k].denies
            })
          }
        }
      }
      return separatedStats
    },
    playerStats2() {
      let self = {}
      let keys = [
        "one",
        "two",
        "three",
        "four",
        "overall"
      ]
      for (let i = 0; i < 5; i++) {
        self[keys[i]] = {}
        for (let j = 0; j < this.matchDataSeparated[i].length; j++) {
          if (self[keys[i]][this.matchDataSeparated[i][j].name] === undefined) {
            self[keys[i]][this.matchDataSeparated[i][j].name] = {}
            for (let k in this.matchDataSeparated[i][j]) {
              if (k !== "name" && k !== "playerRating") {
                self[keys[i]][this.matchDataSeparated[i][j].name][k] = this.matchDataSeparated[i][j][k]
              }
            }
          } else if (self[keys[i]][this.matchDataSeparated[i][j].name] !== undefined) {
            for (let k in this.matchDataSeparated[i][j]) {
              if (k !== "name" && k !== "playerRating") {
                self[keys[i]][this.matchDataSeparated[i][j].name][k] += this.matchDataSeparated[i][j][k]
              }
            }
          }
        }
      }
      return self
    },
    playerStatsPerGame() {
      let self = []
      const playerStats = this.playerStats
      for (let i = 0; i < playerStats.length; i++) {
        self.push({})
        for (let j in playerStats[i]) {
          if (j !== "name" && j !== "gamesPlayed") {
            self[i][j] = playerStats[i][j] / playerStats[i].gamesPlayed
          } else {
            self[i][j] = playerStats[i][j]
          }
        }
      }
      return self
    },
    computedStats2() {
      let self = {}
      for (let i in this.playerStats2) {
        self[i] = {}
        for (let j in this.playerStats2[i]) {
          self[i][j] = {
            gamesPlayed:
              this.playerStats2[i][j].gamesPlayed,
            winPercentage:
              this.playerStats2[i][j].wins / this.playerStats2[i][j].gamesPlayed * 100,
            weightedWinPercentage:
              this.playerStats2[i][j].winValue / (this.playerStats2[i][j].winValue + this.playerStats2[i][j].lossValue) * 100,
            finishPercentage:
              this.playerStats2[i][j].finishes / this.playerStats2[i][j].gamesPlayed,
            pointsPerGame:
              (
                this.playerStats2[i][j].finishes +
                this.playerStats2[i][j].firstFinishes +
                this.playerStats2[i][j].knockOffs +
                this.playerStats2[i][j].saves +
                this.playerStats2[i][j].denies
              ) / this.playerStats2[i][j].gamesPlayed
          }
        }
      }
      return self
    },
    playerRankings2() {
      let self = {}
      for (let i in this.computedStats2) {
        const nStats = this.normalize(this.computedStats2[i])
        const maxWP = this.max(nStats).weightedWinPercentage
        const minWP = this.min(nStats).weightedWinPercentage
        const maxPPG = this.max(nStats).pointsPerGame
        const minPPG = this.min(nStats).pointsPerGame
        const maxFP = this.max(nStats).finishPercentage
        const minFP = this.min(nStats).finishPercentage
        self[i] = {}
        for (let j in this.computedStats2[i]) {
          self[i][j]= {}
          for (let k in this.computedStats2[i][j]) {
            self[i][j][k] = this.computedStats2[i][j][k]
          }
          if (i !== "overall") {
            self[i][j].playerRating = (
              (nStats[j].weightedWinPercentage - minWP) / (maxWP - minWP) * 500 +
              (nStats[j].pointsPerGame - minPPG) / (maxPPG - minPPG) * 375 +
              (nStats[j].finishPercentage - minFP) / (maxFP - minFP) * 125
            )
          }
        }
      }
      for (let l in self["overall"]) {
        let netPlayerRating = 0
        for (let m in self) {
          if (m !== "overall" && self[m][l] !== undefined) {
            netPlayerRating += self[m][l].playerRating * self[m][l].gamesPlayed
          }
        }
        self["overall"][l].playerRating = netPlayerRating / self["overall"][l].gamesPlayed
      }
      return self
    },
    playerStats() {
      let self = []
      for (let i in this.playerStats2[this.filterSelected]) {
        if (this.playerStats2["overall"][i].gamesPlayed > 4 && this.playerStats2[this.filterSelected][i] !== undefined) {
          self.push({
            name: i,
            gamesPlayed: this.playerStats2[this.filterSelected][i].gamesPlayed,
            wins: this.playerStats2[this.filterSelected][i].wins,
            losses: this.playerStats2[this.filterSelected][i].losses,
            finishes: this.playerStats2[this.filterSelected][i].finishes,
            firstFinishes: this.playerStats2[this.filterSelected][i].firstFinishes,
            knockOffs: this.playerStats2[this.filterSelected][i].knockOffs,
            saves: this.playerStats2[this.filterSelected][i].saves,
            denies: this.playerStats2[this.filterSelected][i].denies
          })
        }
      }
      return self
    },
    playerRankings() {
      let self = []
      for (let i in this.playerRankings2[this.filterSelected]) {
        if (this.playerRankings2["overall"][i].gamesPlayed > 4 && this.playerRankings2[this.filterSelected][i] !== undefined) {
          self.push({
            name: i,
            gamesPlayed: this.playerRankings2[this.filterSelected][i].gamesPlayed,
            winPercentage: this.playerRankings2[this.filterSelected][i].winPercentage,
            weightedWinPercentage: this.playerRankings2[this.filterSelected][i].weightedWinPercentage,
            pointsPerGame: this.playerRankings2[this.filterSelected][i].pointsPerGame,
            playerRating: this.playerRankings2[this.filterSelected][i].playerRating
          })
        }
      }
      return self
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
/*    winCorrelation() {
      let self = []
      let final = []
      for (let i = 0; i < this.matchDataSeparated.length; i++) {
        self.push({
          pointEvents: {
            finishes: 0,
            firstFinishes: 0,
            knockOffs: 0,
            saves: 0,
            denies: 0
          },
          winEvents: {
            finishes: 0,
            firstFinishes: 0,
            knockOffs: 0,
            saves: 0,
            denies: 0
          }
        })
        final.push({
          finishes: 0,
          firstFinishes: 0,
          knockOffs: 0,
          saves: 0,
          denies: 0
        })
        for (let j = 0; j < this.matchDataSeparated[i].length; j++) {
          for (let l in self[i].pointEvents) {
            if (this.matchDataSeparated[i][j][l] > 0) {
              self[i].pointEvents[l]++
              if (this.matchDataSeparated[i][j].wins > 0) {
                self[i].winEvents[l]++
              }
            }
          }
        }
        for (let j in self[i].pointEvents) {
          if (self[i].pointEvents[j] !== 0) {
            final[i][j] = self[i].winEvents[j] / self[i].pointEvents[j]
          } else {
            final[i][j] = 0
          }
        }
      }
      return final
    },
*/
/*    pointProbability() {
      let self = []
      let final = []
      for (let i = 0; i < this.matchDataSeparated.length; i++) {
        self.push({
          finishes: 0,
          firstFinishes: 0,
          knockOffs: 0,
          saves: 0,
          denies: 0,
          gamesPlayed: 0
        })
        final.push({
          finishes: 0,
          firstFinishes: 0,
          knockOffs: 0,
          saves: 0,
          denies: 0
        })
        for (let j = 0; j < this.matchDataSeparated[i].length; j++) {
          for (let k in self[i]) {
            if (this.matchDataSeparated[i][j][k] > 0) {
              self[i][k]++
            }
          }
        }
        for (let j in final[i]) {
          if (self[i].gamesPlayed !== 0) {
            final[i][j] = self[i][j] / self[i].gamesPlayed
          }
        }
      }
      return final
    },
*/
  },
  firebase: {
    matchData: firebaseMatchData,
    matchCount: firebaseMatchCount,
    rankingsData: firebaseRankingsData,
    matchData2018: fbMatchData2018,
    matchCount2018: fbMatchCount2018,
    rankingsData2018: fbRankingsData2018

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
    grid-template-columns: 2fr repeat(5, 1fr) 2fr;
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
  .overall {
    grid-column: 2 / 3;
  }
  .four {
    grid-column: 3 / 4;
  }
  .three {
    grid-column: 4 / 5;
  }
  .two {
    grid-column: 5 / 6;
  }
  .one {
    grid-column: 6 / 7;
  }
</style>
