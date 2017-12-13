<template>
    <div class='mainDiv'>
      <p @click='test' class='title'>National Speedball League</p>
      <div class='pagesDiv'>
        <p class='rankings pages clickable' @click='pageSelector(rankings)'>Rankings</p>
        <p class='statistics pages clickable' @click='pageSelector(statistics)'>Statistics</p>
        <p class='inputPoints pages clickable' @click='pageSelector(inputPoints)'>Input Points</p>
      </div>
      <component :is='component' :playerStats='playerStats'></component>
<!--      <inputPoints :playerStats='playerStats'></inputPoints>
      <rankings :playerStats='playerStats'></rankings>
      <statistics :playerStats='playerStats'></statistics>-->
    </div>
</template>

<script>
import { bus } from './main'
import inputPoints from './components/inputPoints/inputPoints.vue'
import rankings from './components/rankings/rankings.vue'
import statistics from './components/statistics/statistics.vue'


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
      inputPoints: 'inputPoints',
      playerStats: []
    }
  },

  methods: {
    test () {
      console.log(this.playerStats[0].name)
      console.log(this.playerStats[1].name)
      console.log(this.playerStats)
      console.log(this.playerStats.length)
    },
    pageSelector (page) {
      this.component = page
    }

    /*,
    updatePlayerStats () {
      this.playerStats.push({
        name: ,
        gamesPlayed: ,
        wins: ,
        losses: ,
        beersFinished: ,
        knockOffs: ,
        firstFinishes: ,
        canCatches: ,
        ballCatches: ,
        perfectGames:
      })
    }*/

  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Antic|Josefin+Sans|Taviraj');

p, input {
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
