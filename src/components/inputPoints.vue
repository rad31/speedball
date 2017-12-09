<template>
  <div>
    <p class='result'>Winning Team</p>
    <div class='headers'>
      <p class='playerName'>{{playerName}}</p>
      <p class='statNames' v-for="stat in stats">{{stat}}</p>
    </div>
    <dataInputRow></dataInputRow>
    <p class='result'>Losing Team</p>
    <div class='headers'>
      <p class='playerName'>{{playerName}}</p>
      <p class='statNames' v-for="stat in stats">{{stat}}</p>
    </div>
    <dataInputRow></dataInputRow>
    <div class="buttons">
      <p class="button">Add player</p>
      <p class="button">Submit</p>
   </div>
  </div>
</template>

<script>
import dataInputRow from './dataInputRow.vue'

export default {

  components: {
    'dataInputRow': dataInputRow,

  },
  data() {
    return {
        playerName: 'Player',
        stats: ['BF', 'KO', 'FF', 'BC', 'CC', 'PG']
    }
  }
}
</script>

<style scoped>

h1 {
  text-align: center;
}

.result {
  display: inline;
  font-size: 1.5em;
  color: #222222;
  margin: 10px, 0;
  float: left;
  background: #444488;
  width: 99%;
  margin: .5%;
  height: 30px;
  float: left;
}

.result {
  display: inline;
  font-size: 1.5em;
  color: #222222;
  margin: 10px, 0;
  float: left;
  background: #6666aa;
  width: 99%;
  margin: .5%;
  height: 30px;
  float: left;
}

.button {  display: block;
  font-size: 1.5em;
  color: #222222;
  margin: 10px, 0;
  float: left;
  background: #6666aa;
  width: 25%;
  margin: .5%;
  height: 30px;
  float: left;
}

.playerName {
  display: block;
  color: #444444;
  margin: 10px, 0;
  text-align: center;
  float: left;
  background: #ccccff;
  width: 18%;
  margin: .5%;
  height: 20px;
  float: left;
}

.headers:after {
  content: "";
  display: block;
  clear: both;
}

.statNames {
  display: block;
  color: #444444;
  margin: 10px, 0;
  text-align: center;
  float: left;
  background: #ccccff;
  width: 8%;
  margin: .5%;
  height: 20px;
  float: left;
}

</style>
