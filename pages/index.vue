<template>
    <div>
        <!-- <header-info></header-info> -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">MQTT批量下发工具</el-menu-item>
            <el-menu-item index="2">动环指标数据展示</el-menu-item>
        </el-menu>
        <!-- <router-link to='/MqttSendTool'>MQTT批量下发工具</router-link>
        <router-link to='/MovingInfoShow'>动环指标数据展示</router-link> -->
        <!-- <router-link to="/MqttSendTool">MQTT批量下发工具</router-link>
        <router-link to="/MovingInfoShow">动环指标数据展示</router-link> -->
        <mqtt-send-tool v-if='activeIndex==1'></mqtt-send-tool>
        <moving-info-show v-if='activeIndex==2'></moving-info-show>
        <!-- <router-view></router-view> -->
    </div>
</template>

<script>
    // import headerInfo from './header.vue'
    import MqttSendTool from './MqttSendTool'
    import MovingInfoShow from './MovingInfoShow'
    export default {
        components: {
            MqttSendTool,
            MovingInfoShow
        },
        data() {
            return {
                activeIndex: '1',
            }
        },
        watch: {},
        computed: {},
        methods: {
            handleSelect(key, keyPath) {
                this.activeIndex = key
            }
        },
        mounted() {},
        created() {},
    }
</script>
<style lang="less" scoped>
    .el-menu-demo {
        padding-left: 30%;
    }
</style>