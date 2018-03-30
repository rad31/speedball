<template>
  <div>
    <div class="buttonsDiv">
      <p
        v-for="button in buttons"
        @click="buttonClicked()"
        :class="button.type"
        class="buttons clickable"
      >
        {{ button.text }}
      </p>
    </div>
    <p class="result">Winning Team</p>
    <div class="statHeadersDiv">
      <p v-for="stat in statHeaders"> {{ stat }} </p>
    </div>
    <div v-for="players in numberOfPlayers">
      <winnersInputRow ref="p"></winnersInputRow>
    </div>
    <p class="result">Losing Team</p>
    <div class="statHeadersDiv">
      <p v-for="stat in statHeaders"> {{ stat }} </p>
    </div>
    <div v-for="players in numberOfPlayers">
      <losersInputRow ref="p"></losersInputRow>
    </div>
    <div class="popUp" v-show="this.popUp.displayed === true">
      <div class="popUpHeaderOne"></div>
      <div class="popUpHeaderTwo"></div>
      <p class="popUpMessage">{{this.popUp.message}}</p>
      <div class="inputDiv">
        <input
          class="input"
          v-show="this.popUp.error === false"
          placeholder="Enter password"
          v-model="password.value"
        >
        </input>
      </div>
      <p class="popUpButtons clickable" @click="exitPopUp()">Ok</p>
    </div>
  </div>
</template>

<script>
import winnersInputRow from "./Components/InputRows/Winners.vue"
import losersInputRow from "./Components/InputRows/Losers.vue"
import { firebaseMatchData } from "../../firebase"
import { firebaseMatchCount } from "../../firebase"
import { firebaseRankingsData } from "../../firebase"

