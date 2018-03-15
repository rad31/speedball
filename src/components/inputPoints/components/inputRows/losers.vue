<template>
  <div class="statCellsDiv">
    <input v-model="inputStats.name" placeholder="Enter name" class="input clickable"></input>
    <p
      @click.exact="incF"
      @click.ctrl="decF"
      class="clickable"
    >{{ inputStats.finishes }}</p>
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
      @click.exact="incS"
      @click.ctrl="decS"
      class="clickable"
    >{{ inputStats.saves }}</p>
    <p
      @click.exact="incD"
      @click.ctrl="decD"
      class="clickable"
    >{{ inputStats.denies }}</p>
  </div>
</template>

<script>

export default {
  data() {
    return {
      inputStats: {
        name: "",
        gamesPlayed: 1,
        wins: 0,
        losses: 1,
        finishes: 0,
        firstFinishes: 0,
        knockOffs: 0,
        saves: 0,
        denies: 0,
      }
    }
  },
  methods: {
    incF() {
      if (this.inputStats.finishes === 0) {
        this.inputStats.finishes += 1
      }
    },
    decF() {
      if (this.inputStats.finishes = 1) {
        this.inputStats.finishes -= 1
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
      if (this.inputStats.firstFinishes === 0) {
        this.inputStats.firstFinishes += 1
      }
    },
    decFF() {
      if (this.inputStats.firstFinishes = 1) {
        this.inputStats.firstFinishes -= 1
      }
    },
    incS() {
      this.inputStats.saves += 1
      },
    decS() {
      if (this.inputStats.saves >= 1) {
        this.inputStats.saves -= 1
      }
    },
    incD() {
      this.inputStats.denies += 1
    },
    decD() {
      if (this.inputStats.denies >= 1) {
        this.inputStats.denies -= 1
      }
    }
  }
}
</script>

<style scoped>
.clickable:hover {
  background: #efefef;
}
</style>
