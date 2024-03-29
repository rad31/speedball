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
    "playerStats",
    "playerRankings",
    "popUp",
    "pageDisplayed",
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
      if (event.target.innerText === "Increase Players") {
        return this.increasePlayers()
      } else if (event.target.innerText === "Decrease Players") {
        return this.decreasePlayers()
      } else if (event.target.innerText === "Submit Stats") {
        return this.submitConditionsFirstFinishes()
      }
    },
    increasePlayers() {
      if (this.numberOfPlayers.length < 4) {
        this.numberOfPlayers.push(0)
      }
    },
    decreasePlayers() {
      if (this.numberOfPlayers.length > 1) {
        this.numberOfPlayers.pop()
      }
    },
    submitConditionsFirstFinishes() {
      let firstFinishers = 0
      for (let i = 0; i < this.numberOfPlayers.length * 2; i++) {
        firstFinishers += this.$refs.p[i].inputStats.firstFinishes
      }
      if (firstFinishers > 1) {
        this.$emit("changePopUpMessage", "Only one player could have finished first.")
        this.$emit("changePopUpDisplayed", true)
        this.$emit("changePopUpError", true)
      } else if (firstFinishers === 0) {
        if (this.numberOfPlayers.length > 1) {
          this.$emit("changePopUpMessage", "First finisher was not recorded.")
          this.$emit("changePopUpDisplayed", true)
          this.$emit("changePopUpError", true)
        } else if (this.numberOfPlayers.length === 1) {
          return this.submitConditionsNameBlank()
        }
      } else if (firstFinishers === 1) {
        return this.submitConditionsFinishes()
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
        this.$emit("changePopUpMessage", "The losing team could not all have finishes.")
        this.$emit("changePopUpDisplayed", true)
        this.$emit("changePopUpError", true)
      } else if (winnersFinishes < this.numberOfPlayers.length) {
        this.$emit("changePopUpMessage", "The winning team must all have finishes.")
        this.$emit("changePopUpDisplayed", true)
        this.$emit("changePopUpError", true)
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
        this.$emit("changePopUpMessage", "Please enter all players' names.")
        this.$emit("changePopUpDisplayed", true)
        this.$emit("changePopUpError", true)
      } else {
        this.$emit("changePopUpMessage", "Please enter the password:")
        this.$emit("changePopUpDisplayed", true)
        this.$emit("changePopUpError", false)
      }
    },
    exitPopUp() {
      if (this.popUp.error === true) {
        this.$emit("changePopUpDisplayed", false)
        if (this.popUp.message === "Stats submitted successfully!") {
          this.$emit("changePageDisplayed", "statistics")
        }
      } else if (this.popUp.error === false) {
        if (this.password.value === "hypetrain2018") {
          this.$emit("changePopUpMessage", "Stats submitted successfully!")
          this.$emit("changePopUpError", true)
          this.$emit("updateStats", true)
          this.password.value = ""
          this.submitStats()
        } else if (this.password.value !== "hypetrain2018") {
          this.$emit("changePopUpMessage", "Incorrect password entered.")
          this.$emit("changePopUpError", true)
          this.password.value = ""        }
      }
    },
    capitalizeFirstLetter(string) {
      let lower = string.toLowerCase()
      let firstLetter = lower.slice(0,1)
      return lower.replace(firstLetter, firstLetter.toUpperCase())
    },
    submitStats() {
      let numberOfZeroes = "00"
      if (this.matchCount.length + 1 >= 10) {
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
