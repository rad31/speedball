import Vue from "vue"
import Main from "./Main.vue"
import VueResource from "vue-resource"
import VueFire from "vuefire"
import firebase from "firebase"
import "./firebase"

Vue.use(VueResource)
Vue.use(VueFire)

new Vue({
  el: "#vueMainPage",
  render: h => h(Main)
})
