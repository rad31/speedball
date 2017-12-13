<template>
  <div v-on:increasePlayersClicked='increasePlayers($event)'>
    <div class='buttonsDiv'>
      <p @click='increasePlayers' class='increasePlayers buttons clickable'>Increase players</p>
      <p @click='decreasePlayers' class='decreasePlayers buttons clickable'>Decrease players</p>
      <p @click='submitConditionsFirstFinishes' class='submitStats buttons clickable'>Submit stats</p>
    </div>
    <p @click='test' class='result'>Winning Team</p>
    <inputStatHeaders></inputStatHeaders>
    <winnersInputRow ref='w1' v-if='numberOfPlayers >= 1'></winnersInputRow>
    <winnersInputRow ref='w2' v-if='numberOfPlayers >= 2'></winnersInputRow>
    <winnersInputRow ref='w3' v-if='numberOfPlayers >= 3'></winnersInputRow>
    <winnersInputRow ref='w4' v-if='numberOfPlayers >= 4'></winnersInputRow>
    <winnersInputRow ref='w5' v-if='numberOfPlayers >= 5'></winnersInputRow>
    <winnersInputRow ref='w6' v-if='numberOfPlayers >= 6'></winnersInputRow>
    <p class='result'>Losing Team</p>
    <inputStatHeaders></inputStatHeaders>
    <losersInputRow ref='l1' v-if='numberOfPlayers >= 1'></losersInputRow>
    <losersInputRow ref='l2' v-if='numberOfPlayers >= 2'></losersInputRow>
    <losersInputRow ref='l3' v-if='numberOfPlayers >= 3'></losersInputRow>
    <losersInputRow ref='l4' v-if='numberOfPlayers >= 4'></losersInputRow>
    <losersInputRow ref='l5' v-if='numberOfPlayers >= 5'></losersInputRow>
    <losersInputRow ref='l6' v-if='numberOfPlayers >= 6'></losersInputRow>
  </div>
</template>

<script>
import { bus } from 'C:/Users/Ronny/speedballprototype/src/main.js'
import winnersInputRow from './components/winnersInputRow.vue'
import losersInputRow from './components/losersInputRow.vue'
import inputStatHeaders from './components/inputStatHeaders.vue'

