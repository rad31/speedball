import Vue from 'vue'
import mainPage from './mainPage.vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

new Vue({
  el: '#vueMainPage',
  render: h => h(mainPage)
})
