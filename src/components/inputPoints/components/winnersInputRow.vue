<template>
  <div class="statCellsDiv">
    <input v-model="inputStats.name" placeholder="Enter name" class="input clickable"></input>
    <p
      @click.exact="incBF"
      @click.ctrl="decBF"
      class="clickable"
    >{{ inputStats.beersFinished }}</p>
    <p
      @click.exact="incFF"
      @click.ctrl="decFF"
      class="clickable"
    >{{ inputStats.firstFinishes }}</p>
    <p
      @click.exact="incKO"
      @click.ctrl="decKO"
      class="clickable"
    >{{ inputStats.knockOffs }}</p>
    <p
      @click.exact="incCC"
      @click.ctrl="decCC"
      class="clickable"
    >{{ inputStats.canCatches }}</p>
    <p
      @click.exact="incBC"
      @click.ctrl="decBC"
      class="clickable"
    >{{ inputStats.ballCatches }}</p>
  </div>
</template>

<script>

export default {
  data() {
    return {
      inputStats: {
        name: "",
        gamesPlayed: 1,
        wins: 1,
        losses: 0,
        beersFinished: 1,
        firstFinishes: 0,
        knockOffs: 0,
        canCatches: 0,
        ballCatches: 0,
      }
    }
  },
  methods: {
    incBF() {
      if (this.inputStats.beersFinished == 0) {
        this.inputStats.beersFinished += 1
      }
    },
    decBF() {
      if (this.inputStats.beersFinished = 1) {
        this.inputStats.beersFinished -= 1
      }
    },
    incKO() {
      this.inputStats.knockOffs += 1
    },
    decKO() {
      if (this.inputStats.knockOffs >= 1) {
        this.inputStats.knockOffs -= 1
      }
    },
    incFF() {
      if (this.inputStats.firstFinishes == 0) {
        this.inputStats.firstFinishes += 1
      }
    },
    decFF() {
      if (this.inputStats.firstFinishes = 1) {
        this.inputStats.firstFinishes -= 1
      }
    },
    incCC() {
      this.inputStats.canCatches += 1
      },
    decCC() {
      if (this.inputStats.canCatches >= 1) {
        this.inputStats.canCatches -= 1
      }
    },
    incBC() {
      this.inputStats.ballCatches += 1
    },
    decBC() {
      if (this.inputStats.ballCatches >= 1) {
        this.inputStats.ballCatches -= 1
      }
    }
  }
}
</script>

<style scoped>
</style>
