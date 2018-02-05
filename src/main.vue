<template>
  <div>
    <div class="mainDiv">
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
        :is="component"
        :matchCount="matchCount"
        :playerStats="playerStats"
        class="component"
      ></component>
    </div>
  </div>
</template>

<script>
import inputPoints from "./components/inputPoints/main.vue"
import rankings from "./components/rankings/main.vue"
import statistics from "./components/statistics/main.vue"
import { firebaseMatchData } from"./firebase"
import { firebaseMatchCount } from"./firebase"
export default {
  components: {
    "inputPoints": inputPoints,
    "rankings": rankings,
    "statistics": statistics
  },
  data() {
    return {
      pages: [
        {type: "rankings", text: "Rankings", selected: true},
        {type: "statistics", text: "Statistics", selected: false},
        {type: "inputPoints", text: "inputPoints", selected: false}
      ],
      component: "inputPoints"
    }
  },
  methods: {
    componentSelector() {
      for (var i in this.pages) {
        if (event.target.innerText === this.pages[i].text) {
          this.component = this.pages[i].type
          this.pages[i].selected = true
        } else if (event.target.innerText !== this.pages[i].text) {
          this.pages[i].selected = false
        }
      }
    }
  },
  computed: {
    playerStats() {
      var rawStats = this.matchData
      var mergedStats = []
      var nameMatch = false
      for (var i = 0; i < rawStats.length; i++) {
        for (var j = 0; j < mergedStats.length; j++) {
          if (rawStats[i].name == mergedStats[j].name) {
            for (var k in mergedStats[j]) {
              if (k !== "name") {
                mergedStats[j][k] += rawStats[i][k]
              }
            }
            nameMatch = true
          }
        }
        if (nameMatch == false) {
          mergedStats.push({
            name: rawStats[i].name,
            gamesPlayed: rawStats[i].gamesPlayed,
            wins: rawStats[i].wins,
            losses: rawStats[i].losses,
            beersFinished: rawStats[i].beersFinished,
            firstFinishes: rawStats[i].firstFinishes,
            knockOffs: rawStats[i].knockOffs,
            canCatches: rawStats[i].canCatches,
            ballCatches: rawStats[i].ballCatches
          })
        }
        nameMatch = false
      }
      return mergedStats
    }
  },
  firebase: {
    matchData: firebaseMatchData,
    matchCount: firebaseMatchCount
  }
}
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Antic|Josefin+Sans|Taviraj");
  p, input, td, th {
    align-content: center;
    color: #101010;
    font-size: 10px;
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
    min-width: 40px;
  }
  table {
    align-content: center;
    color: #101010;
    font-size: 10px;
    font-weight: lighter;
    font-family: "Antic", sans-serif;
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
    background: #ffffff;
    align-content: center;
    margin: auto;
  }
  .component {
    max-width: 760px;
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
    background: #e0e0e0;
    font-size: 12px;
    border-radius: 4px;
  }
  .buttons:hover, .buttonSelected {
    background: #c0c0c0;
  }
  .statHeadersDiv, .statCellsDiv {
    display: grid;
  }
  .statHeadersDiv, .statHeaders {
    background: #d0d0d0;
  }
  .statCellsDiv, input {
    background: #fafafa;
  }
  .selected {
    font-weight: bold;
  }
</style>

<style scoped>
  .title {
    font-size: 24px;
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
    font-size: 12px;
    background: #404040;
    color: #ffffff;
  }
  .pages:hover, .pageSelected {
    background: #505050;
    border-radius: 5px;
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
</style>
