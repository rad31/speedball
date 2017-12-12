<template>
  <div class='mainDiv'>
    <p class='title'>National Speedball League</p>
    <div class='pagesDiv'>
      <p :id='isSelected(rankings)' class='pages clickable' @click='pageSelector(rankings)'>Rankings</p>
      <p :id='isSelected(statistics)' class='pages clickable' @click='pageSelector(statistics)'>Statistics</p>
      <p :id='isSelected(inputPoints)' class='pages clickable' @click='pageSelector(inputPoints)'>Input Points</p>
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
    },
    isSelected (element) {
      if (this.component == element) {
        return this.selected
      } else {
        return this.notSelected
      }
    }
  }
}
</script>

<style scoped>
p, input {
  align-content: center;
  font-size: 10px;
  font-weight: lighter;
  font-family: Georgia, sans-serif;
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
  background: #333333;
  max-width: 960px;
  align-content: center;
  margin: auto;
}

.title {
  font-size: 24px;
  font-weight: normal;
  background: #aa3355;
  padding: 20px;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #6666aa;
}

.pagesDiv {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.pages {
  font-size: 12px;
  background: #7777bb;
  padding: 10px;
}

#selected {
  background: #555599;
}

</style>
