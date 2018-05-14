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
        {type: "overallRankings", text: "Overall"},
        {type: "lastFiveGames", text: "Last 5 Games"},
        {type: "oneVsOne", text: "1 vs 1"}
      ],
      filterSelected: "overallRankings",
      playerSelected: "",
      popUp: {
        displayed: false,
        error: false,
        message: ""
      },
      winProbability: {
        outcomes: [
          {value: 0, chance: 0.5},
          {value: 1, chance: 0.5}
        ],
        mean: 0.5
      }
    }
  },
  methods: {
    test() {
      console.log(this.testTree2(this.pointsInOneGameProbability))
      console.log(this.testTree2(this.winProbability))
    },
    testTree(p) {
      let self = []
      let total = 0
      let values = []
      let chances = []
      for (let i = 0; i < p.outcomes.length; i++) {
        values.push(p.outcomes[i].value)
        chances.push(p.outcomes[i].chance)
      }
      for (let i = 0; i < values.length; i++) {
        values[i] = values[i] / 1 - p.mean
        total += values[i] * values[i] * chances[i]
      }
      total = 1 - Math.pow(total, 0.5) / p.mean
      self.push(total)
      total = 0
      values = []
      chances = []
      for (let i = 0; i < p.outcomes.length; i++) {
        for (let j = 0; j < p.outcomes.length; j++) {
          values.push(p.outcomes[i].value + p.outcomes[j].value)
          chances.push(p.outcomes[i].chance * p.outcomes[j].chance)
        }
      }
      for (let i = 0; i < values.length; i++) {
        values[i] = values[i] / 2 - p.mean
        total += values[i] * values[i] * chances[i]
      }
      total = 1 - Math.pow(total, 0.5) / p.mean
      self.push(total)
      total = 0
      values = []
      chances = []
      for (let i = 0; i < p.outcomes.length; i++) {
        for (let j = 0; j < p.outcomes.length; j++) {
          for (let k = 0; k < p.outcomes.length; k++) {
            values.push(p.outcomes[i].value + p.outcomes[j].value + p.outcomes[k].value)
            chances.push(p.outcomes[i].chance * p.outcomes[j].chance * p.outcomes[k].chance)
          }
        }
      }
      for (let i = 0; i < values.length; i++) {
        values[i] = values[i] / 3 - p.mean
        total += values[i] * values[i] * chances[i]
      }
      total = 1 - Math.pow(total, 0.5) / p.mean
      self.push(total)
      total = 0
      values = []
      chances = []
      for (let i = 0; i < p.outcomes.length; i++) {
        for (let j = 0; j < p.outcomes.length; j++) {
          for (let k = 0; k < p.outcomes.length; k++) {
            for (let l = 0; l < p.outcomes.length; l++) {
              values.push(p.outcomes[i].value + p.outcomes[j].value + p.outcomes[k].value + p.outcomes[l].value)
              chances.push(p.outcomes[i].chance * p.outcomes[j].chance * p.outcomes[k].chance * p.outcomes[l].chance)
            }
          }
        }
      }
      for (let i = 0; i < values.length; i++) {
        values[i] = values[i] / 4 - p.mean
        total += values[i] * values[i] * chances[i]
      }
      total = 1 - Math.pow(total, 0.5) / p.mean
      self.push(total)
      total = 0
      values = []
      chances = []
      for (let i = 0; i < p.outcomes.length; i++) {
        for (let j = 0; j < p.outcomes.length; j++) {
          for (let k = 0; k < p.outcomes.length; k++) {
            for (let l = 0; l < p.outcomes.length; l++) {
              for (let m = 0; m < p.outcomes.length; m++) {
                values.push(p.outcomes[i].value + p.outcomes[j].value + p.outcomes[k].value + p.outcomes[l].value + p.outcomes[m].value)
                chances.push(p.outcomes[i].chance * p.outcomes[j].chance * p.outcomes[k].chance * p.outcomes[l].chance * p.outcomes[m].chance)
              }
            }
          }
        }
      }
      for (let i = 0; i < values.length; i++) {
        values[i] = values[i] / 5 - p.mean
        total += values[i] * values[i] * chances[i]
      }
      total = 1 - Math.pow(total, 0.5) / p.mean
      self.push(total)
      total = 0
      values = []
      chances = []
      for (let i = 0; i < p.outcomes.length; i++) {
        for (let j = 0; j < p.outcomes.length; j++) {
          for (let k = 0; k < p.outcomes.length; k++) {
            for (let l = 0; l < p.outcomes.length; l++) {
              for (let m = 0; m < p.outcomes.length; m++) {
                for (let n = 0; n < p.outcomes.length; n++) {
                  values.push(p.outcomes[i].value + p.outcomes[j].value + p.outcomes[k].value + p.outcomes[l].value + p.outcomes[m].value + p.outcomes[n].value)
                  chances.push(p.outcomes[i].chance * p.outcomes[j].chance * p.outcomes[k].chance * p.outcomes[l].chance * p.outcomes[m].chance * p.outcomes[n].chance)
                }
              }
            }
          }
        }
      }
      for (let i = 0; i < values.length; i++) {
        values[i] = values[i] / 6 - p.mean
        total += values[i] * values[i] * chances[i]
      }
      total = 1 - Math.pow(total, 0.5) / p.mean
      self.push(total)
      return self
    },
    testTree2(p) {
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
    normalize1(statArray) {
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
        const percentOfMax = player.gamesPlayed / maxGamesPlayed
        const meanOverMax = avgGamesPlayed / maxGamesPlayed
        const relevance = Math.pow(percentOfMax, meanOverMax)
        for (let stat in player) {
          if (stat !== "name" && stat !== "gamesPlayed") {
            if (player.gamesPlayed > 6) {
              player[stat] = relevance * player[stat] + (1 - relevance) * avgStats[stat]
            } else if (player.gamesPlayed <= 6) {
              if (stat === "winPercentage") {
                const significance = this.testTree(this.winProbability)[player.gamesPlayed]
                player[stat] = relevance * significance * player[stat] + (1 - relevance * significance) * avgStats[stat]
              } else if (stat === "pointsPerGame") {
                const significance = this.testTree(this.pointsInOneGameProbability)[player.gamesPlayed]
                player[stat] = relevance * significance * player[stat] + (1 - relevance * significance) * avgStats[stat]
              }
            }
          }
        }
        return player
      })
    },
    normalize(statArray) {
      const maxGamesPlayed = this.max(statArray).gamesPlayed
      const avgGamesPlayed = this.avg(statArray).gamesPlayed
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
        const percentOfMax = Math.log(player.gamesPlayed) / Math.log(maxGamesPlayed)
        for (let stat in player) {
          if (stat !== "name" && stat !== "gamesPlayed") {
            player[stat] = percentOfMax * player[stat] + (1 - percentOfMax) * avgStats[stat]
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
      if (this.filterSelected === "overallRankings") {
        filteredStats = this.playerStatsOverall
      } else if (this.filterSelected === "lastFiveGames") {
        filteredStats = this.playerStatsLastFiveGames
      } else if (this.filterSelected === "oneVsOne") {
        filteredStats = this.playerStatsOneVsOne
      }
      for (let i = 0; i < filteredStats.length; i++) {
        self.push({...filteredStats[i]})
      }
      return self
    },
    totalStats() {
      let self = {}
      for (let i in this.matchData[0]["Jeff"]) {
         self[i] = 0
      }
      for (let i = 0; i < this.matchData.length; i++) {
        for (let j in this.matchData[i]) {
          if (j !== ".key") {
            for (let k in this.matchData[i][j]) {
              self[k] += this.matchData[i][j][k]
            }
          }
        }
      }
      return self
    },
    playerStatsOverall() {
      let mergedStats = []
      let finalStats = []
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
      for (let i = 0; i < mergedStats.length; i++) {
        if (mergedStats[i].gamesPlayed > 4) {
          finalStats.push(mergedStats[i])
        }
      }
      return finalStats
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
    newPlayerStats() {
      let separatedStats = []
      for (let m = 1; m <= 6; m++) { // 1 to 6 players per team
        let mergedStats = []
        let nameMatch = false
        for (let i = 0; i < this.matchData.length; i++) {
          if (Object.keys(this.matchData[i]).length === m * 2 + 1) { // total players = players per team * 2, added + 1 for ".key" in firebase
            for (let j in this.matchData[i]) {
              if (j !== ".key") {
                for (let k = 0; k < mergedStats.length; k++) {
                  if (j === mergedStats[k].name) {
                    for (let l in mergedStats[k]) {
                      if (l !== "name") {
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
        separatedStats.push(mergedStats)
      }
      return separatedStats
    },
    avgPointsPerGame() {
      let totalGames = 0
      let totalPoints = 0
      for (let i = 0; i < this.matchData.length; i++) {
        for (let j in this.matchData[i]) {
          if (j !== ".key") {
            totalGames += 1
            totalPoints += this.matchData[i][j].finishes
            totalPoints += this.matchData[i][j].firstFinishes
            totalPoints += this.matchData[i][j].knockOffs
            totalPoints += this.matchData[i][j].saves
            totalPoints += this.matchData[i][j].denies
          }
        }
      }
      return totalPoints / totalGames
    },
    pointsInOneGameProbability() {
      let total = 0
      let self = {}
      let test = []
      let test2  = {
        outcomes: [],
        mean: this.avg(this.computedStats).pointsPerGame
      }
      for (let i = 0; i < this.matchData.length; i++) {
        for (let j in this.matchData[i]) {
          if (j !== ".key") {
            total += 1
            let points = 0
            points += this.matchData[i][j].finishes
            points += this.matchData[i][j].firstFinishes
            points += this.matchData[i][j].knockOffs
            points += this.matchData[i][j].saves
            points += this.matchData[i][j].denies
            if (self[`p${points}`] > 0) {
              self[`p${points}`] += 1
              test[points] += 1
            } else {
              self[`p${points}`] = 1
              test[points] = 1
            }
          }
        }
      }
      for (let i in self) {
        self[i] /= total
      }
      for (let i = 0; i < test.length; i++) {
        test[i] /= total
        test2.outcomes.push({
          value: i,
          chance: test[i]
        })
      }
      return test2
    },
    winCorrelation() {
      let self = {
        events: {
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
        },
        correlation: {
          finishes: 0,
          firstFinishes: 0,
          knockOffs: 0,
          saves: 0,
          denies: 0
        }
      }
      for (let i = 0; i < this.matchData.length; i++) {
        for (let j in this.matchData[i]) {
          if (j !== ".key") {
            for (let k in self.events) {
              if (this.matchData[i][j][k] > 0) {
                self.events[k] += 1
                if (this.matchData[i][j].wins > 0) {
                  self.winEvents[k] += 1
                }
              }
            }
          }
        }
      }
      for (let i in self.events) {
        self.correlation[i] = self.winEvents[i] / self.events[i]
      }
      return self.correlation
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
      let playerStats = [...this.playerStats]
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
      const normalizedStats = this.normalize(this.computedStats)
      const maxWinPercentage = this.max(normalizedStats).winPercentage
      const maxPointsPerGame = this.max(normalizedStats).pointsPerGame
      for (let i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
          gamesPlayed: this.playerStats[i].gamesPlayed,
          playerRating: (
            (
              normalizedStats[i].winPercentage / maxWinPercentage
              + normalizedStats[i].pointsPerGame / maxPointsPerGame
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
