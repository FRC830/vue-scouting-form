
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import axios from 'axios'
import JQuery from 'jquery'
window.$ = JQuery
window.JQuery = JQuery
Vue.config.productionTip = false

Vue.use(VueAxios, axios)

/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
