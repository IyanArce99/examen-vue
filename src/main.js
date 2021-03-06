import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import underscore from 'vue-underscore'

Vue.config.productionTip = false
Vue.use(underscore);

new Vue({
  render: h => h(App),
}).$mount('#app')
