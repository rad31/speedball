<template>
  <div ref=''>
    <p class='result'>Winning Team</p>
    <inputStatHeaders></inputStatHeaders>
    <winnersInputRow v-on:increasePlayers=''></winnersInputRow>
    <p class='result'>Losing Team</p>
    <inputStatHeaders></inputStatHeaders>
    <losersInputRow></losersInputRow>
    <actions></actions>
  </div>
</template>

<script>
import winnersInputRow from './componentsInputPoints/winnersInputRow.vue'
import losersInputRow from './componentsInputPoints/losersInputRow.vue'
import inputStatHeaders from './componentsInputPoints/inputStatHeaders.vue'
import actions from './componentsInputPoints/actions.vue'

export default {

  components: {
    'winnersInputRow': winnersInputRow,
    'losersInputRow': losersInputRow,
    'inputStatHeaders': inputStatHeaders,
    'actions': actions

  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>

.result {
  font-size: 0.75em;
  background: #cc5577;
  text-align: left;
}

.statsDiv {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
}

.actionsDiv {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 0.5em;
  padding: 0.5em;
  background:#aaaaaa;
}

</style>
