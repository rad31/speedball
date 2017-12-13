import Vue from 'vue'
import mainPage from './mainPage.vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

export const bus = new Vue();

new Vue({
  el: '#vueMainPage',
  render: h => h(mainPage)
})
