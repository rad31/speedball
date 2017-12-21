<template>
  <div class='statsDiv'>
    <input v-model='inputStats.name' placeholder='Enter name' class='stats input clickable'></input>
    <p
      @click.exact='incBF'
      @click.ctrl='decBF'
      class='stats clickable'
    >{{ inputStats.beersFinished }}</p>
    <p
      @click.exact='incKO'
      @click.ctrl='decKO'
      class='stats clickable'
    >{{ inputStats.knockOffs }}</p>
    <p
      @click.exact='incFF'
      @click.ctrl='decFF'
      class='stats clickable'
    >{{ inputStats.firstFinishes }}</p>
    <p
      @click.exact='incCC'
      @click.ctrl='decCC'
      class='stats clickable'
    >{{ inputStats.canCatches }}</p>
    <p
      @click.exact='incBC'
      @click.ctrl='decBC'
      class='stats clickable'
    >{{ inputStats.ballCatches }}</p>
  </div>
</template>

<script>

export default {

  data() {
    return {
      inputStats: {
        name: '',
        gamesPlayed: 1,
        wins: 1,
        losses: 0,
        beersFinished: 0,
        knockOffs: 0,
        firstFinishes: 0,
        canCatches: 0,
        ballCatches: 0,
      }
    }
  },
  methods: {
    incBF() {
      if (this.inputStats.beersFinished <= 0) {
        this.inputStats.beersFinished += 1
      }
    },
    decBF() {
      if (this.inputStats.beersFinished >= 1) {
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
      this.inputStats.firstFinishes += 1
    },
    decFF() {
      if (this.inputStats.firstFinishes >= 1) {
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

.statsDiv {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
}

.stats {
  background: #ffffff;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  font-weight: bold;
}

.input {
  cursor: auto;
}

.input::placeholder {
  color: #333333;
}

</style>
