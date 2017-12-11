<template>
  <div class='mainDiv'>
    <p class='title'>National Speedball League</p>
    <div class='pagesDiv'>
      <p :id='isSelected(rankingsPage)' class='pages clickable' @click='pageSelector(rankingsPage)'>Rankings</p>
      <p :id='isSelected(statisticsPage)' class='pages clickable' @click='pageSelector(statisticsPage)'>Statistics</p>
      <p :id='isSelected(inputPointsPage)' class='pages clickable' @click='pageSelector(inputPointsPage)'>Input Points</p>
    </div>
    <component :is='component'></component>
  </div>
</template>

<script>
import inputPointsPage from './components/inputPointsPage.vue'
import rankingsPage from './components/rankingsPage.vue'
import statisticsPage from './components/statisticsPage.vue'

export default {

  components: {
    'inputPointsPage': inputPointsPage,
    'rankingsPage': rankingsPage,
    'statisticsPage': statisticsPage,
  },

  data() {
    return {
      component: 'statisticsPage',
      selected: 'selected',
      notSelected: '',
      rankingsPage: 'rankingsPage',
      statisticsPage: 'statisticsPage',
      inputPointsPage: 'inputPointsPage'

    }
  },

  methods: {
    pageSelector: function(page) {
      this.component = page
    },
    isSelected: function(element) {
      if (this.component == element) {
        return this.selected
      } else {
        return this.notSelected
      }
    }
  }
}
</script>

<style>
body {
  background: #333333;
  max-width: 960px;
  align-content: center;
  margin: auto;
}

p, input {
  font-size: 0.625em;
  font-weight: lighter;
  font-family: Georgia, sans-serif;
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  margin: 0;
  padding: 0.5em;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  border-width: 0;
  min-width: 2em;

}

.title {
  font-size: 1.5em;
  font-weight: normal;
  background: #aa3355;
  padding: 0.9em;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  background: #7070b0;
}

.pagesDiv {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.pages {
  font-size: 0.75em;
  background: #ffffcc;
  padding: 0.6em;
}

#selected {
  background: #505090;
}

.stats {
  background: #cccccc;
}

.statHeaders {
  background: #aaaaaa;
}

.actions {
  background: #cc5577;
}

</style>
