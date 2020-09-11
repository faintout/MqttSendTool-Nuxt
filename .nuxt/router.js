import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4ae5be6d = () => interopDefault(import('..\\pages\\MovingInfoShow.vue' /* webpackChunkName: "pages/MovingInfoShow" */))
const _5521cd90 = () => interopDefault(import('..\\pages\\MqttSendTool.vue' /* webpackChunkName: "pages/MqttSendTool" */))
const _4cf0cdee = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/MovingInfoShow",
    component: _4ae5be6d,
    name: "MovingInfoShow"
  }, {
    path: "/MqttSendTool",
    component: _5521cd90,
    name: "MqttSendTool"
  }, {
    path: "/",
    component: _4cf0cdee,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
