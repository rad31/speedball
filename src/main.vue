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
        :filterSelected="filterSelected"
        :playerSelected="playerSelected"
        :pageSelected="pageSelected"
        :rankingsSnapshots="rankingsSnapshots"
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
      :popUp="popUp"
      @changePopUpDisplayed="changePopUpDisplayed($event)"
      @changePopUpError="changePopUpError($event)"
      @changePopUpMessage="changePopUpMessage($event)"
      @changePageDisplayed="changePageDisplayed($event)"
      @updateStats="updateStats($event)"
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
import { fbStochasticityFactors2018 } from "./firebase"

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
        {type: "Overall", text: "Overall"},
        {type: "Four", text: "4 vs 4"},
        {type: "Three", text: "3 vs 3"},
        {type: "Two", text: "2 vs 2"},
        {type: "One", text: "1 vs 1"}
      ],
      filterSelected: "Overall",
      playerSelected: "",
      popUp: {
        displayed: false,
        error: false,
        message: ""
      },
      winDistribution: {
        "One": {0: 0.5, 1: 0.5, avg: 0.5},
        "Two": {0: 0.5, 1: 0.5, avg: 0.5},
        "Three": {0: 0.5, 1: 0.5, avg: 0.5},
        "Four": {0: 0.5, 1: 0.5, avg: 0.5}
      }
    }
  },
  methods: {
    test() {
    },
    updateStats(e) {
      if (e === true) {
        this.addMatch()
      }
    },
    addMatch() {
      this.$nextTick(function() {
        fbMatchCount2018.push(this.matchCount2018.length + 1)
        const matchNumber = this.matchCount2018.length
        const matchDataIndex = matchNumber - 1
        const playersPerTeam = (Object.keys(this.matchData[matchDataIndex]).length - 1) / 2
        const playerRankings = this.playerRankings3
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
        for (let i in this.matchData[matchDataIndex]) {
          if (i !== ".key") {
            let isWinner = false
            let isLoser = false
            if (this.matchData[matchDataIndex][i]["wins"] === 1) {
              isWinner = true
            } else if (this.matchData[matchDataIndex][i]["losses"] === 1) {
              isLoser = true
            }
            if (playerRankings["Overall"][i] !== undefined) {
              fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(i).child("playerRatingOverall").set(
                playerRankings["Overall"][i].playerRating
              )
              playerRating[i] = playerRankings["Overall"][i].playerRating
              if (isWinner === true) {
                winnersPlayerRating += playerRankings["Overall"][i].playerRating
              } else if (isLoser === true) {
                losersPlayerRating += playerRankings["Overall"][i].playerRating
              }
            } else if (playerRankings["Overall"][i] === undefined) {
              fbMatchData2018.child(`match${numberOfZeroes}${matchNumber}`).child(i).child("playerRatingOverall").set(500)
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
        this.updateRankingsSnapshots()
      })
    },
    updateStochasticityFactors() { // should be run separately from match input
        const ppgFactors = this.stochasticityFactor2(this.pointsPerGameDistribution)
        const finishFactors = this.stochasticityFactor2(this.finishDistribution)
        if (this.stochasticityFactors2018["pointsPerGame"] !== undefined) {
          fbStochasticityFactors2018.remove("pointsPerGame")
          fbStochasticityFactors2018.remove("finishPercentage")
        }
        for (let j in ppgFactors) {
          for (let k in ppgFactors[j]) {
            fbStochasticityFactors2018.child("pointsPerGame").child(j).child(k).set(ppgFactors[j][k])
          }
        }
        for (let l in finishFactors) {
          for (let m in finishFactors[l]) {
            fbStochasticityFactors2018.child("finishPercentage").child(l).child(m).set(finishFactors[l][m])
          }
        }
        const winFactors = this.stochasticityFactor2(this.winDistribution)
        for (let n in winFactors) {
          for (let o in winFactors[n]) {
           fbStochasticityFactors2018.child("winPercentage").child(n).child(o).set(winFactors[n][o])
          }
        }
    },
    updateRankingsSnapshots() {
      this.$nextTick(function() {
        const matchNumber = this.matchCount2018.length
        const playersPerTeam = (Object.keys(this.matchData2018[matchNumber - 1]).length - 1) / 2
        let playersSuffix = null
        switch (playersPerTeam) {
          case 1:
            playersSuffix = "One"
            break
          case 2:
            playersSuffix = "Two"
            break
          case 3:
            playersSuffix = "Three"
            break
          case 4:
            playersSuffix= "Four"
            break
        }
        let numberOfZeroes = "00"
        if (matchNumber >= 10) {
          numberOfZeroes = "0"
          if (matchNumber >= 100) {
            numberOfZeroes = ""
          }
        }
        for (let i in this.matchData2018[matchNumber - 1]) {
          if (i !== ".key") {
            fbRankingsData2018.child(playersSuffix).child(i).child("gamesPlayed").push(this.playerRankings3[playersSuffix][i].gamesPlayed)
            fbRankingsData2018.child(playersSuffix).child(i).child("playerRating").push(this.playerRankings3[playersSuffix][i].playerRating)
            fbRankingsData2018.child(playersSuffix).child(i).child("winPercentage").push(this.playerRankings3[playersSuffix][i].winPercentage)
            fbRankingsData2018.child(playersSuffix).child(i).child("pointsPerGame").push(this.playerRankings3[playersSuffix][i].pointsPerGame)
            fbRankingsData2018.child("Overall").child(i).child("gamesPlayed").push(this.playerRankings3["Overall"][i].gamesPlayed)
            fbRankingsData2018.child("Overall").child(i).child("playerRating").push(this.playerRankings3["Overall"][i].playerRating)
            fbRankingsData2018.child("Overall").child(i).child("winPercentage").push(this.playerRankings3["Overall"][i].winPercentage)
            fbRankingsData2018.child("Overall").child(i).child("pointsPerGame").push(this.playerRankings3["Overall"][i].pointsPerGame)
          }
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
      for (let j in statObject) {
        for (let k in statObject[j]) {
          if (total[k] !== undefined) {
            total[k] += statObject[j][k]
          } else if (total[k] === undefined) {
            total[k] = statObject[j][k]
          }
        }
      }
      for (let m in total) {
        self[m] = total[m] / total.gamesPlayed
      }
      return self
    },
    max(statObject) {
      let self = {}
      for (let j in statObject) {
        for (let k in statObject[j]) {
          self[k] = 0
        }
        break
      }
      for (let m in statObject) {
        for (let n in statObject[m]) {
          if (self[n] < statObject[m][n]) {
            self[n] = statObject[m][n]
          }
        }
      }
      return self
    },
    min(statObject) {
      let self = {}
      for (let j in statObject) {
        for (let k in statObject[j]) {
          self[k] = 10000
        }
        break
      }
      for (let m in statObject) {
        for (let n in statObject[m]) {
          if (self[n] > statObject[m][n]) {
            self[n] = statObject[m][n]
          }
        }
      }
      return self
    },
    avg2(statObject) {
      let total = {}
      let self = {}
      for (let i in statObject) {
        total[i] = {}
        for (let j in statObject[i]) {
          for (let k in statObject[i][j]) {
            if (total[i][k] !== undefined) {
              total[i][k] += statObject[i][j][k]
            } else if (total[i][k] === undefined) {
              total[i][k] = statObject[i][j][k]
            }
          }
        }
      }
      for (let l in total) {
        self[l] = {}
        for (let m in total[l]) {
          self[l][m] = total[l][m] / total[l].gamesPlayed
        }
      }
      return self
    },
    max2(statObject) {
      let self = {}
      for (let i in statObject) {
        self[i] = {}
        for (let j in statObject[i]) {
          for (let k in statObject[i][j]) {
            self[i][k] = 0
          }
          break
        }
      }
      for (let l in statObject) {
        for (let m in statObject[l]) {
          for (let n in statObject[l][m]) {
            if (self[l][n] < statObject[l][m][n]) {
              self[l][n] = statObject[l][m][n]
            }
          }
        }
      }
      return self
    },
    min2(statObject) {
      let self = {}
      for (let i in statObject) {
        self[i] = {}
        for (let j in statObject[i]) {
          for (let k in statObject[i][j]) {
            self[i][k] = 10000
          }
          break
        }
      }
      for (let l in statObject) {
        for (let m in statObject[l]) {
          for (let n in statObject[l][m]) {
            if (self[l][n] > statObject[l][m][n]) {
              self[l][n] = statObject[l][m][n]
            }
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
    },
    normalize2(statObject) {
      let self = {}
      const avgStats = this.avg2(statObject)
      const stats = statObject
      if (this.stochasticityFactors2018.length === 3) { // dealing with error on load
        const factors = this.stochasticityFactors2018
        for (let i in stats) {
          if (Object.keys(stats[i]).length !== 0 && i !== "Overall") {
            self[i] = {}
            for (let j in stats[i]) {
              self[i][j] = {}
              for (let k in stats[i][j]) {
                if (k === "winPercentage" || k === "weightedWinPercentage") {
                  self[i][j][k] =
                    factors[0][i][stats[i][j]["gamesPlayed"] + 1] * stats[i][j][k] +
                    (1 - factors[0][i][stats[i][j]["gamesPlayed"] + 1]) * avgStats[i][k]
                } else if (k === "pointsPerGame") {
                  if (factors[1][i][stats[i][j]["gamesPlayed"]] !== 0) {
                    self[i][j][k] =
                      factors[1][i][stats[i][j]["gamesPlayed"]] * stats[i][j][k] +
                      (1 - factors[1][i][stats[i][j]["gamesPlayed"]]) * avgStats[i][k]
                  } else {
                    self[i][j][k] =
                      factors[1][i][stats[i][j]["gamesPlayed"] + 1] * stats[i][j][k] +
                      (1 - factors[1][i][stats[i][j]["gamesPlayed"] + 1]) * avgStats[i][k]
                  }
                } else if (k === "finishPercentage") {
                  if (factors[2][i][stats[i][j]["gamesPlayed"]] !== 0) {
                    self[i][j][k] =
                      factors[2][i][stats[i][j]["gamesPlayed"]] * stats[i][j][k] +
                      (1 - factors[2][i][stats[i][j]["gamesPlayed"]]) * avgStats[i][k]
                  } else {
                    self[i][j][k] =
                      factors[2][i][stats[i][j]["gamesPlayed"] + 1] * stats[i][j][k] +
                      (1 - factors[2][i][stats[i][j]["gamesPlayed"] + 1]) * avgStats[i][k]
                  }
                } else {
                  self[i][j][k] = stats[i][j][k]
                }
              }
            }
          }
        }
      }
      return self
    },
    stochasticityFactor2(stat) {
      let self = {}
      for (let i in stat) {
        let total = {}
        self[i] = {}
        const avgValue = stat[i]["avg"]
        let values = []
        let chances = []
        for (let j in stat[i]) {
          if (j !== "avg") {
            values.push(parseInt(j))
            chances.push(stat[i][j])
          }
        }
        for (let k = 1; k <= 500; k++) {
          total[k] = {}
          if (k === 1) {
//            if (values.length === 0) {
//              break
//            } else if (values.length < 0) {
              for (let l = 0; l < values.length; l++) {
                total[k][l] = chances[l]
              }
//            }
          } else if (k !== 1) {
            for (let m in total[k - 1]) {
              for (let n = 0; n < values.length; n++) {
                if (total[k][parseInt(m) + values[n]] === undefined) {
                  total[k][parseInt(m) + values[n]] = total[k - 1][m] * chances[n]
                } else if (total[k][parseInt(m) + values[n]] !== undefined) {
                  total[k][parseInt(m) + values[n]] += total[k - 1][m] * chances[n]
                }
              }
            }
          }
        }
        for (let o = 1; o <= 500; o++) {
          let avgDeviation = 0
          for (let p in total[o]) {
            const valueDeviation = parseInt(p) / o - avgValue
            avgDeviation += valueDeviation * valueDeviation * total[o][p]
          }
          self[i][o] = 1 - Math.pow(avgDeviation, 0.5) / avgValue
          if (self[i][o] >= 0.95) {
            break
          }
        }
      }
      return self
    }
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
      for (let l = 0; l < this.matchData2018.length; l++) {
        for (let m in this.matchData2018[l]) {
          if (m !== ".key") {
            separatedStats[4].push({
              name: m,
              gamesPlayed: this.matchData2018[l][m].gamesPlayed,
              wins: this.matchData2018[l][m].wins,
              winValue: this.matchData2018[l][m].winValue,
              losses: this.matchData2018[l][m].losses,
              lossValue: this.matchData2018[l][m].lossValue,
              finishes: this.matchData2018[l][m].finishes,
              firstFinishes: this.matchData2018[l][m].firstFinishes,
              knockOffs: this.matchData2018[l][m].knockOffs,
              saves: this.matchData2018[l][m].saves,
              denies: this.matchData2018[l][m].denies
            })
          }
        }
      }
      return separatedStats
    },
    playerStats2() {
      let self = {}
      let keys = [
        "One",
        "Two",
        "Three",
        "Four",
        "Overall"
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
        const nStats = this.computedStats2[i]
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
          if (i !== "Overall") {
            self[i][j].playerRating = (
              (nStats[j].weightedWinPercentage - minWP) / (maxWP - minWP) * 500 +
              (nStats[j].pointsPerGame - minPPG) / (maxPPG - minPPG) * 375 +
              (nStats[j].finishPercentage - minFP) / (maxFP - minFP) * 125
            )
          }
        }
      }
      for (let l in self["Overall"]) {
        let netPlayerRating = 0
        for (let m in self) {
          if (m !== "Overall" && self[m][l] !== undefined) {
            netPlayerRating += self[m][l].playerRating * self[m][l].gamesPlayed
          }
        }
        self["Overall"][l].playerRating = netPlayerRating / self["Overall"][l].gamesPlayed
      }
      return self
    },
    playerRankings3() {
      let self = {}
      const computedStats = this.computedStats2
      const nStats = this.normalize2(computedStats)
      for (let i in nStats) {
        const maxWP = this.max2(nStats)[i].weightedWinPercentage
        const minWP = this.min2(nStats)[i].weightedWinPercentage
        const maxPPG = this.max2(nStats)[i].pointsPerGame
        const minPPG = this.min2(nStats)[i].pointsPerGame
        const maxFP = this.max2(nStats)[i].finishPercentage
        const minFP = this.min2(nStats)[i].finishPercentage
        self[i] = {}
        for (let j in computedStats[i]) {
          self[i][j] = {}
          for (let k in computedStats[i][j]) {
            self[i][j][k] = computedStats[i][j][k]
          }
          self[i][j].playerRating = (
            (nStats[i][j].weightedWinPercentage - minWP) / (maxWP - minWP) * 500 +
            (nStats[i][j].pointsPerGame - minPPG) / (maxPPG - minPPG) * 375 +
            (nStats[i][j].finishPercentage - minFP) / (maxFP - minFP) * 125
          )
        }
      }
      self["Overall"] = {}
      for (let l in computedStats["Overall"]) {
        self["Overall"][l] = {}
        for (let m in computedStats["Overall"][l]) {
          self["Overall"][l][m] = computedStats["Overall"][l][m]
        }
      }
      for (let n in self["Overall"]) {
        let netPlayerRating = 0
        for (let o in self) {
          if (o !== "Overall" && self[o][n] !== undefined) {
            netPlayerRating += self[o][n].playerRating * self[o][n].gamesPlayed
          }
        }
        self["Overall"][n].playerRating = netPlayerRating / self["Overall"][n].gamesPlayed
      }
      return self
    },
    playerStats() {
      let self = []
      for (let i in this.playerStats2[this.filterSelected]) {
        if (this.playerStats2["Overall"][i].gamesPlayed > 4 && this.playerStats2[this.filterSelected][i] !== undefined) {
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
      for (let i in this.playerRankings3[this.filterSelected]) {
        if (this.playerRankings3["Overall"][i].gamesPlayed > 4 && this.playerRankings3[this.filterSelected][i] !== undefined) {
          self.push({
            name: i,
            gamesPlayed: this.playerRankings3[this.filterSelected][i].gamesPlayed,
            winPercentage: this.playerRankings3[this.filterSelected][i].winPercentage,
            weightedWinPercentage: this.playerRankings3[this.filterSelected][i].weightedWinPercentage,
            pointsPerGame: this.playerRankings3[this.filterSelected][i].pointsPerGame,
            playerRating: this.playerRankings3[this.filterSelected][i].playerRating
          })
        }
      }
      return self
    },
    pointsPerGameDistribution() {
      let self = {}
      let keys = [
        "One",
        "Two",
        "Three",
        "Four"
      ]
      for (let i = 0; i < this.matchDataSeparated.length - 1; i++) {
        self[keys[i]] = {}
        let games = 0
        let average = 0
        for (let j in this.matchDataSeparated[i]) {
          const points =
            this.matchDataSeparated[i][j].finishes +
            this.matchDataSeparated[i][j].firstFinishes +
            this.matchDataSeparated[i][j].knockOffs +
            this.matchDataSeparated[i][j].saves +
            this.matchDataSeparated[i][j].denies
          if (self[keys[i]][points] === undefined) {
            self[keys[i]][points] = 1
          } else if (self[keys[i]][points] !== undefined) {
            self[keys[i]][points] += 1
          }
          games++
        }
        for (let k in self[keys[i]]) {
          self[keys[i]][k] /= games
          average += parseInt(k) * self[keys[i]][k]
        }
        self[keys[i]]["avg"] = average
      }
      for (let l in self) {
        if (self[l][1] === undefined) {
          delete self[l]
        }
      }
      return self
    },
    finishDistribution() {
      let self = {}
      let keys = [
        "One",
        "Two",
        "Three",
        "Four"
      ]
      for (let i = 0; i < this.matchDataSeparated.length - 1; i++) {
        self[keys[i]] = {}
        let games = 0
        let average = 0
        for (let j in this.matchDataSeparated[i]) {
          const finishes = this.matchDataSeparated[i][j].finishes
          if (self[keys[i]][finishes] === undefined) {
            self[keys[i]][finishes] = 1
          } else if (self[keys[i]][finishes] !== undefined) {
            self[keys[i]][finishes] += 1
          }
          games++
        }
        for (let k in self[keys[i]]) {
          self[keys[i]][k] /= games
          average += parseInt(k) * self[keys[i]][k]
        }
        self[keys[i]]["avg"] = average
      }
      for (let l in self) {
        if (self[l][1] === undefined) {
          delete self[l]
        }
      }
      return self
    },
    rankingsSnapshots() {
      let self = {}
      for (let i = 0; i < this.rankingsData2018.length; i++) {
        if (this.rankingsData2018[i][".key"] === this.filterSelected) {
          self[this.rankingsData2018[i][".key"]] = {}
          for (let j in this.rankingsData2018[i]) {
            if (j !== ".key") {
              self[this.rankingsData2018[i][".key"]][j] = {}
              for (let k in this.rankingsData2018[i][j]) {
                self[this.rankingsData2018[i][".key"]][j][k] = [0]
                for (let l in this.rankingsData2018[i][j][k]) {
                  self[this.rankingsData2018[i][".key"]][j][k].push(this.rankingsData2018[i][j][k][l])
                }
              }
            }
          }
        }
      }
      return self
    }
  },
  firebase: {
    matchData: firebaseMatchData,
    matchCount: firebaseMatchCount,
    rankingsData: firebaseRankingsData,
    matchData2018: fbMatchData2018,
    matchCount2018: fbMatchCount2018,
    rankingsData2018: fbRankingsData2018,
    stochasticityFactors2018: fbStochasticityFactors2018
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
  .Overall {
    grid-column: 2 / 3;
  }
  .Four {
    grid-column: 3 / 4;
  }
  .Three {
    grid-column: 4 / 5;
  }
  .Two {
    grid-column: 5 / 6;
  }
  .One {
    grid-column: 6 / 7;
  }
</style>
