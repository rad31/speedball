<template>
  <div>
    <h1>National Speedball League</h1>
    <p :class="rankingsSelected" @click="rankingsSelector()">Rankings</p>
    <p :class="statisticsSelected" @click="statisticsSelector()">Statistics</p>
    <p :class="inputPointsSelected" @click="inputPointsSelector()">Input Points</p>
    <component :is="component"></component>
  </div>
</template>

<script>
import inputPoints from './components/inputPoints.vue'
import rankings from './components/rankings.vue'
import statistics from './components/statistics.vue'

export default {

  components: {
    'inputPoints': inputPoints,
    'rankings': rankings,
    'statistics': statistics,
  },

  data() {
    return {
      component: 'statistics',
      selected: 'pageSelected pages',
      notSelected: 'pageNotSelected pages'
    }
  },

  methods: {
    rankingsSelector: function() {
      this.component = 'rankings'
    },
    statisticsSelector: function() {
      this.component = 'statistics'
    },
    inputPointsSelector: function() {
      this.component = 'inputPoints'
    }
  },

  computed: {
    rankingsSelected: function() {
      if (this.component == 'rankings') {
        return this.selected
      } else {
        return this.notSelected
      }
    },
    statisticsSelected: function() {
      if (this.component == 'statistics') {
        return this.selected
      } else {
        return this.notSelected
      }
    },
    inputPointsSelected: function() {
      if (this.component == 'inputPoints') {
        return this.selected
      } else {
        return this.notSelected
      }
    }
  }
}
</script>

<style scoped>

h1 {
  text-align: center;
  background-color: #b01040;
  padding: 2%;
}

.pageSelected {
  background-color: #ffeec0;
}

.pageNotSelected {
  background-color: #ffffcc;
}

.pages {
  display: block;
  color: #444444;
  font-size: 1.5em;
  margin: 1%;
  text-align: center;
  float: left;
  padding: 1.5%;
  width: 29.3333%;
  margin: 0.5%;
  height: 20px;
  float: left;
}

</style>
