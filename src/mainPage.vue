<template>
  <div>
    <div class='mainDiv'>
      <p class='title'>National Speedball League</p>
      <div class='pagesDiv'>
        <p class='rankings pages clickable' @click='pageSelector(rankings)'>Rankings</p>
        <p class='statistics pages clickable' @click='pageSelector(statistics)'>Statistics</p>
        <p class='inputPoints pages clickable' @click='pageSelector(inputPoints)'>Input Points</p>
      </div>
      <component
        :is='component'
        :playerStats='playerStats'
        :completePlayerStats='completePlayerStats'
        :computedStats='computedStats'
        :completeComputedStats='completeComputedStats'
        :normalizedStats='normalizedStats'
      ></component>
    </div>
  </div>
</template>

<script>
import inputPoints from './components/inputPoints/inputPoints.vue'
import rankings from './components/rankings/rankings.vue'
import statistics from './components/statistics/statistics.vue'
import { firebasePlayerStats } from'./firebase'


export default {

  components: {
    'inputPoints': inputPoints,
    'rankings': rankings,
    'statistics': statistics,
  },

  data() {
    return {
      component: 'inputPoints',
      selected: 'selected',
      notSelected: '',
      rankings: 'rankings',
      statistics: 'statistics',
      inputPoints: 'inputPoints'
    }
  },

  methods: {
    pageSelector(page) {
      this.component = page
    }
  },

  computed: {
    averageGamesPlayed() {
      var self = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        self += this.playerStats[i].gamesPlayed
      }
      return self / this.playerStats.length
    },
    maxGamesPlayed() {
      var self = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        if (self < this.playerStats[i].gamesPlayed) {
          self = this.playerStats[i].gamesPlayed
        }
      }
      return self
    },
    computedStats() {
      var self = []
      for (var i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
          playerRating: 0,
          winPercentage: 0,
        })
      }
      for (var i = 0; i < this.playerStats.length; i++) {
        self[i].winPercentage = (
          this.playerStats[i].wins / this.playerStats[i].gamesPlayed
        ) * 100
        self[i].pointsPerGame = (
          this.playerStats[i].beersFinished
          + this.playerStats[i].knockOffs
          + this.playerStats[i].firstFinishes
          + this.playerStats[i].canCatches
          + this.playerStats[i].ballCatches
        ) / this.playerStats[i].gamesPlayed
      }
      return self
    },
    averageWinPercentage() {
      var self = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        self += this.computedStats[i].winPercentage
      }
      return self / this.playerStats.length
    },
    averagePointsPerGame() {
      var self = 0
      for (var i = 0; i < this.playerStats.length; i++) {
        self += this.computedStats[i].pointsPerGame
      }
      return self / this.playerStats.length
    },
    normalizedStats() {
      var self = []
      for (var i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
          winPercentage: 0,
          pointsPerGame: 0
        })
      }
      for (var i = 0; i < this.playerStats.length; i++) {
        if (this.playerStats[i].gamesPlayed > this.averageGamesPlayed) {
          self[i].pointsPerGame = (
            this.averageGamesPlayed / this.playerStats[i].gamesPlayed *
            (
              this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].pointsPerGame
              + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
            )
              + (1 - this.averageGamesPlayed / this.playerStats[i].gamesPlayed) * this.computedStats[i].pointsPerGame
          )
          self[i].winPercentage = (
            this.averageGamesPlayed / this.playerStats[i].gamesPlayed
            * (
                this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].winPercentage
                + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
              )
              + (1 - this.averageGamesPlayed / this.playerStats[i].gamesPlayed) * this.computedStats[i].winPercentage
          )
        } else {
          self[i].pointsPerGame = (
            this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].pointsPerGame
            + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
          )
          self[i].winPercentage = (
            this.playerStats[i].gamesPlayed / this.maxGamesPlayed * this.computedStats[i].winPercentage
            + (1 - this.playerStats[i].gamesPlayed / this.maxGamesPlayed) * this.averagePointsPerGame
          )
        }
      }
      return self
    },
    maxNormalizedWinPercentage() {
      var self = 0
      for (var i = 0; i < this.normalizedStats.length; i++) {
        if (self < this.normalizedStats[i].winPercentage) {
          self = this.normalizedStats[i].winPercentage
        }
      }
      return self
    },
    maxNormalizedPointsPerGame() {
      var self = 0
      for (var i = 0; i < this.normalizedStats.length; i++) {
        if (self < this.normalizedStats[i].pointsPerGame) {
          self = this.normalizedStats[i].pointsPerGame
        }
      }
      return self
    },
    completeComputedStats() {
      var self = []
      for (var i = 0; i < this.playerStats.length; i++) {
        self.push({
          name: this.playerStats[i].name,
          playerRating: 0,
          winPercentage: 0,
          pointsPerGame: 0
        })
      }
      for (var i = 0; i < this.playerStats.length; i++) {
        self[i].playerRating =
          (
            (
              this.normalizedStats[i].winPercentage / this.maxNormalizedWinPercentage
              + this.normalizedStats[i].pointsPerGame / this.maxNormalizedPointsPerGame
            ) * 500
          ).toFixed(0)
        self[i].winPercentage = this.computedStats[i].winPercentage.toFixed(1)
        self[i].pointsPerGame = this.computedStats[i].pointsPerGame.toFixed(2)
      }
      return self
    },
    completePlayerStats() {
      var self = []
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
      return self
    }
  },

  firebase: {
    playerStats: firebasePlayerStats
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Antic|Josefin+Sans|Taviraj');

p, input, td, th {
  align-content: center;
  color: #111111;
  font-size: 10px;
  font-weight: lighter;
  font-family: 'Antic', sans-serif;
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  margin: 0;
  padding: 8px;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  border-width: 0;
  min-width: 40px;
}

table {
  align-content: center;
  color: #111111;
  font-size: 10px;
  font-weight: lighter;
  font-family: 'Antic', sans-serif;
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
  background: #eeeeee;
  align-content: center;
  margin: auto;
}

</style>

<style scoped>

.title {
  font-size: 24px;
  font-weight: normal;
  background: #eeeeee;
  padding: 20px;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
}

.clickable {
  cursor: pointer;
}

.pagesDiv {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-top: 5px;
  background: #eeeeee;
}

.pages {
  font-size: 12px;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.rankings {
  background: #89c32b;
}

.statistics {
  background: #2baac3;
}

.inputPoints {
  background: #c3412b;
}

.clickable:hover {
  font-weight: bold;
}

</style>