export default {
  props: {
    playerStats: {
      type: Array
    }
  },
  components: {
    'winnersInputRow': winnersInputRow,
    'losersInputRow': losersInputRow,
    'inputStatHeaders': inputStatHeaders,
  },
  data() {
    return {
      numberOfPlayers: 1
    }
  },
  methods: {
    test() {
      console.log(this.$refs.w1.inputStats.name)
      console.log(this.$refs.l1.inputStats.name)
    },
    capitalizeFirstLetter(string) {
      var lower = string.toLowerCase()
      var firstLetter = lower.slice(0,1)
      return lower.replace(firstLetter, firstLetter.toUpperCase())
    },
    increasePlayers() {
      if (this.numberOfPlayers <= 5) {
        this.numberOfPlayers += 1
      }
    },
    decreasePlayers() {
      if (this.numberOfPlayers >= 1) {
        this.numberOfPlayers -= 1
      }
    },
    submitStats() {
      if (this.numberOfPlayers >= 1) {
        var w1NameMatch = 0
        for (var i = 0; i > this.playerStats.length; i++) {
          if (this.playerStats[i].name == this.capitalizeFirstLetter(this.$refs.w1.inputStats.name)) {
            this.playerStats[i].gamesPlayed += this.$refs.w1.inputStats.gamesPlayed
            this.playerStats[i].wins += this.$refs.w1.inputStats.wins
            this.playerStats[i].losses += this.$refs.w1.inputStats.losses
            this.playerStats[i].beersFinished += this.$refs.w1.inputStats.beersFinished
            this.playerStats[i].knockOffs += this.$refs.w1.inputStats.knockOffs
            this.playerStats[i].firstFinishes += this.$refs.w1.inputStats.firstFinishes
            this.playerStats[i].canCatches += this.$refs.w1.inputStats.canCatches
            this.playerStats[i].ballCatches += this.$refs.w1.inputStats.ballCatches
            w1NameMatch += 1
          }
        }
        if (w1NameMatch == 0) {
          this.playerStats.push({
            name: this.capitalizeFirstLetter(this.$refs.w1.inputStats.name),
            gamesPlayed: this.$refs.w1.inputStats.gamesPlayed,
            wins: this.$refs.w1.inputStats.wins,
            losses: this.$refs.w1.inputStats.losses,
            beersFinished: this.$refs.w1.inputStats.beersFinished,
            knockOffs: this.$refs.w1.inputStats.knockOffs,
            firstFinishes: this.$refs.w1.inputStats.firstFinishes,
            canCatches: this.$refs.w1.inputStats.canCatches,
            ballCatches: this.$refs.w1.inputStats.ballCatches
          })
        }
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.l1.inputStats.name),
          gamesPlayed: this.$refs.l1.inputStats.gamesPlayed,
          wins: this.$refs.l1.inputStats.wins,
          losses: this.$refs.l1.inputStats.losses,
          beersFinished: this.$refs.l1.inputStats.beersFinished,
          knockOffs: this.$refs.l1.inputStats.knockOffs,
          firstFinishes: this.$refs.l1.inputStats.firstFinishes,
          canCatches: this.$refs.l1.inputStats.canCatches,
          ballCatches: this.$refs.l1.inputStats.ballCatches
        })
      } if (this.numberOfPlayers >=2) {
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.w2.inputStats.name),
          gamesPlayed: this.$refs.w2.inputStats.gamesPlayed,
          wins: this.$refs.w2.inputStats.wins,
          losses: this.$refs.w2.inputStats.losses,
          beersFinished: this.$refs.w2.inputStats.beersFinished,
          knockOffs: this.$refs.w2.inputStats.knockOffs,
          firstFinishes: this.$refs.w2.inputStats.firstFinishes,
          canCatches: this.$refs.w2.inputStats.canCatches,
          ballCatches: this.$refs.w2.inputStats.ballCatches
        })
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.l2.inputStats.name),
          gamesPlayed: this.$refs.l2.inputStats.gamesPlayed,
          wins: this.$refs.l2.inputStats.wins,
          losses: this.$refs.l2.inputStats.losses,
          beersFinished: this.$refs.l2.inputStats.beersFinished,
          knockOffs: this.$refs.l2.inputStats.knockOffs,
          firstFinishes: this.$refs.l2.inputStats.firstFinishes,
          canCatches: this.$refs.l2.inputStats.canCatches,
          ballCatches: this.$refs.l2.inputStats.ballCatches
        })
      } if (this.numberOfPlayers >=3) {
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.w3.inputStats.name),
          gamesPlayed: this.$refs.w3.inputStats.gamesPlayed,
          wins: this.$refs.w3.inputStats.wins,
          losses: this.$refs.w3.inputStats.losses,
          beersFinished: this.$refs.w3.inputStats.beersFinished,
          knockOffs: this.$refs.w3.inputStats.knockOffs,
          firstFinishes: this.$refs.w3.inputStats.firstFinishes,
          canCatches: this.$refs.w3.inputStats.canCatches,
          ballCatches: this.$refs.w3.inputStats.ballCatches
        })
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.l3.inputStats.name),
          gamesPlayed: this.$refs.l3.inputStats.gamesPlayed,
          wins: this.$refs.l3.inputStats.wins,
          losses: this.$refs.l3.inputStats.losses,
          beersFinished: this.$refs.l3.inputStats.beersFinished,
          knockOffs: this.$refs.l3.inputStats.knockOffs,
          firstFinishes: this.$refs.l3.inputStats.firstFinishes,
          canCatches: this.$refs.l3.inputStats.canCatches,
          ballCatches: this.$refs.l3.inputStats.ballCatches
        })
      } if (this.numberOfPlayers >=4) {
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.w4.inputStats.name),
          gamesPlayed: this.$refs.w4.inputStats.gamesPlayed,
          wins: this.$refs.w4.inputStats.wins,
          losses: this.$refs.w4.inputStats.losses,
          beersFinished: this.$refs.w4.inputStats.beersFinished,
          knockOffs: this.$refs.w4.inputStats.knockOffs,
          firstFinishes: this.$refs.w4.inputStats.firstFinishes,
          canCatches: this.$refs.w4.inputStats.canCatches,
          ballCatches: this.$refs.w4.inputStats.ballCatches
        })
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.l4.inputStats.name),
          gamesPlayed: this.$refs.l4.inputStats.gamesPlayed,
          wins: this.$refs.l4.inputStats.wins,
          losses: this.$refs.l4.inputStats.losses,
          beersFinished: this.$refs.l4.inputStats.beersFinished,
          knockOffs: this.$refs.l4.inputStats.knockOffs,
          firstFinishes: this.$refs.l4.inputStats.firstFinishes,
          canCatches: this.$refs.l4.inputStats.canCatches,
          ballCatches: this.$refs.l4.inputStats.ballCatches
        })
      } if (this.numberOfPlayers >=5) {
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.w5.inputStats.name),
          gamesPlayed: this.$refs.w5.inputStats.gamesPlayed,
          wins: this.$refs.w5.inputStats.wins,
          losses: this.$refs.w5.inputStats.losses,
          beersFinished: this.$refs.w5.inputStats.beersFinished,
          knockOffs: this.$refs.w5.inputStats.knockOffs,
          firstFinishes: this.$refs.w5.inputStats.firstFinishes,
          canCatches: this.$refs.w5.inputStats.canCatches,
          ballCatches: this.$refs.w5.inputStats.ballCatches
        })
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.l5.inputStats.name),
          gamesPlayed: this.$refs.l5.inputStats.gamesPlayed,
          wins: this.$refs.l5.inputStats.wins,
          losses: this.$refs.l5.inputStats.losses,
          beersFinished: this.$refs.l5.inputStats.beersFinished,
          knockOffs: this.$refs.l5.inputStats.knockOffs,
          firstFinishes: this.$refs.l5.inputStats.firstFinishes,
          canCatches: this.$refs.l5.inputStats.canCatches,
          ballCatches: this.$refs.l5.inputStats.ballCatches
        })
      } if (this.numberOfPlayers >=6) {
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.w6.inputStats.name),
          gamesPlayed: this.$refs.w6.inputStats.gamesPlayed,
          wins: this.$refs.w6.inputStats.wins,
          losses: this.$refs.w6.inputStats.losses,
          beersFinished: this.$refs.w6.inputStats.beersFinished,
          knockOffs: this.$refs.w6.inputStats.knockOffs,
          firstFinishes: this.$refs.w6.inputStats.firstFinishes,
          canCatches: this.$refs.w6.inputStats.canCatches,
          ballCatches: this.$refs.w6.inputStats.ballCatches
        })
        this.playerStats.push({
          name: this.capitalizeFirstLetter(this.$refs.l6.inputStats.name),
          gamesPlayed: this.$refs.l6.inputStats.gamesPlayed,
          wins: this.$refs.l6.inputStats.wins,
          losses: this.$refs.l6.inputStats.losses,
          beersFinished: this.$refs.l6.inputStats.beersFinished,
          knockOffs: this.$refs.l6.inputStats.knockOffs,
          firstFinishes: this.$refs.l6.inputStats.firstFinishes,
          canCatches: this.$refs.l6.inputStats.canCatches,
          ballCatches: this.$refs.l6.inputStats.ballCatches
        })
      }
      this.numberOfPlayers = 0
    },
    submitConditionsFirstFinishes() {
      var firstFinishers = 0
      if (this.numberOfPlayers >= 1) {
        firstFinishers += this.$refs.w1.inputStats.firstFinishes
        firstFinishers += this.$refs.l1.inputStats.firstFinishes
      } if (this.numberOfPlayers >= 2) {
        firstFinishers += this.$refs.w2.inputStats.firstFinishes
        firstFinishers += this.$refs.l2.inputStats.firstFinishes
      } if (this.numberOfPlayers >= 3) {
        firstFinishers += this.$refs.w3.inputStats.firstFinishes
        firstFinishers += this.$refs.l3.inputStats.firstFinishes
      } if (this.numberOfPlayers >= 4) {
        firstFinishers += this.$refs.w4.inputStats.firstFinishes
        firstFinishers += this.$refs.l4.inputStats.firstFinishes
      } if (this.numberOfPlayers >= 5) {
        firstFinishers += this.$refs.w5.inputStats.firstFinishes
        firstFinishers += this.$refs.l5.inputStats.firstFinishes
      } if (this.numberOfPlayers >= 6) {
        firstFinishers += this.$refs.w6.inputStats.firstFinishes
        firstFinishers += this.$refs.l6.inputStats.firstFinishes
      } if(firstFinishers > 1) {
      alert('Only one player could have finished first...')
      } else {
        return this.submitStats()
      }
    },

  }
}
</script>

<style scoped>

.result {
  font-size: 0.75em;
  background: #d3513b;
  text-align: left;
}

.buttonsDiv {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-column-gap: 20px;
  padding: 20px;
  background: #c3412b;
}

.buttons {
  background: #eeeeee;
  font-size: 12px;
  border-radius: 4px

}

.increasePlayers {
  grid-column: 1 / 2
}

.decreasePlayers {
  grid-column: 2 / 3
}

.submitStats {
  grid-column: 7 / 8;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  font-weight: bold;
}

</style>
