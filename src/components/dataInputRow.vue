<template>
  <div>
    <input class="playerName"></input>
    <p @click.exact="incBF" @click.ctrl="decBF" class="statNames">{{ stats.beersFinished }}</p>
    <p @click.exact="incKO" @click.ctrl="decKO" class="statNames">{{ stats.knockOffs }}</p>
    <p @click.exact="incFF" @click.ctrl="decFF" class="statNames">{{ stats.firstFinishes }}</p>
    <p @click.exact="incCC" @click.ctrl="decCC" class="statNames">{{ stats.canCatches }}</p>
    <p @click.exact="incBC" @click.ctrl="decBC" class="statNames">{{ stats.ballCatches }}</p>
    <p @click.exact="incPG" @click.ctrl="decPG" class="statNames">{{ stats.perfectGames }}</p>
  </div>
</template>

<script>

export default {

  data() {
    return {
      stats: {
        name: '',
        beersFinished: 0,
        knockOffs: 0,
        firstFinishes: 0,
        canCatches: 0,
        ballCatches: 0,
        perfectGames: 0,
      }
    }
  },
  methods: {
    incBF: function() {
      return this.stats.beersFinished++;
    },
    incKO: function() {
      return this.knockOffs++;
    },
    incFF: function() {
      return this.firstFinishes++;
    },
    incCC: function() {
      return this.canCatches++;
    },
    incBC: function() {
      return this.ballCatches++;
    },
    incPG: function() {
      return this.perfectGames++;
    },
    decBF: function() {
      return this.beersFinished--;
    },
    decKO: function() {
      return this.knockOffs--;
    },
    decFF: function() {
      return this.firstFinishes--;
    },
    decCC: function() {
      return this.canCatches--;
    },
    decBC: function() {
      return this.ballCatches--;
    },
    decPG: function() {
      return this.perfectGames--;
    }
  }
}

</script>

<style scoped>

.playerName {
  display: block;
  color: #444444;
  margin: 10px, 0;
  text-align: center;
  float: left;
  background: #eee;
  width: 17.4%;
  margin: .5%;
  height: 15px;
  float: left;
}

.statNames {
  display: block;
  color: #666666;
  margin: 10px, 0;
  text-align: center;
  float: left;
  background: #eeeeff;
  width: 8%;
  margin: .5%;
  height: 20px;
  float: left;
}

</style>