export default {
  props: [
    "matchCount",
    "matchData",
    "playerStats",
    "playerRankings",
    "popUp",
    "pageDisplayed",
    "pages"
  ],
  components: {
    "winnersInputRow": winnersInputRow,
    "losersInputRow": losersInputRow
  },
  data() {
    return {
      statHeaders: [
        "Name",
        "F",
        "FF",
        "KO",
        "S",
        "D"
      ],
      buttons: [
        {type: "increasePlayers", text: "Increase Players"},
        {type: "decreasePlayers", text: "Decrease Players"},
        {type: "submitStats", text: "Submit Stats"}
      ],
      numberOfPlayers: [0],
      password: {
        value: ""
      }
    }
  },
  methods: {
    buttonClicked() {
      if (event.target.innerText === this.buttons[0].text) {
        return this.increasePlayers()
      } else if (event.target.innerText === this.buttons[1].text) {
        return this.decreasePlayers()
      } else if (event.target.innerText === this.buttons[2].text) {
        return this.submitConditionsFirstFinishes()
      }
    },
    increasePlayers() {
      if (this.numberOfPlayers.length <= 5) {
        this.numberOfPlayers.push(0)
      }
    },
    decreasePlayers() {
      if (this.numberOfPlayers.length >= 2) {
        this.numberOfPlayers.pop()
      }
    },
    submitConditionsFirstFinishes() {
      let firstFinishers = 0
      for (let i = 0; i < this.numberOfPlayers.length * 2; i++) {
        firstFinishers += this.$refs.p[i].inputStats.firstFinishes
      }
      if (firstFinishers > 1) {
        this.popUp.message = "Only one player could have finished first."
        this.popUp.displayed = true
        this.popUp.error = true
      } else if (firstFinishers === 0) {
        if (this.numberOfPlayers.length > 1) {
          this.popUp.message = "First finisher was not recorded."
          this.popUp.displayed = true
          this.popUp.error = true
        } else if (this.numberOfPlayers.length === 1) {
          return this.submitConditionsNameBlank()
        }
      } else if (firstFinishers === 1) {
        if (this.numberOfPlayers.length === 1) {
          this.popUp.message = "First finish is not counted in one vs one."
          this.popUp.displayed = true
          this.popUp.error = true
        } else if (this.numberOfPlayers.length > 1) {
          return this.submitConditionsFinishes()
        }
      }
    },
    submitConditionsFinishes() {
      let winnersFinishes = 0
      let losersFinishes = 0
      for (let i = 0; i < this.numberOfPlayers.length * 2; i++) {
        if (this.$refs.p[i].inputStats.losses === 1 && this.$refs.p[i].inputStats.finishes === 1) {
          losersFinishes += 1
        } else if (this.$refs.p[i].inputStats.wins === 1 && this.$refs.p[i].inputStats.finishes === 1) {
          winnersFinishes += 1
        }
      }
      if (losersFinishes === this.numberOfPlayers.length) {
        this.popUp.message = "The losing team could not all have finishes."
        this.popUp.displayed = true
        this.popUp.error = true
      } else if (winnersFinishes < this.numberOfPlayers.length) {
        this.popUp.message = "The winning team must all have finishes."
        this.popUp.displayed = true
        this.popUp.error = true
      } else if (losersFinishes < this.numberOfPlayers.length && winnersFinishes === this.numberOfPlayers.length) {
        return this.submitConditionsNameBlank()
      }
    },
    submitConditionsNameBlank() {
      let nameBlank = 0
      for (let i = 0; i < this.numberOfPlayers.length * 2; i++) {
        if (this.$refs.p[i].inputStats.name == "") {
          nameBlank += 1
        }
      }
      if (nameBlank > 0) {
        this.popUp.message = "Please enter all players' names."
        this.popUp.displayed = true
        this.popUp.error = true
      } else {
        this.popUp.message = "Please enter the password:"
        this.popUp.displayed = true
        this.popUp.error = false
      }
    },
    clearStatInputs() {
      for (let i = 0; i < this.numberOfPlayers.length * 2; i++) {
        if (i % 2 === 0) {
          this.$refs.p[i].inputStats = {
            name: "",
            gamesPlayed: 1,
            wins: 1,
            losses: 0,
            finishes: 1,
            firstFinishes: 0,
            knockOffs: 0,
            saves: 0,
            denies: 0
          }
        } else if (i % 2 !== 0) {
          this.$refs.p[i].inputStats = {
            name: "",
            gamesPlayed: 1,
            wins: 0,
            losses: 1,
            finishes: 0,
            firstFinishes: 0,
            knockOffs: 0,
            saves: 0,
            denies: 0
          }
        }
      }
      this.numberOfPlayers = [0]
    },
    exitPopUp() {
      if (this.popUp.error === true) {
        this.popUp.displayed = false
        if (this.popUp.message === "Stats submitted successfully!") {
          this.pageDisplayed.type = "statistics"
          this.pages[2].selected = false
          this.pages[1].selected = true
//          return this.clearStatInputs()
          return this.submitRankingsAll()
        }
      } else if (this.popUp.error === false) {
        if (this.password.value === "hypetrain2018") {
          this.popUp.message = "Stats submitted successfully!"
          this.popUp.error = true
          this.password.value = ""
          return this.submitStats()
        } else if (this.password.value !== "hypetrain2018") {
          this.popUp.message = "Incorrect password entered."
          this.popUp.error = true
          this.password.value = ""        }
      }
    },
    capitalizeFirstLetter(_string) {
      let lower = _string.toLowerCase()
      let firstLetter = lower.slice(0,1)
      return lower.replace(firstLetter, firstLetter.toUpperCase())
    },
    submitStats() {
      let numberOfZeroes = "00"
      if (this.matchCount.length + 1>= 10) {
        numberOfZeroes = "0"
      } else if (this.matchCount.length + 1 >= 100) {
        numberOfZeroes = ""
      }
      for (let i = 0; i < this.numberOfPlayers.length * 2; i++) {
        firebaseMatchData.child(`match${numberOfZeroes}${this.matchCount.length + 1}`).child(this.capitalizeFirstLetter(this.$refs.p[i].inputStats.name)).set({
          gamesPlayed: this.$refs.p[i].inputStats.gamesPlayed,
          wins: this.$refs.p[i].inputStats.wins,
          losses: this.$refs.p[i].inputStats.losses,
          finishes: this.$refs.p[i].inputStats.finishes,
          firstFinishes: this.$refs.p[i].inputStats.firstFinishes,
          knockOffs: this.$refs.p[i].inputStats.knockOffs,
          saves: this.$refs.p[i].inputStats.saves,
          denies: this.$refs.p[i].inputStats.denies
        })
      }
      firebaseMatchCount.push(this.matchCount.length + 1)
      this.numberOfPlayers = []
    },
    submitRankingsAll() {
      this.$nextTick(function() {
        let numberOfZeroes = "00"
        if (this.matchCount.length >= 10) {
          numberOfZeroes = "0"
        } else if (this.matchCount.length >= 100) {
          numberOfZeroes = ""
        }
        for (let i = 0; i < this.playerRankings.length; i++) {
          firebaseRankingsData.child(this.playerRankings[i].name).child("totalGamesPlayed").child(`${numberOfZeroes}${this.matchCount.length}`).set({
            gamesPlayed: this.playerRankings[i].gamesPlayed,
            playerRating: this.playerRankings[i].playerRating,
            winPercentage: this.playerRankings[i].winPercentage,
            pointsPerGame: this.playerRankings[i].pointsPerGame
          })
        }
      })
    }
  }
}

</script>

<style scoped>

.result {
  font-size: 0.75em;
  text-align: left;
  background: #b0b0b0;
}

.buttonsDiv {
  grid-template-columns: repeat(5, 1fr);
}

.increasePlayers {
  grid-column: 2 / 3;
}

.decreasePlayers {
  grid-column: 3 / 4;
}

.submitStats {
  grid-column: 4 / 5;
}

.statHeadersDiv, .statCellsDiv {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
}
.popUp {
  position: absolute;
  z-index: 2;
  left: 35%;
  top: 30%;
  width: 30%;
  height: 160px;
  border-radius: 5px;
  background: #b0b0b0;
}
.popUpHeaderOne {
  height: 18px;
  background: #303030;
  border-radius: 5px 5px 0 0;
}
.popUpHeaderTwo {
  height: 12px;
  background: #404040;
}
.popUpMessage {
  font-size: 16px;
  margin-top: 16px;
  height: 20px;
  overflow: hidden;

}
.inputDiv {
  height: 24px;
  margin: 4px auto;
}
.input {
  height: 16px;
  padding: 4px;
  margin: 4px auto;
  border-radius: 3px;
}
.popUpButtons {
  background: #505050;
  color: #ffffff;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 25px;
  margin-right: 5px;
  width: 60px;
  height: 16px;
  padding: 4px;
  float: right;
}
.popUpButtons:hover {
  background: #404040;
}
</style>
