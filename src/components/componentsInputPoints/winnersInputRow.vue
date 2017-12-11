<template>
  <div class='statsDiv'>
    <input placeholder='Enter name' class='stats input clickable'></input>
    <p @click.exact='incBF' @click.ctrl='decBF' class='stats clickable'>{{ inputStats.beersFinished }}</p>
    <p @click.exact='incKO' @click.ctrl='decKO' class='stats clickable'>{{ inputStats.knockOffs }}</p>
    <p @click.exact='incFF' @click.ctrl='decFF' class='stats clickable'>{{ inputStats.firstFinishes }}</p>
    <p @click.exact='incCC' @click.ctrl='decCC' class='stats clickable'>{{ inputStats.canCatches }}</p>
    <p @click.exact='incBC' @click.ctrl='decBC' class='stats clickable'>{{ inputStats.ballCatches }}</p>
  </div>
</template>

<script>

export default {

  data() {
    return {
      inputStats: {
        gamesPlayed: 1,
        wins: 1,
        losses: 0,
        beersFinished: 0,
        knockOffs: 0,
        firstFinishes: 0,
        canCatches: 0,
        ballCatches: 0,
      },
    }
  },
  methods: {
    incBF: function() {
      return this.inputStats.beersFinished++;
    },
    incKO: function() {
      return this.inputStats.knockOffs++;
    },
    incFF: function() {
      return this.inputStats.firstFinishes++;
    },
    incCC: function() {
      return this.inputStats.canCatches++;
    },
    incBC: function() {
      return this.inputStats.ballCatches++;
    },
    decBF: function() {
      return this.inputStats.beersFinished--;
    },
    decKO: function() {
      return this.inputStats.knockOffs--;
    },
    decFF: function() {
      return this.inputStats.firstFinishes--;
    },
    decCC: function() {
      return this.inputStats.canCatches--;
    },
    decBC: function() {
      return this.inputStats.ballCatches--;
    }
  }
}

</script>

<style scoped>

.input {
  cursor: auto;
}

</style>
