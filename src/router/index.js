import Vue from "vue";
import VueRouter from "vue-router";
import MqttSendTool from "../views/MqttSendTool.vue";
import MovingInfoShow from "../views/MovingInfoShow.vue";
import layout from "../views/layout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "layout",
    component: layout,
    redirect:'/MqttSendTool',
    children: [
      {
        path: "/MqttSendTool",
        name: "MqttSendTool",
        component: MqttSendTool,
      },
      {
        path: "/MovingInfoShow",
        name: "MovingInfoShow",
        component: MovingInfoShow,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
