import { initializeApp }  from "firebase"

const app = initializeApp({
  apiKey: "AIzaSyBWXnawgN0C61IXeOuvOoMbl1kyyAvsdG4",
  authDomain: "national-speedball-league.firebaseapp.com",
  databaseURL: "https://national-speedball-league.firebaseio.com",
  projectId: "national-speedball-league",
  storageBucket: "national-speedball-league.appspot.com",
  messagingSenderId: "1000389051255"
})

export const db = app.database()
export const firebaseMatchData = db.ref("matchData")
export const firebaseMatchCount = db.ref("matchCount")
export const firebaseRankingsData = db.ref("rankingsData")
export const fbMatchData2018 = db.ref("matchData2018")
export const fbMatchCount2018 = db.ref("matchCount2018")
export const fbRankingsData2018 = db.ref("rankingsData2018")
