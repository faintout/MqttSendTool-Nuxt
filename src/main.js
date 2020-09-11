import Vue from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'

Vue.config.productionTip = false
Vue.use(ElementUi)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
