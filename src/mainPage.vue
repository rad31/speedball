<template>
    <div class='mainDiv'>
      <p class='title'>National Speedball League</p>
      <div class='pagesDiv'>
        <p class='rankings pages clickable' @click='pageSelector(rankings)'>Rankings</p>
        <p class='statistics pages clickable' @click='pageSelector(statistics)'>Statistics</p>
        <p class='inputPoints pages clickable' @click='pageSelector(inputPoints)'>Input Points</p>
      </div>
      <component :is='component'></component>
    </div>
</template>

<script>
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
      component: 'statistics',
      selected: 'selected',
      notSelected: '',
      rankings: 'rankings',
      statistics: 'statistics',
      inputPoints: 'inputPoints'
    }
  },

  methods: {
    pageSelector (page) {
      this.component = page
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Antic|Josefin+Sans|Taviraj');

p, input {
  align-content: center;
  color: #ffffff;
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
  background: #192231;
  max-width: 960px;
  align-content: center;
  margin: auto;
}

</style>

<style scoped>

.title {
  font-size: 24px;
  color: #ffffff;
  font-weight: normal;
  background: #192231;
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
  background: #192231
}

.pages {
  font-size: 12px;
  background: #7777bb;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.rankings {
  background: #494e6b;
}

.statistics {
  background: #98878f;
}

.inputPoints {
  background: #985e6d;
}

.clickable:hover {
  font-weight: bold;
}

</style>
