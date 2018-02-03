import Vue from 'vue'
import mainPage from './mainPage.vue'
import VueResource from 'vue-resource'
import VueFire from 'vuefire'
import Firebase from 'firebase'
import './firebase'

Vue.use(VueResource)
Vue.use(VueFire)

new Vue({
  el: '#vueMainPage',
  render: h => h(mainPage)
})
