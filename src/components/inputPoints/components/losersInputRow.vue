<template>
  <div class='statsDiv'>
    <input v-model='inputStats.name' placeholder='Enter name' class='stats input clickable'></input>
    <p
      @click.exact='inputStats.beersFinished += 1'
      @click.ctrl='inputStats.beersFinished -= 1'
      class='stats clickable'
    >{{ inputStats.beersFinished }}</p>
    <p
      @click.exact='inputStats.knockOffs +=1'
      @click.ctrl='inputStats.knockOffs -=1'
      class='stats clickable'
    >{{ inputStats.knockOffs }}</p>
    <p
      @click.exact='inputStats.firstFinishes +=1'
      @click.ctrl='inputStats.firstFinishes -=1'
      class='stats clickable'
    >{{ inputStats.firstFinishes }}</p>
    <p
      @click.exact='inputStats.canCatches +=1'
      @click.ctrl='inputStats.canCatches -=1'
      class='stats clickable'
    >{{ inputStats.canCatches }}</p>
    <p
      @click.exact='inputStats.ballCatches +=1'
      @click.ctrl='inputStats.ballCatches -=1'
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
        wins: 0,
        losses: 1,
        beersFinished: 0,
        knockOffs: 0,
        firstFinishes: 0,
        canCatches: 0,
        ballCatches: 0,
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
