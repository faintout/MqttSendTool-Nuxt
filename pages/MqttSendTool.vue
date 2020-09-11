<template>
    <div class="content">
        <title></title>
        <!-- 按钮模块 -->
        <div class="content_title">
            <!-- <el-input style="display:inline-block;width:20%;right: 5%;" size="small" v-model="localIP"></el-input> -->
            <el-button type="success" size="small" @click="getAllMqttData">获取</el-button>
            <el-button size="mini" @click="batch(0)">批量主发送</el-button>
            <el-button size="mini" @click="batch(1)">批量备发送</el-button>
            <!-- <el-button type="success" size="small" @click="sendData()">发送</el-button> -->
        </div>
        <el-table v-loading="tableLoading" :data="tableData" class="el_table">
            >
            <el-table-column prop="name" label="名称" align='center'>
            </el-table-column>
            <el-table-column label="切换源" align='center'>
                <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.switchStatus">
                        <el-radio :label="0" @click="scope.row.switchStatus = 0">主</el-radio>
                        <el-radio :label="1" @click="scope.row.switchStatus = 1">备</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="changeData(scope.row)">编辑</el-button>
                    <el-button type="success" size="small" @click="sendData(scope.row)">发送</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹框 -->
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="30%" :close-on-click-modal=false>
            <el-input type="textarea" :rows="25" class="el_input" v-model="editTable"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                dialogVisible: false,
                //本地IP
                localIP: '',
                //表格框加载
                tableLoading: false,
                tableData: [],
                editTable: '',
                editId: '',
                editswitchStatus: ''

            }
        },
        watch: {},
        computed: {

        },
        methods: {
            //设置本地储存方法
            local(key, value) {
                return value ? localStorage.setItem(key, value) : localStorage.getItem(key)
            },
            saveEdit() {
                this.tableLoading = true
                this.dialogVisible = false
                let indicatorValue = this.editTable
                //保存
                let deviceId = this.editId
                let switchStatus = this.editswitchStatus
                let parmas = { indicatorValue, deviceId, switchStatus }
                $.ajax({
                    type: 'POST',
                    url: 'http://' + this.localIP + '/testData/setIndicatorValue',
                    data: parmas,
                    success: (data) => {
                        this.tableLoading = false
                        data.success && this.$message({ type: 'success', message: '数据修改成功！', duration: 1000, offset: 100 })
                    },
                    error: () => {
                        this.tableLoading = false
                        this.$message({ type: 'error', message: '数据获取失败，请检查IP地址！', duration: 3000, offset: 100 })
                    }
                })
            },
            changeData(value) {
                this.dialogVisible = true
                if (!value.switchStatus) {
                    //等于一
                    this.editTable = this.getFormatData(JSON.stringify(value.masterData))
                } else {
                    this.editTable = this.getFormatData(JSON.stringify(value.slaveData))
                }
                this.editId = value.id
                this.editswitchStatus = value.switchStatus
            },
            //获取所有数据
            getAllMqttData() {
                this.tableLoading = true
                $.ajax({
                    type: 'POST',
                    url: 'http://' + this.localIP + '/testData/getDeviceListData',
                    success: (data) => {
                        this.tableLoading = false
                        if (data.data == []) {
                            this.$message({ type: 'error', message: '获取数据为空！请确认数据是否存在', duration: 3000, offset: 100 })
                            return
                        }
                        this.tableData = data.data
                        data.success && this.$message({ type: 'success', message: '数据获取成功！', duration: 1000, offset: 100 })
                    },
                    error: () => {
                        this.tableLoading = false
                        this.$message({ type: 'error', message: '数据获取失败，请检查IP地址！', duration: 3000, offset: 100 })
                    }
                })
            },
            //数据处理
            dataProcessing() {

            },
            //批量设置
            /**
             * @type 0 主 1 备 
             * @Date 2020-08-26 14:13:24
             */
            batch(type) {
                this.tableData.forEach(item => {
                    item.switchStatus = type ? 1 : 0
                })
                this.sendData()
            },
            //发送数据
            sendData(value) {
                this.tableLoading = true
                let data = value ? value : this.tableData
                let params = {
                    deviceIds: ''
                }
                if (data.length > 1) {
                    data.map(item => {
                        params.deviceIds += item.id + ','
                    })
                    params.deviceIds = params.deviceIds.substr(0, params.deviceIds.length - 1)
                    params.switchStatus = data[0].switchStatus
                } else {
                    params.deviceIds = data.id
                    params.switchStatus = data.switchStatus
                }
                // return
                $.ajax({
                    type: "POST",
                    url: 'http://' + this.localIP + '/testData/applySwitch',
                    data: params,
                    success: (data) => {
                        data.success && this.$message({ type: 'success', message: '数据发送成功！', duration: 1000, offset: 100 })
                        this.tableLoading = false
                    },
                    error: (err) => {
                        this.$message({ type: 'error', message: err.msg || '数据发送错误！', duration: 1000, offset: 100 })
                        this.tableLoading = false
                    }
                })
                // this.getAllMqttData()
            },
            //读取本地localIP
            getLocalIP() {
                this.localIP = '172.17.35.23:24699'
                // local('localIP') == null && local('localIP', '172.17.35.23:24699')
            },

            //方法
            repeat(s, count) {
                return new Array(count + 1).join(s)
            },
            //String 转为 JSON格式
            formatJson(json) {
                var i = 0,
                    il = 0,
                    tab = "    ",
                    newJson = "",
                    indentLevel = 0,
                    inString = false,
                    currentChar = null;
                for (i = 0, il = json.length; i < il; i += 1) {
                    currentChar = json.charAt(i);
                    switch (currentChar) {
                        case '{':
                        case '[':
                            if (!inString) {
                                newJson += currentChar + "\n" + this.repeat(tab, indentLevel + 1);
                                indentLevel += 1
                            } else {
                                newJson += currentChar
                            }
                            break;
                        case '}':
                        case ']':
                            if (!inString) {
                                indentLevel -= 1;
                                newJson += "\n" + this.repeat(tab, indentLevel) + currentChar
                            } else {
                                newJson += currentChar
                            }
                            break;
                        case ',':
                            if (!inString) {
                                newJson += ",\n" + this.repeat(tab, indentLevel)
                            } else {
                                newJson += currentChar
                            }
                            break;
                        case ':':
                            if (!inString) {
                                newJson += ": "
                            } else {
                                newJson += currentChar
                            }
                            break;
                        case ' ':
                        case "\n":
                        case "\t":
                            if (inString) {
                                newJson += currentChar
                            }
                            break;
                        case '"':
                            if (i > 0 && json.charAt(i - 1) !== '\\') {
                                inString = !inString
                            }
                            newJson += currentChar;
                            break;
                        default:
                            newJson += currentChar;
                            break
                    }
                }
                return newJson
            },
            getFormatData(json) {
                var json = json + "";
                if (json.indexOf('{') == -1 && json.indexOf('[') == -1) {
                    return json;
                } else {
                    return (this.formatJson(json));
                }
            }

        },
        mounted() {
            //读取本地IP
            this.getLocalIP()
            this.getAllMqttData()

        },
        created() {

        },
    }
</script>
<style lang="less" scoped>
    .content {
        width: 60%;
        margin: 2% auto;
        margin-bottom: 0;
    }

    .el_table {
        width: 100%;
        position: relative;

    }

    .content_title {
        text-align: right;
        margin-right: 10%;
    }

    /deep/.el-message {
        top: 50px !important;
    }

    input {
        height: 20rem;
    }
</style>