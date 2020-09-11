exports.ids = [2];
exports.modules = {

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["a"] = ({
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
    };
  },

  watch: {},
  computed: {},
  methods: {
    //设置本地储存方法
    local(key, value) {
      return value ? localStorage.setItem(key, value) : localStorage.getItem(key);
    },

    saveEdit() {
      this.tableLoading = true;
      this.dialogVisible = false;
      let indicatorValue = this.editTable; //保存

      let deviceId = this.editId;
      let switchStatus = this.editswitchStatus;
      let parmas = {
        indicatorValue,
        deviceId,
        switchStatus
      };
      $.ajax({
        type: 'POST',
        url: 'http://' + this.localIP + '/testData/setIndicatorValue',
        data: parmas,
        success: data => {
          this.tableLoading = false;
          data.success && this.$message({
            type: 'success',
            message: '数据修改成功！',
            duration: 1000,
            offset: 100
          });
        },
        error: () => {
          this.tableLoading = false;
          this.$message({
            type: 'error',
            message: '数据获取失败，请检查IP地址！',
            duration: 3000,
            offset: 100
          });
        }
      });
    },

    changeData(value) {
      this.dialogVisible = true;

      if (!value.switchStatus) {
        //等于一
        this.editTable = this.getFormatData(JSON.stringify(value.masterData));
      } else {
        this.editTable = this.getFormatData(JSON.stringify(value.slaveData));
      }

      this.editId = value.id;
      this.editswitchStatus = value.switchStatus;
    },

    //获取所有数据
    getAllMqttData() {
      this.tableLoading = true;
      $.ajax({
        type: 'POST',
        url: 'http://' + this.localIP + '/testData/getDeviceListData',
        success: data => {
          this.tableLoading = false;

          if (data.data == []) {
            this.$message({
              type: 'error',
              message: '获取数据为空！请确认数据是否存在',
              duration: 3000,
              offset: 100
            });
            return;
          }

          this.tableData = data.data;
          data.success && this.$message({
            type: 'success',
            message: '数据获取成功！',
            duration: 1000,
            offset: 100
          });
        },
        error: () => {
          this.tableLoading = false;
          this.$message({
            type: 'error',
            message: '数据获取失败，请检查IP地址！',
            duration: 3000,
            offset: 100
          });
        }
      });
    },

    //数据处理
    dataProcessing() {},

    //批量设置

    /**
     * @type 0 主 1 备 
     * @Date 2020-08-26 14:13:24
     */
    batch(type) {
      this.tableData.forEach(item => {
        item.switchStatus = type ? 1 : 0;
      });
      this.sendData();
    },

    //发送数据
    sendData(value) {
      this.tableLoading = true;
      let data = value ? value : this.tableData;
      let params = {
        deviceIds: ''
      };

      if (data.length > 1) {
        data.map(item => {
          params.deviceIds += item.id + ',';
        });
        params.deviceIds = params.deviceIds.substr(0, params.deviceIds.length - 1);
        params.switchStatus = data[0].switchStatus;
      } else {
        params.deviceIds = data.id;
        params.switchStatus = data.switchStatus;
      } // return


      $.ajax({
        type: "POST",
        url: 'http://' + this.localIP + '/testData/applySwitch',
        data: params,
        success: data => {
          data.success && this.$message({
            type: 'success',
            message: '数据发送成功！',
            duration: 1000,
            offset: 100
          });
          this.tableLoading = false;
        },
        error: err => {
          this.$message({
            type: 'error',
            message: err.msg || '数据发送错误！',
            duration: 1000,
            offset: 100
          });
          this.tableLoading = false;
        }
      }); // this.getAllMqttData()
    },

    //读取本地localIP
    getLocalIP() {
      this.localIP = '172.17.35.23:24699'; // local('localIP') == null && local('localIP', '172.17.35.23:24699')
    },

    //方法
    repeat(s, count) {
      return new Array(count + 1).join(s);
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
              indentLevel += 1;
            } else {
              newJson += currentChar;
            }

            break;

          case '}':
          case ']':
            if (!inString) {
              indentLevel -= 1;
              newJson += "\n" + this.repeat(tab, indentLevel) + currentChar;
            } else {
              newJson += currentChar;
            }

            break;

          case ',':
            if (!inString) {
              newJson += ",\n" + this.repeat(tab, indentLevel);
            } else {
              newJson += currentChar;
            }

            break;

          case ':':
            if (!inString) {
              newJson += ": ";
            } else {
              newJson += currentChar;
            }

            break;

          case ' ':
          case "\n":
          case "\t":
            if (inString) {
              newJson += currentChar;
            }

            break;

          case '"':
            if (i > 0 && json.charAt(i - 1) !== '\\') {
              inString = !inString;
            }

            newJson += currentChar;
            break;

          default:
            newJson += currentChar;
            break;
        }
      }

      return newJson;
    },

    getFormatData(json) {
      var json = json + "";

      if (json.indexOf('{') == -1 && json.indexOf('[') == -1) {
        return json;
      } else {
        return this.formatJson(json);
      }
    }

  },

  mounted() {
    //读取本地IP
    this.getLocalIP();
    this.getAllMqttData();
  },

  created() {}

});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(49)))

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(9).default
module.exports.__inject__ = function (context) {
  add("42b3f5bc", content, true, context)
};

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MqttSendTool_vue_vue_type_style_index_0_id_71053f6e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MqttSendTool_vue_vue_type_style_index_0_id_71053f6e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MqttSendTool_vue_vue_type_style_index_0_id_71053f6e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MqttSendTool_vue_vue_type_style_index_0_id_71053f6e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MqttSendTool_vue_vue_type_style_index_0_id_71053f6e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MqttSendTool_vue_vue_type_style_index_0_id_71053f6e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(8);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".content[data-v-71053f6e]{width:60%;margin:2% auto 0}.el_table[data-v-71053f6e]{width:100%;position:relative}.content_title[data-v-71053f6e]{text-align:right;margin-right:10%}[data-v-71053f6e] .el-message{top:50px!important}input[data-v-71053f6e]{height:20rem}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ 59:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./pages/MqttSendTool.vue?vue&type=template&id=71053f6e&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_vm._ssrNode("<title data-v-71053f6e></title> "),_vm._ssrNode("<div class=\"content_title\" data-v-71053f6e>","</div>",[_c('el-button',{attrs:{"type":"success","size":"small"},on:{"click":_vm.getAllMqttData}},[_vm._v("获取")]),_vm._ssrNode(" "),_c('el-button',{attrs:{"size":"mini"},on:{"click":function($event){return _vm.batch(0)}}},[_vm._v("批量主发送")]),_vm._ssrNode(" "),_c('el-button',{attrs:{"size":"mini"},on:{"click":function($event){return _vm.batch(1)}}},[_vm._v("批量备发送")])],2),_vm._ssrNode(" "),_c('el-table',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.tableLoading),expression:"tableLoading"}],staticClass:"el_table",attrs:{"data":_vm.tableData}},[_vm._v("\n        >\n        "),_c('el-table-column',{attrs:{"prop":"name","label":"名称","align":"center"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"切换源","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-radio-group',{model:{value:(scope.row.switchStatus),callback:function ($$v) {_vm.$set(scope.row, "switchStatus", $$v)},expression:"scope.row.switchStatus"}},[_c('el-radio',{attrs:{"label":0},on:{"click":function($event){scope.row.switchStatus = 0}}},[_vm._v("主")]),_vm._v(" "),_c('el-radio',{attrs:{"label":1},on:{"click":function($event){scope.row.switchStatus = 1}}},[_vm._v("备")])],1)]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-button',{attrs:{"type":"success","size":"small"},on:{"click":function($event){return _vm.changeData(scope.row)}}},[_vm._v("编辑")]),_vm._v(" "),_c('el-button',{attrs:{"type":"success","size":"small"},on:{"click":function($event){return _vm.sendData(scope.row)}}},[_vm._v("发送")])]}}])})],1),_vm._ssrNode(" "),_c('el-dialog',{attrs:{"title":"编辑","visible":_vm.dialogVisible,"width":"30%","close-on-click-modal":false},on:{"update:visible":function($event){_vm.dialogVisible=$event}}},[_c('el-input',{staticClass:"el_input",attrs:{"type":"textarea","rows":25},model:{value:(_vm.editTable),callback:function ($$v) {_vm.editTable=$$v},expression:"editTable"}}),_vm._v(" "),_c('span',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{on:{"click":function($event){_vm.dialogVisible = false}}},[_vm._v("取 消")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary"},on:{"click":_vm.saveEdit}},[_vm._v("确 定")])],1)],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/MqttSendTool.vue?vue&type=template&id=71053f6e&scoped=true&

// EXTERNAL MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/MqttSendTool.vue?vue&type=script&lang=js&
var MqttSendToolvue_type_script_lang_js_ = __webpack_require__(52);

// CONCATENATED MODULE: ./pages/MqttSendTool.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_MqttSendToolvue_type_script_lang_js_ = (MqttSendToolvue_type_script_lang_js_["a" /* default */]); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/MqttSendTool.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(56)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_MqttSendToolvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "71053f6e",
  "3bd96cbc"
  
)

/* harmony default export */ var MqttSendTool = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=MqttSendTool.js.map