exports.ids = [1];
exports.modules = {

/***/ 50:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var core_js_modules_es6_array_sort__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
/* harmony import */ var core_js_modules_es6_array_sort__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_sort__WEBPACK_IMPORTED_MODULE_0__);

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
      dataText: '',
      timer: 0,
      timers: null,
      localIp: '172.17.35.23:24699',
      tableData: [],
      tableLoading: true
    };
  },

  watch: {
    timer(n, o) {
      if (n == 0 || o == 0) {
        clearInterval(this.timers);
      }

      if (n > 0 && n < 1000) {
        this.timer = 1000;
      }

      if (o == 0 && n > 0) {
        clearInterval(this.timers);
        this.getDeviceList(); // this.getData()
      }
    }

  },
  computed: {},
  methods: {
    // deviceIndValueEmpty(indicatorCurr, i, c) {
    //     let Obj = {}
    //     Obj.indicatorName = indicatorCurr.name;
    //     Obj.indicatorValue = '';
    //     Obj.unit = indicatorCurr.unit || ''
    //     Obj.id = i + c
    //     $scope.moduleList[indicatorCurr.id] = Obj
    // },
    //获取设备
    flitterData(arr) {
      let spanOneArr = [];
      let spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
          spanTwoArr.push(1);
        } else {
          if (item.deviceName === arr[index - 1].deviceName) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }

          ;

          if (item.code === arr[index - 1].code && item.deviceName === arr[index - 1].deviceName) {
            //第二列需合并相同内容的判断条件
            spanTwoArr[concatTwo] += 1;
            spanTwoArr.push(0);
          } else {
            spanTwoArr.push(1);
            concatTwo = index;
          }

          ;
        }
      });
      return {
        one: spanOneArr,
        two: spanTwoArr
      };
    },

    // 合并列
    objectSpanMethods({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0) {
        const _row = this.flitterData(this.tableData).one[rowIndex];

        const _col = _row > 0 ? 1 : 0;

        return {
          rowspan: _row,
          colspan: _col
        };
      } // if (columnIndex === 1) {
      //     const _row = (this.flitterData(this.tableData).two)[rowIndex];
      //     const _col = _row > 0 ? 1 : 0;
      //     return {
      //         rowspan: _row,
      //         colspan: _col
      //     };
      // }

    },

    //赋值空数据方法
    setIndicatorValueEmpty(deviceList, indicators, i, c) {
      let ObjEmpty = {};
      ObjEmpty.deviceName = deviceList[i].name;
      ObjEmpty.id = c;
      ObjEmpty.indicatorName = indicators[c].name || '';
      ObjEmpty.indicatorValue = indicators[c].value || '';
      ObjEmpty.indicatorUnit = indicators[c].unit || '';
      return ObjEmpty;
    },

    //获取设备信息
    getDeviceInfo() {
      return new Promise((res, rej) => {
        $.ajax({
          type: "POST",
          url: 'http://' + this.localIp + '/testData/getPowerDeviceMsg',
          success: deviceData => {
            res(deviceData.data);
          },
          error: err => {
            rej('设备获取失败' + '/testData/getPowerDeviceMsg');
          }
        });
      }).catch(e => {
        return e;
      });
    },

    //获取指标
    getDeviceIndocator() {
      return new Promise((res, rej) => {
        $.ajax({
          type: 'POST',
          url: 'http://' + this.localIp + '/testData/getPeDeviceIndicator',
          success: indicatorName => {
            res(indicatorName.data);
          },
          error: () => {
            rej('设备指标获取失败' + '/testData/getPeDeviceIndicator');
          }
        });
      }).catch(e => {
        return e;
      });
    },

    // 获取指标值
    getIndicatorData(deviceId) {
      return new Promise((res, rej) => {
        $.ajax({
          type: 'POST',
          url: 'http://' + this.localIp + '/testData/getPeDeviceIndicatorData',
          // url: 'http://' + self.localIp + '/testData/getPeDeviceIndicator',
          data: {
            deviceId
          },
          success: data => {
            res(data.data && (data.data.indicators.length ? data.data.indicators : []));
          },
          error: () => {
            rej('指标值获取失败' + '/testData/getPeDeviceIndicatorData');
          }
        });
      }).catch(e => {
        return e;
      });
    },

    async getDeviceList() {
      !this.timer && (this.tableLoading = true);
      this.timers && clearInterval(this.timers);
      let tableList = []; // this.tableData = []

      let self = this; //设备信息

      let deviceList = await this.getDeviceInfo();

      if (typeof deviceList == 'string') {
        this.$message({
          type: "error",
          message: deviceList,
          duration: 3000
        });
        this.tableLoading = false;
        return;
      }

      let indicators = await this.getDeviceIndocator();

      if (typeof indicators == 'string') {
        this.$message({
          type: "error",
          message: indicators,
          duration: 3000
        });
        this.tableLoading = false;
        return;
      }

      for (let i in deviceList) {
        var Obj = [];
        let datas = await this.getIndicatorData(deviceList[i].id);

        if (typeof datas == 'string') {
          this.$message({
            type: "error",
            message: datas,
            duration: 3000
          });
          this.tableLoading = false;
          return;
        } else {
          for (let a in datas) {
            for (let c in indicators) {
              if (indicators[c].id == datas[a].key) {
                let ObjChildren = {};
                let itemValueMap = indicators[c].indicatorValueMap;
                ObjChildren.deviceName = deviceList[i].name;
                ObjChildren.id = c;
                ObjChildren.indicatorName = indicators[c].name;
                ObjChildren.indicatorValue = itemValueMap != null ? JSON.parse(JSON.stringify(itemValueMap))[parseInt(datas[a].value)] : datas[a].value;
                ObjChildren.originValue = datas[a].value;
                ObjChildren.isValueMap = Boolean(itemValueMap != null);
                ObjChildren.indicatorUnit = indicators[c].unit || '';
                tableList.push(ObjChildren);
              }
            }
          }
        }
      }

      tableList.sort((a, b) => {
        return a.id - b.id;
      });
      this.tableData = tableList;
      this.tableLoading = false;

      if (this.timer == 0) {
        return;
      }

      this.timers = setInterval(() => {
        self.getDeviceList();
      }, self.timer);
    },

    getDeviceIndicator() {},

    getData() {
      this.timers && clearInterval(this.timers);
      $.ajax({
        type: "POST",
        async: false,
        url: 'http://' + this.localIp + '/testData/getPowerDeviceMsg',
        success: data => {
          data = data.data;
          let tempList = [];

          for (let i in data) {
            let obj = {};
            obj.deviceName = data[i].name;
            obj.indicatorName = data[i].name + 1;
            obj.indicatorValue = data[i].id;
            obj.id = data[i].id + 2;
            tempList.push(obj);
          }

          this.tableData = tempList;
          this.showData = data[0]; // this.timer = 1200
        }
      }); // this.tableData = []
    }

  },

  mounted() {
    this.getDeviceList(); // this.getData()
  },

  created() {},

  destroyed() {
    this.timers && clearInterval(this.timers);
  }

});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(49)))

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(9).default
module.exports.__inject__ = function (context) {
  add("3cd63508", content, true, context)
};

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MovingInfoShow_vue_vue_type_style_index_0_id_19b64e1e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MovingInfoShow_vue_vue_type_style_index_0_id_19b64e1e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MovingInfoShow_vue_vue_type_style_index_0_id_19b64e1e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MovingInfoShow_vue_vue_type_style_index_0_id_19b64e1e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MovingInfoShow_vue_vue_type_style_index_0_id_19b64e1e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_5_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_5_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_5_oneOf_1_3_node_modules_vue_loader_lib_index_js_vue_loader_options_MovingInfoShow_vue_vue_type_style_index_0_id_19b64e1e_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(8);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".red_round[data-v-19b64e1e]{background-color:red}.green_round[data-v-19b64e1e],.red_round[data-v-19b64e1e]{transform:translateY(19%);display:inline-block;width:1rem;height:1rem;border-radius:50%}.green_round[data-v-19b64e1e]{background-color:green}.content[data-v-19b64e1e]{width:60%;margin:2% auto 0}.el_table[data-v-19b64e1e]{width:100%;position:relative}.content_title[data-v-19b64e1e]{text-align:right;margin:0 10% 1% 0}[data-v-19b64e1e] .el-message{top:50px!important}input[data-v-19b64e1e]{height:20rem}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ 60:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./pages/MovingInfoShow.vue?vue&type=template&id=19b64e1e&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"content"},[_vm._ssrNode("<title data-v-19b64e1e></title> "),_vm._ssrNode("<div class=\"content_title\" data-v-19b64e1e>","</div>",[_vm._ssrNode("\n        定时刷新时间(MS),0为不刷新："),_c('el-input',{staticStyle:{"display":"inline-block","width":"10%","margin-right":"5%"},attrs:{"size":"small"},model:{value:(_vm.timer),callback:function ($$v) {_vm.timer=$$v},expression:"timer"}}),_vm._ssrNode(" "),_c('el-button',{attrs:{"size":"mini","type":"success"},on:{"click":_vm.getDeviceList}},[_vm._v("刷新")])],2),_vm._ssrNode(" "),_c('el-table',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.tableLoading),expression:"tableLoading"}],ref:"myTable",staticStyle:{"width":"100%","margin-bottom":"20px"},attrs:{"data":_vm.tableData,"span-method":_vm.objectSpanMethods,"row-key":"id","border":"","default-expand-all":""}},[_c('el-table-column',{attrs:{"prop":"deviceName","label":"设备","align":"center"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"indicatorName","label":"指标名称","align":"center"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"indicatorValue","label":"指标值","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [(scope.row.isValueMap&&scope.row.originValue==1)?_c('i',{staticClass:"red_round"}):_vm._e(),_vm._v(" "),(scope.row.isValueMap&&scope.row.originValue==0)?_c('i',{staticClass:"green_round"}):_vm._e(),_vm._v("\n                "+_vm._s(scope.row.indicatorValue)+_vm._s(scope.row.indicatorUnit)+"\n            ")]}}])})],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/MovingInfoShow.vue?vue&type=template&id=19b64e1e&scoped=true&

// EXTERNAL MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/MovingInfoShow.vue?vue&type=script&lang=js&
var MovingInfoShowvue_type_script_lang_js_ = __webpack_require__(50);

// CONCATENATED MODULE: ./pages/MovingInfoShow.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_MovingInfoShowvue_type_script_lang_js_ = (MovingInfoShowvue_type_script_lang_js_["a" /* default */]); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/MovingInfoShow.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(54)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_MovingInfoShowvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "19b64e1e",
  "7fed7e1e"
  
)

/* harmony default export */ var MovingInfoShow = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=MovingInfoShow.js.map