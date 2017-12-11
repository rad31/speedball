<template>
  <div class='actionsDiv'>
    <p class='increasePlayers actions clickable'>Increase players</p>
    <p class='submitStats actions clickable'>Submit stats</p>
  </div>
</template>

<script>

export default {

  data() {
    return {

    }
  },
  methods: {
    increasePlayers: function(){
      this.$emit('increasePlayers')
    }
  }
}

</script>

<style scoped>

.actions {
  font-size: 0.75em;
}

.increasePlayers {
  grid-column: 1/2;
}

.submitStats {
  grid-column: 6/7;
}

</style>
