!(function (root, factory) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = factory(require('Vue')))
    : 'function' == typeof define && define.amd
    ? define(['Vue'], factory)
    : 'object' == typeof exports
    ? (exports.Header = factory(require('Vue')))
    : (root.Header = factory(root.Vue));
})(window, function (__WEBPACK_EXTERNAL_MODULE_vue__) {
  return (function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) return installedModules[moduleId].exports;
      var module = (installedModules[moduleId] = { i: moduleId, l: !1, exports: {} });
      return (
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__),
        (module.l = !0),
        module.exports
      );
    }
    return (
      (__webpack_require__.m = modules),
      (__webpack_require__.c = installedModules),
      (__webpack_require__.d = function (exports, name, getter) {
        __webpack_require__.o(exports, name) ||
          Object.defineProperty(exports, name, { enumerable: !0, get: getter });
      }),
      (__webpack_require__.r = function (exports) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(exports, '__esModule', { value: !0 });
      }),
      (__webpack_require__.t = function (value, mode) {
        if ((1 & mode && (value = __webpack_require__(value)), 8 & mode)) return value;
        if (4 & mode && 'object' == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (
          (__webpack_require__.r(ns),
          Object.defineProperty(ns, 'default', { enumerable: !0, value: value }),
          2 & mode && 'string' != typeof value)
        )
          for (var key in value)
            __webpack_require__.d(
              ns,
              key,
              function (key) {
                return value[key];
              }.bind(null, key)
            );
        return ns;
      }),
      (__webpack_require__.n = function (module) {
        var getter =
          module && module.__esModule
            ? function () {
                return module.default;
              }
            : function () {
                return module;
              };
        return __webpack_require__.d(getter, 'a', getter), getter;
      }),
      (__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      }),
      (__webpack_require__.p = ''),
      __webpack_require__((__webpack_require__.s = './src/Header.vue'))
    );
  })({
    './node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-switches/dist/switches.css?vue&type=style&index=0&lang=css&': function (
      module,
      exports,
      __webpack_require__
    ) {
      (module.exports = __webpack_require__('./node_modules/css-loader/dist/runtime/api.js')(
        !1
      )).push([
        module.i,
        "/**\n * Default\n */\n/**\n * Bulma\n */\n/**\n * Bootstrap\n */\n.vue-switcher {\n  position: relative;\n  display: inline-block;\n}\n.vue-switcher__label {\n    display: block;\n    font-size: 10px;\n    margin-bottom: 5px;\n}\n.vue-switcher input {\n    opacity: 0;\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    z-index: 1;\n    cursor: pointer;\n}\n.vue-switcher div {\n    height: 15px;\n    width: 36px;\n    position: relative;\n    border-radius: 30px;\n    display: -webkit-flex;\n    display: -ms-flex;\n    display: flex;\n    align-items: center;\n    justify-content: flex-start;\n    cursor: pointer;\n    transition: linear .2s, background-color linear .2s;\n}\n.vue-switcher div:after {\n      content: '';\n      height: 20px;\n      width: 20px;\n      border-radius: 100px;\n      display: block;\n      transition: linear .15s, background-color linear .15s;\n      position: absolute;\n      left: 100%;\n      margin-left: -18px;\n      cursor: pointer;\n      top: -3px;\n      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);\n}\n.vue-switcher--unchecked div {\n    justify-content: flex-end;\n}\n.vue-switcher--unchecked div:after {\n      left: 15px;\n}\n.vue-switcher--disabled div {\n    opacity: .3;\n}\n.vue-switcher--disabled input {\n    cursor: not-allowed;\n}\n.vue-switcher--bold div {\n    top: -8px;\n    height: 26px;\n    width: 51px;\n}\n.vue-switcher--bold div:after {\n      margin-left: -24px;\n      top: 3px;\n}\n.vue-switcher--bold--unchecked div:after {\n    left: 28px;\n}\n.vue-switcher--bold .vue-switcher__label span {\n    padding-bottom: 7px;\n    display: inline-block;\n}\n.vue-switcher-theme--default.vue-switcher-color--default div {\n    background-color: #b7b7b7;\n}\n.vue-switcher-theme--default.vue-switcher-color--default div:after {\n      background-color: #9d9d9d;\n}\n.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked div {\n    background-color: #aaa;\n}\n.vue-switcher-theme--default.vue-switcher-color--default.vue-switcher--unchecked div:after {\n      background-color: #c4c4c4;\n}\n.vue-switcher-theme--default.vue-switcher-color--blue div {\n    background-color: #77b0c8;\n}\n.vue-switcher-theme--default.vue-switcher-color--blue div:after {\n      background-color: #539bb9;\n}\n.vue-switcher-theme--default.vue-switcher-color--blue.vue-switcher--unchecked div {\n    background-color: #c0dae5;\n}\n.vue-switcher-theme--default.vue-switcher-color--blue.vue-switcher--unchecked div:after {\n      background-color: #77b0c8;\n}\n.vue-switcher-theme--default.vue-switcher-color--red div {\n    background-color: #c87777;\n}\n.vue-switcher-theme--default.vue-switcher-color--red div:after {\n      background-color: #b95353;\n}\n.vue-switcher-theme--default.vue-switcher-color--red.vue-switcher--unchecked div {\n    background-color: #e5c0c0;\n}\n.vue-switcher-theme--default.vue-switcher-color--red.vue-switcher--unchecked div:after {\n      background-color: #c87777;\n}\n.vue-switcher-theme--default.vue-switcher-color--yellow div {\n    background-color: #c9c377;\n}\n.vue-switcher-theme--default.vue-switcher-color--yellow div:after {\n      background-color: #bab353;\n}\n.vue-switcher-theme--default.vue-switcher-color--yellow.vue-switcher--unchecked div {\n    background-color: #e6e3c0;\n}\n.vue-switcher-theme--default.vue-switcher-color--yellow.vue-switcher--unchecked div:after {\n      background-color: #c9c377;\n}\n.vue-switcher-theme--default.vue-switcher-color--orange div {\n    background-color: #c89577;\n}\n.vue-switcher-theme--default.vue-switcher-color--orange div:after {\n      background-color: #b97953;\n}\n.vue-switcher-theme--default.vue-switcher-color--orange.vue-switcher--unchecked div {\n    background-color: #e5cec0;\n}\n.vue-switcher-theme--default.vue-switcher-color--orange.vue-switcher--unchecked div:after {\n      background-color: #c89577;\n}\n.vue-switcher-theme--default.vue-switcher-color--green div {\n    background-color: #77c88d;\n}\n.vue-switcher-theme--default.vue-switcher-color--green div:after {\n      background-color: #53b96e;\n}\n.vue-switcher-theme--default.vue-switcher-color--green.vue-switcher--unchecked div {\n    background-color: #c0e5ca;\n}\n.vue-switcher-theme--default.vue-switcher-color--green.vue-switcher--unchecked div:after {\n      background-color: #77c88d;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--default div {\n    background-color: gainsboro;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--default div:after {\n      background-color: #f5f5f5;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--default.vue-switcher--unchecked div {\n    background-color: #e8e8e8;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--default.vue-switcher--unchecked div:after {\n      background-color: #f5f5f5;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--primary div {\n    background-color: #05ffda;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--primary div:after {\n      background-color: #00d1b2;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--primary.vue-switcher--unchecked div {\n    background-color: #6bffe9;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--primary.vue-switcher--unchecked div:after {\n      background-color: #05ffda;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--blue div {\n    background-color: #5e91e3;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--blue div:after {\n      background-color: #3273dc;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--blue.vue-switcher--unchecked div {\n    background-color: #b5ccf2;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--blue.vue-switcher--unchecked div:after {\n      background-color: #5e91e3;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--red div {\n    background-color: #ff6b89;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--red div:after {\n      background-color: #ff3860;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--red.vue-switcher--unchecked div {\n    background-color: #ffd1da;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--red.vue-switcher--unchecked div:after {\n      background-color: #ff6b89;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--yellow div {\n    background-color: #ffe78a;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--yellow div:after {\n      background-color: #ffdd57;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--yellow.vue-switcher--unchecked div {\n    background-color: #fffcf0;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--yellow.vue-switcher--unchecked div:after {\n      background-color: #ffe78a;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--green div {\n    background-color: #3dde75;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--green div:after {\n      background-color: #22c65b;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--green.vue-switcher--unchecked div {\n    background-color: #94edb3;\n}\n.vue-switcher-theme--bulma.vue-switcher-color--green.vue-switcher--unchecked div:after {\n      background-color: #3dde75;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--default div {\n    background-color: #e6e6e6;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--default div:after {\n      background-color: #f0f0f0;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--default.vue-switcher--unchecked div {\n    background-color: whitesmoke;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--default.vue-switcher--unchecked div:after {\n      background-color: #f0f0f0;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--primary div {\n    background-color: #4f93ce;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--primary div:after {\n      background-color: #337ab7;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--primary.vue-switcher--unchecked div {\n    background-color: #9fc4e4;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--primary.vue-switcher--unchecked div:after {\n      background-color: #4f93ce;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--success div {\n    background-color: #80c780;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--success div:after {\n      background-color: #5cb85c;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--success.vue-switcher--unchecked div {\n    background-color: #c7e6c7;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--success.vue-switcher--unchecked div:after {\n      background-color: #80c780;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--info div {\n    background-color: #85d0e7;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--info div:after {\n      background-color: #5bc0de;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--info.vue-switcher--unchecked div {\n    background-color: #daf1f8;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--info.vue-switcher--unchecked div:after {\n      background-color: #85d0e7;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--warning div {\n    background-color: #f4c37d;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--warning div:after {\n      background-color: #f0ad4e;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--warning.vue-switcher--unchecked div {\n    background-color: #fceedb;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--warning.vue-switcher--unchecked div:after {\n      background-color: #f4c37d;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--danger div {\n    background-color: #d9534f;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--danger div:after {\n      background-color: #c9302c;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--danger.vue-switcher--unchecked div {\n    background-color: #eba5a3;\n}\n.vue-switcher-theme--bootstrap.vue-switcher-color--danger.vue-switcher--unchecked div:after {\n      background-color: #d9534f;\n}\n",
        '',
      ]);
    },
    './node_modules/css-loader/dist/cjs.js!./node_modules/vue-slider-component/theme/default.css': function (
      module,
      exports,
      __webpack_require__
    ) {
      (module.exports = __webpack_require__('./node_modules/css-loader/dist/runtime/api.js')(
        !1
      )).push([
        module.i,
        '/* component style */\n.vue-slider-disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n/* rail style */\n.vue-slider-rail {\n  background-color: #ccc;\n  border-radius: 15px;\n}\n\n/* process style */\n.vue-slider-process {\n  background-color: #3498db;\n  border-radius: 15px;\n}\n\n/* mark style */\n.vue-slider-mark {\n  z-index: 4;\n}\n.vue-slider-mark:first-child .vue-slider-mark-step, .vue-slider-mark:last-child .vue-slider-mark-step {\n  display: none;\n}\n.vue-slider-mark-step {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  background-color: rgba(0, 0, 0, 0.16);\n}\n.vue-slider-mark-label {\n  font-size: 14px;\n  white-space: nowrap;\n}\n/* dot style */\n.vue-slider-dot-handle {\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  background-color: #fff;\n  box-sizing: border-box;\n  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);\n}\n.vue-slider-dot-handle-focus {\n  box-shadow: 0px 0px 1px 2px rgba(52, 152, 219, 0.36);\n}\n\n.vue-slider-dot-handle-disabled {\n  cursor: not-allowed;\n  background-color: #ccc;\n}\n\n.vue-slider-dot-tooltip-inner {\n  font-size: 14px;\n  white-space: nowrap;\n  padding: 2px 5px;\n  min-width: 20px;\n  text-align: center;\n  color: #fff;\n  border-radius: 5px;\n  border-color: #3498db;\n  background-color: #3498db;\n  box-sizing: content-box;\n}\n.vue-slider-dot-tooltip-inner::after {\n  content: "";\n  position: absolute;\n}\n.vue-slider-dot-tooltip-inner-top::after {\n  top: 100%;\n  left: 50%;\n  transform: translate(-50%, 0);\n  height: 0;\n  width: 0;\n  border-color: transparent;\n  border-style: solid;\n  border-width: 5px;\n  border-top-color: inherit;\n}\n.vue-slider-dot-tooltip-inner-bottom::after {\n  bottom: 100%;\n  left: 50%;\n  transform: translate(-50%, 0);\n  height: 0;\n  width: 0;\n  border-color: transparent;\n  border-style: solid;\n  border-width: 5px;\n  border-bottom-color: inherit;\n}\n.vue-slider-dot-tooltip-inner-left::after {\n  left: 100%;\n  top: 50%;\n  transform: translate(0, -50%);\n  height: 0;\n  width: 0;\n  border-color: transparent;\n  border-style: solid;\n  border-width: 5px;\n  border-left-color: inherit;\n}\n.vue-slider-dot-tooltip-inner-right::after {\n  right: 100%;\n  top: 50%;\n  transform: translate(0, -50%);\n  height: 0;\n  width: 0;\n  border-color: transparent;\n  border-style: solid;\n  border-width: 5px;\n  border-right-color: inherit;\n}\n\n.vue-slider-dot-tooltip-wrapper {\n  opacity: 0;\n  transition: all 0.3s;\n}\n.vue-slider-dot-tooltip-wrapper-show {\n  opacity: 1;\n}\n',
        '',
      ]);
    },
    './node_modules/css-loader/dist/runtime/api.js': function (
      module,
      exports,
      __webpack_require__
    ) {
      'use strict';
      module.exports = function (useSourceMap) {
        var list = [];
        return (
          (list.toString = function () {
            return this.map(function (item) {
              var content = (function (item, useSourceMap) {
                var content = item[1] || '',
                  cssMapping = item[3];
                if (!cssMapping) return content;
                if (useSourceMap && 'function' == typeof btoa) {
                  var sourceMapping =
                      ((sourceMap = cssMapping),
                      '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) +
                        ' */'),
                    sourceURLs = cssMapping.sources.map(function (source) {
                      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
                    });
                  return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
                }
                var sourceMap;
                return [content].join('\n');
              })(item, useSourceMap);
              return item[2] ? '@media ' + item[2] + '{' + content + '}' : content;
            }).join('');
          }),
          (list.i = function (modules, mediaQuery) {
            'string' == typeof modules && (modules = [[null, modules, '']]);
            for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
              var id = this[i][0];
              null != id && (alreadyImportedModules[id] = !0);
            }
            for (i = 0; i < modules.length; i++) {
              var item = modules[i];
              (null != item[0] && alreadyImportedModules[item[0]]) ||
                (mediaQuery && !item[2]
                  ? (item[2] = mediaQuery)
                  : mediaQuery && (item[2] = '(' + item[2] + ') and (' + mediaQuery + ')'),
                list.push(item));
            }
          }),
          list
        );
      };
    },
    './node_modules/vue-slider-component/dist/vue-slider-component.umd.min.js': function (
      module,
      exports,
      __webpack_require__
    ) {
      var t;
      'undefined' != typeof self && self,
        (module.exports =
          ((t = __webpack_require__('vue')),
          (function (t) {
            var e = {};
            function r(n) {
              if (e[n]) return e[n].exports;
              var o = (e[n] = { i: n, l: !1, exports: {} });
              return t[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
            }
            return (
              (r.m = t),
              (r.c = e),
              (r.d = function (t, e, n) {
                r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
              }),
              (r.r = function (t) {
                'undefined' != typeof Symbol &&
                  Symbol.toStringTag &&
                  Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
                  Object.defineProperty(t, '__esModule', { value: !0 });
              }),
              (r.t = function (t, e) {
                if ((1 & e && (t = r(t)), 8 & e)) return t;
                if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
                var n = Object.create(null);
                if (
                  (r.r(n),
                  Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
                  2 & e && 'string' != typeof t)
                )
                  for (var o in t)
                    r.d(
                      n,
                      o,
                      function (e) {
                        return t[e];
                      }.bind(null, o)
                    );
                return n;
              }),
              (r.n = function (t) {
                var e =
                  t && t.__esModule
                    ? function () {
                        return t.default;
                      }
                    : function () {
                        return t;
                      };
                return r.d(e, 'a', e), e;
              }),
              (r.o = function (t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
              }),
              (r.p = ''),
              r((r.s = 'fb15'))
            );
          })({
            2350: function (t, e) {
              function r(t, e) {
                var r = t[1] || '',
                  o = t[3];
                if (!o) return r;
                if (e && 'function' == typeof btoa) {
                  var i = (function (t) {
                      return (
                        '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(t)))) +
                        ' */'
                      );
                    })(o),
                    s = o.sources.map(function (t) {
                      return '/*# sourceURL=' + o.sourceRoot + t + ' */';
                    });
                  return [r].concat(s).concat([i]).join('\n');
                }
                return [r].join('\n');
              }
              t.exports = function (t) {
                var e = [];
                return (
                  (e.toString = function () {
                    return this.map(function (e) {
                      var n = r(e, t);
                      return e[2] ? '@media ' + e[2] + '{' + n + '}' : n;
                    }).join('');
                  }),
                  (e.i = function (t, r) {
                    'string' == typeof t && (t = [[null, t, '']]);
                    for (var n = {}, o = 0; o < this.length; o++) {
                      var i = this[o][0];
                      'number' == typeof i && (n[i] = !0);
                    }
                    for (o = 0; o < t.length; o++) {
                      var s = t[o];
                      ('number' == typeof s[0] && n[s[0]]) ||
                        (r && !s[2] ? (s[2] = r) : r && (s[2] = '(' + s[2] + ') and (' + r + ')'),
                        e.push(s));
                    }
                  }),
                  e
                );
              };
            },
            '499e': function (t, e, r) {
              'use strict';
              function n(t, e) {
                for (var r = [], n = {}, o = 0; o < e.length; o++) {
                  var i = e[o],
                    s = i[0],
                    a = i[1],
                    u = i[2],
                    l = i[3],
                    c = { id: t + ':' + o, css: a, media: u, sourceMap: l };
                  n[s] ? n[s].parts.push(c) : r.push((n[s] = { id: s, parts: [c] }));
                }
                return r;
              }
              r.r(e),
                r.d(e, 'default', function () {
                  return h;
                });
              var o = 'undefined' != typeof document;
              if ('undefined' != typeof DEBUG && DEBUG && !o)
                throw new Error(
                  "vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
                );
              var i = {},
                s = o && (document.head || document.getElementsByTagName('head')[0]),
                a = null,
                u = 0,
                l = !1,
                c = function () {},
                d = null,
                f = 'data-vue-ssr-id',
                p =
                  'undefined' != typeof navigator &&
                  /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
              function h(t, e, r, o) {
                (l = r), (d = o || {});
                var s = n(t, e);
                return (
                  y(s),
                  function (e) {
                    for (var r = [], o = 0; o < s.length; o++) {
                      var a = s[o],
                        u = i[a.id];
                      u.refs--, r.push(u);
                    }
                    for (e ? y((s = n(t, e))) : (s = []), o = 0; o < r.length; o++)
                      if (0 === (u = r[o]).refs) {
                        for (var l = 0; l < u.parts.length; l++) u.parts[l]();
                        delete i[u.id];
                      }
                  }
                );
              }
              function y(t) {
                for (var e = 0; e < t.length; e++) {
                  var r = t[e],
                    n = i[r.id];
                  if (n) {
                    n.refs++;
                    for (var o = 0; o < n.parts.length; o++) n.parts[o](r.parts[o]);
                    for (; o < r.parts.length; o++) n.parts.push(m(r.parts[o]));
                    n.parts.length > r.parts.length && (n.parts.length = r.parts.length);
                  } else {
                    var s = [];
                    for (o = 0; o < r.parts.length; o++) s.push(m(r.parts[o]));
                    i[r.id] = { id: r.id, refs: 1, parts: s };
                  }
                }
              }
              function v() {
                var t = document.createElement('style');
                return (t.type = 'text/css'), s.appendChild(t), t;
              }
              function m(t) {
                var e,
                  r,
                  n = document.querySelector('style[' + f + '~="' + t.id + '"]');
                if (n) {
                  if (l) return c;
                  n.parentNode.removeChild(n);
                }
                if (p) {
                  var o = u++;
                  (n = a || (a = v())), (e = g.bind(null, n, o, !1)), (r = g.bind(null, n, o, !0));
                } else
                  (n = v()),
                    (e = function (t, e) {
                      var r = e.css,
                        n = e.media,
                        o = e.sourceMap;
                      if (
                        (n && t.setAttribute('media', n),
                        d.ssrId && t.setAttribute(f, e.id),
                        o &&
                          ((r += '\n/*# sourceURL=' + o.sources[0] + ' */'),
                          (r +=
                            '\n/*# sourceMappingURL=data:application/json;base64,' +
                            btoa(unescape(encodeURIComponent(JSON.stringify(o)))) +
                            ' */')),
                        t.styleSheet)
                      )
                        t.styleSheet.cssText = r;
                      else {
                        for (; t.firstChild; ) t.removeChild(t.firstChild);
                        t.appendChild(document.createTextNode(r));
                      }
                    }.bind(null, n)),
                    (r = function () {
                      n.parentNode.removeChild(n);
                    });
                return (
                  e(t),
                  function (n) {
                    if (n) {
                      if (n.css === t.css && n.media === t.media && n.sourceMap === t.sourceMap)
                        return;
                      e((t = n));
                    } else r();
                  }
                );
              }
              var b = (function () {
                var t = [];
                return function (e, r) {
                  return (t[e] = r), t.filter(Boolean).join('\n');
                };
              })();
              function g(t, e, r, n) {
                var o = r ? '' : n.css;
                if (t.styleSheet) t.styleSheet.cssText = b(e, o);
                else {
                  var i = document.createTextNode(o),
                    s = t.childNodes;
                  s[e] && t.removeChild(s[e]),
                    s.length ? t.insertBefore(i, s[e]) : t.appendChild(i);
                }
              }
            },
            '4abb': function (t, e, r) {
              var n = r('df80');
              'string' == typeof n && (n = [[t.i, n, '']]), n.locals && (t.exports = n.locals);
              var o = r('499e').default;
              o('3e7284f8', n, !0, { sourceMap: !1, shadowMode: !1 });
            },
            '4ed8': function (t, e, r) {
              var n = r('ae61');
              'string' == typeof n && (n = [[t.i, n, '']]), n.locals && (t.exports = n.locals);
              var o = r('499e').default;
              o('57c2b2f0', n, !0, { sourceMap: !1, shadowMode: !1 });
            },
            '556c': function (t, e, r) {
              var n = r('d5ac');
              'string' == typeof n && (n = [[t.i, n, '']]), n.locals && (t.exports = n.locals);
              var o = r('499e').default;
              o('f3ffc7f8', n, !0, { sourceMap: !1, shadowMode: !1 });
            },
            '65d9': function (t, e, r) {
              'use strict';
              /**
               * vue-class-component v7.0.1
               * (c) 2015-present Evan You
               * @license MIT
               */ Object.defineProperty(e, '__esModule', { value: !0 });
              var o = (function (t) {
                  return t && 'object' == typeof t && 'default' in t ? t.default : t;
                })(r('8bbf')),
                i =
                  'undefined' != typeof Reflect &&
                  Reflect.defineMetadata &&
                  Reflect.getOwnMetadataKeys;
              function s(t, e) {
                a(t, e),
                  Object.getOwnPropertyNames(e.prototype).forEach(function (r) {
                    a(t.prototype, e.prototype, r);
                  }),
                  Object.getOwnPropertyNames(e).forEach(function (r) {
                    a(t, e, r);
                  });
              }
              function a(t, e, r) {
                var n = r ? Reflect.getOwnMetadataKeys(e, r) : Reflect.getOwnMetadataKeys(e);
                n.forEach(function (n) {
                  var o = r ? Reflect.getOwnMetadata(n, e, r) : Reflect.getOwnMetadata(n, e);
                  r ? Reflect.defineMetadata(n, o, t, r) : Reflect.defineMetadata(n, o, t);
                });
              }
              var l = { __proto__: [] } instanceof Array,
                h = [
                  'data',
                  'beforeCreate',
                  'created',
                  'beforeMount',
                  'mounted',
                  'beforeDestroy',
                  'destroyed',
                  'beforeUpdate',
                  'updated',
                  'activated',
                  'deactivated',
                  'render',
                  'errorCaptured',
                  'serverPrefetch',
                ];
              function y(t, e) {
                void 0 === e && (e = {}), (e.name = e.name || t._componentTag || t.name);
                var r = t.prototype;
                Object.getOwnPropertyNames(r).forEach(function (t) {
                  if ('constructor' !== t)
                    if (h.indexOf(t) > -1) e[t] = r[t];
                    else {
                      var n = Object.getOwnPropertyDescriptor(r, t);
                      void 0 !== n.value
                        ? 'function' == typeof n.value
                          ? ((e.methods || (e.methods = {}))[t] = n.value)
                          : (e.mixins || (e.mixins = [])).push({
                              data: function () {
                                var e;
                                return ((e = {})[t] = n.value), e;
                              },
                            })
                        : (n.get || n.set) &&
                          ((e.computed || (e.computed = {}))[t] = { get: n.get, set: n.set });
                    }
                }),
                  (e.mixins || (e.mixins = [])).push({
                    data: function () {
                      return (function (t, e) {
                        var r = e.prototype._init;
                        e.prototype._init = function () {
                          var e = this,
                            r = Object.getOwnPropertyNames(t);
                          if (t.$options.props)
                            for (var n in t.$options.props) t.hasOwnProperty(n) || r.push(n);
                          r.forEach(function (r) {
                            '_' !== r.charAt(0) &&
                              Object.defineProperty(e, r, {
                                get: function () {
                                  return t[r];
                                },
                                set: function (e) {
                                  t[r] = e;
                                },
                                configurable: !0,
                              });
                          });
                        };
                        var n = new e();
                        e.prototype._init = r;
                        var o = {};
                        return (
                          Object.keys(n).forEach(function (t) {
                            void 0 !== n[t] && (o[t] = n[t]);
                          }),
                          o
                        );
                      })(this, t);
                    },
                  });
                var n = t.__decorators__;
                n &&
                  (n.forEach(function (t) {
                    return t(e);
                  }),
                  delete t.__decorators__);
                var a = Object.getPrototypeOf(t.prototype),
                  u = a instanceof o ? a.constructor : o,
                  l = u.extend(e);
                return v(l, t, u), i && s(l, t), l;
              }
              function v(t, e, r) {
                Object.getOwnPropertyNames(e).forEach(function (n) {
                  if ('prototype' !== n) {
                    var o = Object.getOwnPropertyDescriptor(t, n);
                    if (!o || o.configurable) {
                      var i = Object.getOwnPropertyDescriptor(e, n);
                      if (!l) {
                        if ('cid' === n) return;
                        var s = Object.getOwnPropertyDescriptor(r, n);
                        if (
                          !(function (t) {
                            var e = typeof t;
                            return null == t || ('object' !== e && 'function' !== e);
                          })(i.value) &&
                          s &&
                          s.value === i.value
                        )
                          return;
                      }
                      Object.defineProperty(t, n, i);
                    }
                  }
                });
              }
              function m(t) {
                return 'function' == typeof t
                  ? y(t)
                  : function (e) {
                      return y(e, t);
                    };
              }
              (m.registerHooks = function (t) {
                h.push.apply(h, t);
              }),
                (e.default = m),
                (e.createDecorator = function (t) {
                  return function (e, r, n) {
                    var o = 'function' == typeof e ? e : e.constructor;
                    o.__decorators__ || (o.__decorators__ = []),
                      'number' != typeof n && (n = void 0),
                      o.__decorators__.push(function (e) {
                        return t(e, r, n);
                      });
                  };
                }),
                (e.mixins = function () {
                  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                  return o.extend({ mixins: t });
                });
            },
            '8bbf': function (e, r) {
              e.exports = t;
            },
            ae61: function (t, e, r) {
              (t.exports = r('2350')(!1)).push([
                t.i,
                '.vue-slider-dot{position:absolute;will-change:transform;-webkit-transition:all 0s;transition:all 0s;z-index:5}.vue-slider-dot-tooltip{position:absolute;visibility:hidden}.vue-slider-dot-tooltip-show{visibility:visible}.vue-slider-dot-tooltip-top{top:-10px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-dot-tooltip-bottom{bottom:-10px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-dot-tooltip-left{left:-10px;top:50%;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-dot-tooltip-right{right:-10px;top:50%;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}',
                '',
              ]);
            },
            d5ac: function (t, e, r) {
              (t.exports = r('2350')(!1)).push([
                t.i,
                '.vue-slider-marks{position:relative;width:100%;height:100%}.vue-slider-mark{position:absolute;z-index:1}.vue-slider-ltr .vue-slider-mark,.vue-slider-rtl .vue-slider-mark{width:0;height:100%;top:50%}.vue-slider-ltr .vue-slider-mark-step,.vue-slider-rtl .vue-slider-mark-step{top:0}.vue-slider-ltr .vue-slider-mark-label,.vue-slider-rtl .vue-slider-mark-label{top:100%;margin-top:10px}.vue-slider-ltr .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ltr .vue-slider-mark-step{left:0}.vue-slider-ltr .vue-slider-mark-label{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.vue-slider-rtl .vue-slider-mark{-webkit-transform:translate(50%,-50%);transform:translate(50%,-50%)}.vue-slider-rtl .vue-slider-mark-step{right:0}.vue-slider-rtl .vue-slider-mark-label{right:50%;-webkit-transform:translateX(50%);transform:translateX(50%)}.vue-slider-btt .vue-slider-mark,.vue-slider-ttb .vue-slider-mark{width:100%;height:0;left:50%}.vue-slider-btt .vue-slider-mark-step,.vue-slider-ttb .vue-slider-mark-step{left:0}.vue-slider-btt .vue-slider-mark-label,.vue-slider-ttb .vue-slider-mark-label{left:100%;margin-left:10px}.vue-slider-btt .vue-slider-mark{-webkit-transform:translate(-50%,50%);transform:translate(-50%,50%)}.vue-slider-btt .vue-slider-mark-step{top:0}.vue-slider-btt .vue-slider-mark-label{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-ttb .vue-slider-mark{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.vue-slider-ttb .vue-slider-mark-step{bottom:0}.vue-slider-ttb .vue-slider-mark-label{bottom:50%;-webkit-transform:translateY(50%);transform:translateY(50%)}.vue-slider-mark-label,.vue-slider-mark-step{position:absolute}',
                '',
              ]);
            },
            df80: function (t, e, r) {
              (t.exports = r('2350')(!1)).push([
                t.i,
                '.vue-slider{position:relative;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block;-ms-touch-action:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.vue-slider-disabled{pointer-events:none}.vue-slider-rail{position:relative;width:100%;height:100%;-webkit-transition-property:width,height,left,right,top,bottom;transition-property:width,height,left,right,top,bottom}.vue-slider-process{position:absolute;z-index:1}.vue-slider-sr-only{clip:rect(1px,1px,1px,1px);height:1px;width:1px;overflow:hidden;position:absolute!important}',
                '',
              ]);
            },
            fb15: function (t, e, r) {
              'use strict';
              var n;
              function o(t, e, r, n) {
                var o,
                  i = arguments.length,
                  s = i < 3 ? e : null === n ? (n = Object.getOwnPropertyDescriptor(e, r)) : n;
                if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
                  s = Reflect.decorate(t, e, r, n);
                else
                  for (var a = t.length - 1; a >= 0; a--)
                    (o = t[a]) && (s = (i < 3 ? o(s) : i > 3 ? o(e, r, s) : o(e, r)) || s);
                return i > 3 && s && Object.defineProperty(e, r, s), s;
              }
              r.r(e),
                'undefined' != typeof window &&
                  (n = window.document.currentScript) &&
                  (n = n.src.match(/(.+\/)[^\/]+\.js(\?.*)?$/)) &&
                  (r.p = n[1]);
              var i = r('8bbf'),
                s = r.n(i),
                a = r('65d9'),
                u = r.n(a),
                l = 'undefined' != typeof Reflect && void 0 !== Reflect.getMetadata;
              function c(t, e, r) {
                l &&
                  (Array.isArray(t) ||
                    'function' == typeof t ||
                    void 0 !== t.type ||
                    (t.type = Reflect.getMetadata('design:type', e, r)));
              }
              function f(t) {
                return (
                  void 0 === t && (t = {}),
                  function (e, r) {
                    c(t, e, r),
                      Object(a.createDecorator)(function (e, r) {
                        (e.props || (e.props = {}))[r] = t;
                      })(e, r);
                  }
                );
              }
              function h(t) {
                return (h =
                  'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                    ? function (t) {
                        return typeof t;
                      }
                    : function (t) {
                        return t &&
                          'function' == typeof Symbol &&
                          t.constructor === Symbol &&
                          t !== Symbol.prototype
                          ? 'symbol'
                          : typeof t;
                      })(t);
              }
              function v(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var n = e[r];
                  (n.enumerable = n.enumerable || !1),
                    (n.configurable = !0),
                    'value' in n && (n.writable = !0),
                    Object.defineProperty(t, n.key, n);
                }
              }
              function b(t, e) {
                return !e || ('object' !== h(e) && 'function' != typeof e)
                  ? (function (t) {
                      if (void 0 === t)
                        throw new ReferenceError(
                          "this hasn't been initialised - super() hasn't been called"
                        );
                      return t;
                    })(t)
                  : e;
              }
              function k(t) {
                return (k = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (t) {
                      return t.__proto__ || Object.getPrototypeOf(t);
                    })(t);
              }
              function w(t, e) {
                return (w =
                  Object.setPrototypeOf ||
                  function (t, e) {
                    return (t.__proto__ = e), t;
                  })(t, e);
              }
              r('4ed8');
              var O = (function (t) {
                function e() {
                  return (
                    (function (t, e) {
                      if (!(t instanceof e))
                        throw new TypeError('Cannot call a class as a function');
                    })(this, e),
                    b(this, k(e).apply(this, arguments))
                  );
                }
                return (
                  (function (t, e) {
                    if ('function' != typeof e && null !== e)
                      throw new TypeError('Super expression must either be null or a function');
                    (t.prototype = Object.create(e && e.prototype, {
                      constructor: { value: t, writable: !0, configurable: !0 },
                    })),
                      e && w(t, e);
                  })(e, t),
                  (function (t, e, r) {
                    e && v(t.prototype, e), r && v(t, r);
                  })(e, [
                    {
                      key: 'dragStart',
                      value: function (t) {
                        if (this.disabled) return !1;
                        this.$emit('drag-start');
                      },
                    },
                    {
                      key: 'render',
                      value: function () {
                        var t = arguments[0];
                        return t(
                          'div',
                          {
                            ref: 'dot',
                            class: this.dotClasses,
                            on: { mousedown: this.dragStart, touchstart: this.dragStart },
                          },
                          [
                            this.$slots.dot ||
                              t('div', { class: this.handleClasses, style: this.dotStyle }),
                            'none' !== this.tooltip
                              ? t('div', { class: this.tooltipClasses }, [
                                  this.$slots.tooltip ||
                                    t(
                                      'div',
                                      { class: this.tooltipInnerClasses, style: this.tooltipStyle },
                                      [
                                        t('span', { class: 'vue-slider-dot-tooltip-text' }, [
                                          this.tooltipValue,
                                        ]),
                                      ]
                                    ),
                                ])
                              : null,
                          ]
                        );
                      },
                    },
                    {
                      key: 'dotClasses',
                      get: function () {
                        return [
                          'vue-slider-dot',
                          {
                            'vue-slider-dot-disabled': this.disabled,
                            'vue-slider-dot-focus': this.focus,
                          },
                        ];
                      },
                    },
                    {
                      key: 'handleClasses',
                      get: function () {
                        return [
                          'vue-slider-dot-handle',
                          {
                            'vue-slider-dot-handle-disabled': this.disabled,
                            'vue-slider-dot-handle-focus': this.focus,
                          },
                        ];
                      },
                    },
                    {
                      key: 'tooltipClasses',
                      get: function () {
                        return [
                          'vue-slider-dot-tooltip',
                          ['vue-slider-dot-tooltip-'.concat(this.tooltipPlacement)],
                          { 'vue-slider-dot-tooltip-show': this.showTooltip },
                        ];
                      },
                    },
                    {
                      key: 'tooltipInnerClasses',
                      get: function () {
                        return [
                          'vue-slider-dot-tooltip-inner',
                          ['vue-slider-dot-tooltip-inner-'.concat(this.tooltipPlacement)],
                          {
                            'vue-slider-dot-tooltip-inner-disabled': this.disabled,
                            'vue-slider-dot-tooltip-inner-focus': this.focus,
                          },
                        ];
                      },
                    },
                    {
                      key: 'showTooltip',
                      get: function () {
                        switch (this.tooltip) {
                          case 'always':
                            return !0;
                          case 'none':
                            return !1;
                          case 'focus':
                            return !!this.focus;
                          default:
                            return !1;
                        }
                      },
                    },
                    {
                      key: 'tooltipValue',
                      get: function () {
                        return this.tooltipFormatter
                          ? 'string' == typeof this.tooltipFormatter
                            ? this.tooltipFormatter.replace(/\{value\}/, String(this.value))
                            : this.tooltipFormatter(this.value)
                          : this.value;
                      },
                    },
                  ]),
                  e
                );
              })(s.a);
              o([f({ default: 0 })], O.prototype, 'value', void 0),
                o([f()], O.prototype, 'tooltip', void 0),
                o([f()], O.prototype, 'dotStyle', void 0),
                o([f()], O.prototype, 'tooltipStyle', void 0),
                o(
                  [
                    f({
                      type: String,
                      validator: function (t) {
                        return ['top', 'right', 'bottom', 'left'].indexOf(t) > -1;
                      },
                      required: !0,
                    }),
                  ],
                  O.prototype,
                  'tooltipPlacement',
                  void 0
                ),
                o([f({ type: [String, Function] })], O.prototype, 'tooltipFormatter', void 0),
                o([f({ type: Boolean, default: !1 })], O.prototype, 'focus', void 0),
                o([f({ default: !1 })], O.prototype, 'disabled', void 0);
              var P = (O = o([u.a], O));
              function S(t) {
                return (S =
                  'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                    ? function (t) {
                        return typeof t;
                      }
                    : function (t) {
                        return t &&
                          'function' == typeof Symbol &&
                          t.constructor === Symbol &&
                          t !== Symbol.prototype
                          ? 'symbol'
                          : typeof t;
                      })(t);
              }
              function R(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var n = e[r];
                  (n.enumerable = n.enumerable || !1),
                    (n.configurable = !0),
                    'value' in n && (n.writable = !0),
                    Object.defineProperty(t, n.key, n);
                }
              }
              function A(t, e) {
                return !e || ('object' !== S(e) && 'function' != typeof e)
                  ? (function (t) {
                      if (void 0 === t)
                        throw new ReferenceError(
                          "this hasn't been initialised - super() hasn't been called"
                        );
                      return t;
                    })(t)
                  : e;
              }
              function V(t) {
                return (V = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (t) {
                      return t.__proto__ || Object.getPrototypeOf(t);
                    })(t);
              }
              function M(t, e) {
                return (M =
                  Object.setPrototypeOf ||
                  function (t, e) {
                    return (t.__proto__ = e), t;
                  })(t, e);
              }
              r('556c');
              var C = (function (t) {
                function e() {
                  return (
                    (function (t, e) {
                      if (!(t instanceof e))
                        throw new TypeError('Cannot call a class as a function');
                    })(this, e),
                    A(this, V(e).apply(this, arguments))
                  );
                }
                return (
                  (function (t, e) {
                    if ('function' != typeof e && null !== e)
                      throw new TypeError('Super expression must either be null or a function');
                    (t.prototype = Object.create(e && e.prototype, {
                      constructor: { value: t, writable: !0, configurable: !0 },
                    })),
                      e && M(t, e);
                  })(e, t),
                  (function (t, e, r) {
                    e && R(t.prototype, e), r && R(t, r);
                  })(e, [
                    {
                      key: 'labelClickHandle',
                      value: function (t) {
                        t.stopPropagation(), this.$emit('pressLabel', this.mark.pos);
                      },
                    },
                    {
                      key: 'render',
                      value: function () {
                        var t = arguments[0],
                          e = this.mark;
                        return t('div', { class: this.marksClasses }, [
                          this.$slots.step ||
                            t('div', {
                              class: this.stepClasses,
                              style: [
                                this.stepStyle,
                                e.style,
                                e.active ? this.stepActiveStyle : null,
                                e.active ? e.activeStyle : null,
                              ],
                            }),
                          this.hideLabel
                            ? null
                            : this.$slots.label ||
                              t(
                                'div',
                                {
                                  class: this.labelClasses,
                                  style: [
                                    this.labelStyle,
                                    e.labelStyle,
                                    e.active ? this.labelActiveStyle : null,
                                    e.active ? e.labelActiveStyle : null,
                                  ],
                                  on: { click: this.labelClickHandle },
                                },
                                [e.label]
                              ),
                        ]);
                      },
                    },
                    {
                      key: 'marksClasses',
                      get: function () {
                        return ['vue-slider-mark', { 'vue-slider-mark-active': this.mark.active }];
                      },
                    },
                    {
                      key: 'stepClasses',
                      get: function () {
                        return [
                          'vue-slider-mark-step',
                          { 'vue-slider-mark-step-active': this.mark.active },
                        ];
                      },
                    },
                    {
                      key: 'labelClasses',
                      get: function () {
                        return [
                          'vue-slider-mark-label',
                          { 'vue-slider-mark-label-active': this.mark.active },
                        ];
                      },
                    },
                  ]),
                  e
                );
              })(s.a);
              o([f({ required: !0 })], C.prototype, 'mark', void 0),
                o([f(Boolean)], C.prototype, 'hideLabel', void 0),
                o([f()], C.prototype, 'stepStyle', void 0),
                o([f()], C.prototype, 'stepActiveStyle', void 0),
                o([f()], C.prototype, 'labelStyle', void 0),
                o([f()], C.prototype, 'labelActiveStyle', void 0);
              var N,
                T = (C = o([u.a], C)),
                B = function (t) {
                  return 'number' == typeof t ? ''.concat(t, 'px') : t;
                },
                L = function (t, e, r) {
                  var n = 'targetTouches' in t ? t.targetTouches[0] : t,
                    o = (function (t) {
                      var e = document.documentElement,
                        r = document.body,
                        n = t.getBoundingClientRect();
                      return {
                        y:
                          n.top +
                          (window.pageYOffset || e.scrollTop) -
                          (e.clientTop || r.clientTop || 0),
                        x:
                          n.left +
                          (window.pageXOffset || e.scrollLeft) -
                          (e.clientLeft || r.clientLeft || 0),
                      };
                    })(e),
                    i = { x: n.pageX - o.x, y: n.pageY - o.y };
                  return { x: r ? e.offsetWidth - i.x : i.x, y: r ? e.offsetHeight - i.y : i.y };
                };
              function U(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var n = e[r];
                  (n.enumerable = n.enumerable || !1),
                    (n.configurable = !0),
                    'value' in n && (n.writable = !0),
                    Object.defineProperty(t, n.key, n);
                }
              }
              !(function (t) {
                (t[(t.PAGE_UP = 33)] = 'PAGE_UP'),
                  (t[(t.PAGE_DOWN = 34)] = 'PAGE_DOWN'),
                  (t[(t.END = 35)] = 'END'),
                  (t[(t.HOME = 36)] = 'HOME'),
                  (t[(t.LEFT = 37)] = 'LEFT'),
                  (t[(t.UP = 38)] = 'UP'),
                  (t[(t.RIGHT = 39)] = 'RIGHT'),
                  (t[(t.DOWN = 40)] = 'DOWN');
              })(N || (N = {}));
              var $,
                W,
                G = (function () {
                  function t(e) {
                    (function (t, e) {
                      if (!(t instanceof e))
                        throw new TypeError('Cannot call a class as a function');
                    })(this, t),
                      (this.num = e);
                  }
                  return (
                    (function (t, e, r) {
                      e && U(t.prototype, e), r && U(t, r);
                    })(t, [
                      {
                        key: 'decimal',
                        value: function (t, e) {
                          var r = this.num,
                            n = this.getDecimalLen(r),
                            o = this.getDecimalLen(t),
                            i = 0;
                          switch (e) {
                            case '+':
                              (i = this.getExponent(n, o)),
                                (this.num = (this.safeRoundUp(r, i) + this.safeRoundUp(t, i)) / i);
                              break;
                            case '-':
                              (i = this.getExponent(n, o)),
                                (this.num = (this.safeRoundUp(r, i) - this.safeRoundUp(t, i)) / i);
                              break;
                            case '*':
                              this.num =
                                this.safeRoundUp(
                                  this.safeRoundUp(r, this.getExponent(n)),
                                  this.safeRoundUp(t, this.getExponent(o))
                                ) / this.getExponent(n + o);
                              break;
                            case '/':
                              (i = this.getExponent(n, o)),
                                (this.num = this.safeRoundUp(r, i) / this.safeRoundUp(t, i));
                              break;
                            case '%':
                              (i = this.getExponent(n, o)),
                                (this.num = (this.safeRoundUp(r, i) % this.safeRoundUp(t, i)) / i);
                          }
                          return this;
                        },
                      },
                      {
                        key: 'plus',
                        value: function (t) {
                          return this.decimal(t, '+');
                        },
                      },
                      {
                        key: 'minus',
                        value: function (t) {
                          return this.decimal(t, '-');
                        },
                      },
                      {
                        key: 'multiply',
                        value: function (t) {
                          return this.decimal(t, '*');
                        },
                      },
                      {
                        key: 'divide',
                        value: function (t) {
                          return this.decimal(t, '/');
                        },
                      },
                      {
                        key: 'remainder',
                        value: function (t) {
                          return this.decimal(t, '%');
                        },
                      },
                      {
                        key: 'toNumber',
                        value: function () {
                          return this.num;
                        },
                      },
                      {
                        key: 'getDecimalLen',
                        value: function (t) {
                          return (''.concat(t).split('.')[1] || '').length;
                        },
                      },
                      {
                        key: 'getExponent',
                        value: function (t, e) {
                          return Math.pow(10, void 0 !== e ? Math.max(t, e) : t);
                        },
                      },
                      {
                        key: 'safeRoundUp',
                        value: function (t, e) {
                          return Math.round(t * e);
                        },
                      },
                    ]),
                    t
                  );
                })();
              function K(t, e) {
                return (
                  (function (t) {
                    if (Array.isArray(t)) return t;
                  })(t) ||
                  (function (t, e) {
                    var r = [],
                      n = !0,
                      o = !1,
                      i = void 0;
                    try {
                      for (
                        var s, a = t[Symbol.iterator]();
                        !(n = (s = a.next()).done) && (r.push(s.value), !e || r.length !== e);
                        n = !0
                      );
                    } catch (u) {
                      (o = !0), (i = u);
                    } finally {
                      try {
                        n || null == a.return || a.return();
                      } finally {
                        if (o) throw i;
                      }
                    }
                    return r;
                  })(t, e) ||
                  (function () {
                    throw new TypeError('Invalid attempt to destructure non-iterable instance');
                  })()
                );
              }
              function Q(t) {
                return (
                  (function (t) {
                    if (Array.isArray(t)) {
                      for (var e = 0, r = new Array(t.length); e < t.length; e++) r[e] = t[e];
                      return r;
                    }
                  })(t) ||
                  (function (t) {
                    if (
                      Symbol.iterator in Object(t) ||
                      '[object Arguments]' === Object.prototype.toString.call(t)
                    )
                      return Array.from(t);
                  })(t) ||
                  (function () {
                    throw new TypeError('Invalid attempt to spread non-iterable instance');
                  })()
                );
              }
              function nt(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var n = e[r];
                  (n.enumerable = n.enumerable || !1),
                    (n.configurable = !0),
                    'value' in n && (n.writable = !0),
                    Object.defineProperty(t, n.key, n);
                }
              }
              function it(t, e, r) {
                return (
                  e in t
                    ? Object.defineProperty(t, e, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (t[e] = r),
                  t
                );
              }
              !(function (t) {
                (t[(t.VALUE = 1)] = 'VALUE'),
                  (t[(t.INTERVAL = 2)] = 'INTERVAL'),
                  (t[(t.MIN = 3)] = 'MIN'),
                  (t[(t.MAX = 4)] = 'MAX'),
                  (t[(t.ORDER = 5)] = 'ORDER');
              })(W || (W = {}));
              var st =
                  (it(($ = {}), W.VALUE, 'The type of the "value" is illegal'),
                  it(
                    $,
                    W.INTERVAL,
                    'The prop "interval" is invalid, "(max - min)" cannot be divisible by "interval"'
                  ),
                  it($, W.MIN, 'The "value" cannot be less than the minimum.'),
                  it($, W.MAX, 'The "value" cannot be greater than the maximum.'),
                  it(
                    $,
                    W.ORDER,
                    'When "order" is false, the parameters "minRange", "maxRange", "fixed", "enabled" are invalid.'
                  ),
                  $),
                at = (function () {
                  function t(e) {
                    (function (t, e) {
                      if (!(t instanceof e))
                        throw new TypeError('Cannot call a class as a function');
                    })(this, t),
                      (this.dotsPos = []),
                      (this.dotsValue = []),
                      (this.data = e.data),
                      (this.max = e.max),
                      (this.min = e.min),
                      (this.interval = e.interval),
                      (this.order = e.order),
                      (this.marks = e.marks),
                      (this.included = e.included),
                      (this.process = e.process),
                      (this.adsorb = e.adsorb),
                      (this.dotOptions = e.dotOptions),
                      (this.onError = e.onError),
                      this.order
                        ? ((this.minRange = e.minRange || 0),
                          (this.maxRange = e.maxRange || 0),
                          (this.enableCross = e.enableCross),
                          (this.fixed = e.fixed))
                        : ((e.minRange || e.maxRange || !e.enableCross || e.fixed) &&
                            this.emitError(W.ORDER),
                          (this.minRange = 0),
                          (this.maxRange = 0),
                          (this.enableCross = !0),
                          (this.fixed = !1)),
                      this.setValue(e.value);
                  }
                  return (
                    (function (t, e, r) {
                      e && nt(t.prototype, e), r && nt(t, r);
                    })(t, [
                      {
                        key: 'setValue',
                        value: function (t) {
                          this.setDotsValue(Array.isArray(t) ? Q(t) : [t], !0);
                        },
                      },
                      {
                        key: 'setDotsValue',
                        value: function (t, e) {
                          (this.dotsValue = t), e && this.syncDotsPos();
                        },
                      },
                      {
                        key: 'setDotsPos',
                        value: function (t) {
                          var e = this,
                            r = this.order
                              ? Q(t).sort(function (t, e) {
                                  return t - e;
                                })
                              : t;
                          (this.dotsPos = r),
                            this.setDotsValue(
                              r.map(function (t) {
                                return e.getValueByPos(t);
                              }),
                              this.adsorb
                            );
                        },
                      },
                      {
                        key: 'getValueByPos',
                        value: function (t) {
                          var e = this.parsePos(t);
                          if (this.included) {
                            var r = 100;
                            this.markList.forEach(function (n) {
                              var o = Math.abs(n.pos - t);
                              o < r && ((r = o), (e = n.value));
                            });
                          }
                          return e;
                        },
                      },
                      {
                        key: 'syncDotsPos',
                        value: function () {
                          var t = this;
                          this.dotsPos = this.dotsValue.map(function (e) {
                            return t.parseValue(e);
                          });
                        },
                      },
                      {
                        key: 'getRecentDot',
                        value: function (t) {
                          var e = this.dotsPos.map(function (e) {
                            return Math.abs(e - t);
                          });
                          return e.indexOf(Math.min.apply(Math, Q(e)));
                        },
                      },
                      {
                        key: 'getIndexByValue',
                        value: function (t) {
                          return this.data
                            ? this.data.indexOf(t)
                            : new G(+t).minus(this.min).divide(this.interval).toNumber();
                        },
                      },
                      {
                        key: 'getValueByIndex',
                        value: function (t) {
                          return (
                            t < 0 ? (t = 0) : t > this.total && (t = this.total),
                            this.data
                              ? this.data[t]
                              : new G(t).multiply(this.interval).plus(this.min).toNumber()
                          );
                        },
                      },
                      {
                        key: 'setDotPos',
                        value: function (t, e) {
                          var r = (t = this.getValidPos(t, e).pos) - this.dotsPos[e];
                          if (r) {
                            var n = new Array(this.dotsPos.length);
                            this.fixed
                              ? (n = this.getFixedChangePosArr(r, e))
                              : this.minRange || this.maxRange
                              ? (n = this.getLimitRangeChangePosArr(t, r, e))
                              : (n[e] = r),
                              this.setDotsPos(
                                this.dotsPos.map(function (t, e) {
                                  return t + (n[e] || 0);
                                })
                              );
                          }
                        },
                      },
                      {
                        key: 'getFixedChangePosArr',
                        value: function (t, e) {
                          var r = this;
                          return (
                            this.dotsPos.forEach(function (n, o) {
                              if (o !== e) {
                                var i = r.getValidPos(n + t, o),
                                  s = i.pos,
                                  a = i.inRange;
                                a ||
                                  (t = Math.min(Math.abs(s - n), Math.abs(t)) * (t < 0 ? -1 : 1));
                              }
                            }),
                            this.dotsPos.map(function (e) {
                              return t;
                            })
                          );
                        },
                      },
                      {
                        key: 'getLimitRangeChangePosArr',
                        value: function (t, e, r) {
                          var n = this,
                            o = [{ index: r, changePos: e }],
                            i = e;
                          return (
                            [this.minRange, this.maxRange].forEach(function (s, a) {
                              if (!s) return !1;
                              for (
                                var u = 0 === a,
                                  l = e > 0,
                                  c = 0,
                                  d = function (t, e) {
                                    var r = Math.abs(t - e);
                                    return u ? r < n.minRangeDir : r > n.maxRangeDir;
                                  },
                                  f = r + (c = u ? (l ? 1 : -1) : l ? -1 : 1),
                                  p = n.dotsPos[f],
                                  h = t;
                                n.isPos(p) && d(p, h);

                              ) {
                                var y = n.getValidPos(p + i, f),
                                  v = y.pos;
                                o.push({ index: f, changePos: v - p }),
                                  (f += c),
                                  (h = v),
                                  (p = n.dotsPos[f]);
                              }
                            }),
                            this.dotsPos.map(function (t, e) {
                              var r = o.filter(function (t) {
                                return t.index === e;
                              });
                              return r.length ? r[0].changePos : 0;
                            })
                          );
                        },
                      },
                      {
                        key: 'isPos',
                        value: function (t) {
                          return 'number' == typeof t;
                        },
                      },
                      {
                        key: 'getValidPos',
                        value: function (t, e) {
                          var r = this.valuePosRange[e],
                            n = !0;
                          return (
                            t < r[0] ? ((t = r[0]), (n = !1)) : t > r[1] && ((t = r[1]), (n = !1)),
                            { pos: t, inRange: n }
                          );
                        },
                      },
                      {
                        key: 'parseValue',
                        value: function (t) {
                          if (this.data) t = this.data.indexOf(t);
                          else if ('number' == typeof t || 'string' == typeof t) {
                            if ((t = +t) < this.min) return this.emitError(W.MIN), 0;
                            if (t > this.max) return this.emitError(W.MAX), 0;
                            if ('number' != typeof t || t != t) return this.emitError(W.VALUE), 0;
                            t = new G(t).minus(this.min).divide(this.interval).toNumber();
                          }
                          var e = new G(t).multiply(this.gap).toNumber();
                          return e < 0 ? 0 : e > 100 ? 100 : e;
                        },
                      },
                      {
                        key: 'parsePos',
                        value: function (t) {
                          var e = Math.round(t / this.gap);
                          return this.getValueByIndex(e);
                        },
                      },
                      {
                        key: 'isActiveByPos',
                        value: function (t) {
                          return this.processArray.some(function (e) {
                            var r = K(e, 2),
                              n = r[0],
                              o = r[1];
                            return t >= n && t <= o;
                          });
                        },
                      },
                      {
                        key: 'getValues',
                        value: function () {
                          if (this.data) return this.data;
                          for (var t = [this.max], e = 0; e < this.total; e++)
                            t.unshift(new G(e).multiply(this.interval).plus(this.min).toNumber());
                          return t;
                        },
                      },
                      {
                        key: 'emitError',
                        value: function (t) {
                          this.onError && this.onError(t, st[t]);
                        },
                      },
                      {
                        key: 'getDotRange',
                        value: function (t, e, r) {
                          if (!this.dotOptions) return r;
                          var n = Array.isArray(this.dotOptions)
                            ? this.dotOptions[t]
                            : this.dotOptions;
                          return n && void 0 !== n[e] ? this.parseValue(n[e]) : r;
                        },
                      },
                      {
                        key: 'markList',
                        get: function () {
                          var t = this;
                          if (!this.marks) return [];
                          var e = function (e, r) {
                            var n = t.parseValue(e);
                            return (function (t) {
                              for (var e = 1; e < arguments.length; e++) {
                                var r = null != arguments[e] ? arguments[e] : {},
                                  n = Object.keys(r);
                                'function' == typeof Object.getOwnPropertySymbols &&
                                  (n = n.concat(
                                    Object.getOwnPropertySymbols(r).filter(function (t) {
                                      return Object.getOwnPropertyDescriptor(r, t).enumerable;
                                    })
                                  )),
                                  n.forEach(function (e) {
                                    it(t, e, r[e]);
                                  });
                              }
                              return t;
                            })({ pos: n, value: e, label: e, active: t.isActiveByPos(n) }, r);
                          };
                          return !0 === this.marks
                            ? this.getValues().map(function (t) {
                                return e(t);
                              })
                            : '[object Object]' === Object.prototype.toString.call(this.marks)
                            ? Object.keys(this.marks)
                                .sort(function (t, e) {
                                  return +t - +e;
                                })
                                .map(function (r) {
                                  var n = t.marks[r];
                                  return e(r, 'string' != typeof n ? n : { label: n });
                                })
                            : Array.isArray(this.marks)
                            ? this.marks.map(function (t) {
                                return e(t);
                              })
                            : 'function' == typeof this.marks
                            ? this.getValues()
                                .map(function (e) {
                                  return { value: e, result: t.marks(e) };
                                })
                                .filter(function (t) {
                                  var e = t.result;
                                  return !!e;
                                })
                                .map(function (t) {
                                  var r = t.value,
                                    n = t.result;
                                  return e(r, n);
                                })
                            : [];
                        },
                      },
                      {
                        key: 'processArray',
                        get: function () {
                          if (this.process) {
                            if ('function' == typeof this.process)
                              return this.process(this.dotsPos);
                            if (1 === this.dotsPos.length) return [[0, this.dotsPos[0]]];
                            if (this.dotsPos.length > 1)
                              return [
                                [
                                  Math.min.apply(Math, Q(this.dotsPos)),
                                  Math.max.apply(Math, Q(this.dotsPos)),
                                ],
                              ];
                          }
                          return [];
                        },
                      },
                      {
                        key: 'total',
                        get: function () {
                          var t = 0;
                          return (t = this.data
                            ? this.data.length - 1
                            : new G(this.max).minus(this.min).divide(this.interval).toNumber()) -
                            Math.floor(t) !=
                            0
                            ? (this.emitError(W.INTERVAL), 0)
                            : t;
                        },
                      },
                      {
                        key: 'gap',
                        get: function () {
                          return 100 / this.total;
                        },
                      },
                      {
                        key: 'minRangeDir',
                        get: function () {
                          return this.minRange ? this.minRange * this.gap : 0;
                        },
                      },
                      {
                        key: 'maxRangeDir',
                        get: function () {
                          return this.maxRange ? this.maxRange * this.gap : 100;
                        },
                      },
                      {
                        key: 'valuePosRange',
                        get: function () {
                          var t = this,
                            e = this.dotsPos,
                            r = [];
                          return (
                            e.forEach(function (n, o) {
                              r.push([
                                Math.max(
                                  t.minRange ? t.minRangeDir * o : 0,
                                  t.enableCross ? 0 : e[o - 1] || 0,
                                  t.getDotRange(o, 'min', 0)
                                ),
                                Math.min(
                                  t.minRange ? 100 - t.minRangeDir * (e.length - 1 - o) : 100,
                                  t.enableCross ? 100 : e[o + 1] || 100,
                                  t.getDotRange(o, 'max', 100)
                                ),
                              ]);
                            }),
                            r
                          );
                        },
                      },
                      {
                        key: 'dotsIndex',
                        get: function () {
                          var t = this;
                          return this.dotsValue.map(function (e) {
                            return t.getIndexByValue(e);
                          });
                        },
                      },
                    ]),
                    t
                  );
                })();
              function lt(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var n = e[r];
                  (n.enumerable = n.enumerable || !1),
                    (n.configurable = !0),
                    'value' in n && (n.writable = !0),
                    Object.defineProperty(t, n.key, n);
                }
              }
              var dt = (function () {
                function t(e) {
                  (function (t, e) {
                    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
                  })(this, t),
                    (this.states = 0),
                    (this.map = e);
                }
                return (
                  (function (t, e, r) {
                    e && lt(t.prototype, e), r && lt(t, r);
                  })(t, [
                    {
                      key: 'add',
                      value: function (t) {
                        this.states |= t;
                      },
                    },
                    {
                      key: 'delete',
                      value: function (t) {
                        this.states &= ~t;
                      },
                    },
                    {
                      key: 'toggle',
                      value: function (t) {
                        this.has(t) ? this.delete(t) : this.add(t);
                      },
                    },
                    {
                      key: 'has',
                      value: function (t) {
                        return !!(this.states & t);
                      },
                    },
                  ]),
                  t
                );
              })();
              function ft(t) {
                return (ft =
                  'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                    ? function (t) {
                        return typeof t;
                      }
                    : function (t) {
                        return t &&
                          'function' == typeof Symbol &&
                          t.constructor === Symbol &&
                          t !== Symbol.prototype
                          ? 'symbol'
                          : typeof t;
                      })(t);
              }
              function pt(t) {
                for (var e = 1; e < arguments.length; e++) {
                  var r = null != arguments[e] ? arguments[e] : {},
                    n = Object.keys(r);
                  'function' == typeof Object.getOwnPropertySymbols &&
                    (n = n.concat(
                      Object.getOwnPropertySymbols(r).filter(function (t) {
                        return Object.getOwnPropertyDescriptor(r, t).enumerable;
                      })
                    )),
                    n.forEach(function (e) {
                      bt(t, e, r[e]);
                    });
                }
                return t;
              }
              function ht(t, e) {
                return (
                  (function (t) {
                    if (Array.isArray(t)) return t;
                  })(t) ||
                  (function (t, e) {
                    var r = [],
                      n = !0,
                      o = !1,
                      i = void 0;
                    try {
                      for (
                        var s, a = t[Symbol.iterator]();
                        !(n = (s = a.next()).done) && (r.push(s.value), !e || r.length !== e);
                        n = !0
                      );
                    } catch (u) {
                      (o = !0), (i = u);
                    } finally {
                      try {
                        n || null == a.return || a.return();
                      } finally {
                        if (o) throw i;
                      }
                    }
                    return r;
                  })(t, e) ||
                  (function () {
                    throw new TypeError('Invalid attempt to destructure non-iterable instance');
                  })()
                );
              }
              function bt(t, e, r) {
                return (
                  e in t
                    ? Object.defineProperty(t, e, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (t[e] = r),
                  t
                );
              }
              function gt(t) {
                return (
                  (function (t) {
                    if (Array.isArray(t)) {
                      for (var e = 0, r = new Array(t.length); e < t.length; e++) r[e] = t[e];
                      return r;
                    }
                  })(t) ||
                  (function (t) {
                    if (
                      Symbol.iterator in Object(t) ||
                      '[object Arguments]' === Object.prototype.toString.call(t)
                    )
                      return Array.from(t);
                  })(t) ||
                  (function () {
                    throw new TypeError('Invalid attempt to spread non-iterable instance');
                  })()
                );
              }
              function Pt(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var n = e[r];
                  (n.enumerable = n.enumerable || !1),
                    (n.configurable = !0),
                    'value' in n && (n.writable = !0),
                    Object.defineProperty(t, n.key, n);
                }
              }
              function Et(t, e) {
                return !e || ('object' !== ft(e) && 'function' != typeof e)
                  ? (function (t) {
                      if (void 0 === t)
                        throw new ReferenceError(
                          "this hasn't been initialised - super() hasn't been called"
                        );
                      return t;
                    })(t)
                  : e;
              }
              function Dt(t) {
                return (Dt = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (t) {
                      return t.__proto__ || Object.getPrototypeOf(t);
                    })(t);
              }
              function jt(t, e) {
                return (jt =
                  Object.setPrototypeOf ||
                  function (t, e) {
                    return (t.__proto__ = e), t;
                  })(t, e);
              }
              r('4abb');
              var Vt = { None: 0, Drag: 1, Focus: 2 },
                Mt = (function (t) {
                  function e() {
                    var t;
                    return (
                      (function (t, e) {
                        if (!(t instanceof e))
                          throw new TypeError('Cannot call a class as a function');
                      })(this, e),
                      ((t = Et(this, Dt(e).apply(this, arguments))).states = new dt(Vt)),
                      (t.scale = 1),
                      (t.focusDotIndex = 0),
                      t
                    );
                  }
                  return (
                    (function (t, e) {
                      if ('function' != typeof e && null !== e)
                        throw new TypeError('Super expression must either be null or a function');
                      (t.prototype = Object.create(e && e.prototype, {
                        constructor: { value: t, writable: !0, configurable: !0 },
                      })),
                        e && jt(t, e);
                    })(e, t),
                    (function (t, e, r) {
                      e && Pt(t.prototype, e), r && Pt(t, r);
                    })(e, [
                      {
                        key: 'onValueChanged',
                        value: function () {
                          !this.states.has(Vt.Drag) &&
                            this.isNotSync &&
                            this.control.setValue(this.value);
                        },
                      },
                      {
                        key: 'created',
                        value: function () {
                          this.initControl();
                        },
                      },
                      {
                        key: 'mounted',
                        value: function () {
                          this.bindEvent();
                        },
                      },
                      {
                        key: 'beforeDestroy',
                        value: function () {
                          this.unbindEvent();
                        },
                      },
                      {
                        key: 'bindEvent',
                        value: function () {
                          document.addEventListener('touchmove', this.dragMove, { passive: !1 }),
                            document.addEventListener('touchend', this.dragEnd, { passive: !1 }),
                            document.addEventListener('mousedown', this.blurHandle),
                            document.addEventListener('mousemove', this.dragMove),
                            document.addEventListener('mouseup', this.dragEnd),
                            document.addEventListener('mouseleave', this.dragEnd),
                            document.addEventListener('keydown', this.keydownHandle);
                        },
                      },
                      {
                        key: 'unbindEvent',
                        value: function () {
                          document.removeEventListener('touchmove', this.dragMove),
                            document.removeEventListener('touchend', this.dragEnd),
                            document.removeEventListener('mousedown', this.blurHandle),
                            document.removeEventListener('mousemove', this.dragMove),
                            document.removeEventListener('mouseup', this.dragEnd),
                            document.removeEventListener('mouseleave', this.dragEnd),
                            document.removeEventListener('keydown', this.keydownHandle);
                        },
                      },
                      {
                        key: 'setScale',
                        value: function () {
                          this.scale = new G(
                            Math.floor(
                              this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight
                            )
                          )
                            .divide(100)
                            .toNumber();
                        },
                      },
                      {
                        key: 'initControl',
                        value: function () {
                          var t = this;
                          (this.control = new at({
                            value: this.value,
                            data: this.data,
                            enableCross: this.enableCross,
                            fixed: this.fixed,
                            max: this.max,
                            min: this.min,
                            interval: this.interval,
                            minRange: this.minRange,
                            maxRange: this.maxRange,
                            order: this.order,
                            marks: this.marks,
                            included: this.included,
                            process: this.process,
                            adsorb: this.adsorb,
                            dotOptions: this.dotOptions,
                            onError: this.emitError,
                          })),
                            [
                              'data',
                              'enableCross',
                              'fixed',
                              'max',
                              'min',
                              'interval',
                              'minRange',
                              'maxRange',
                              'order',
                              'marks',
                              'process',
                              'adsorb',
                              'included',
                              'dotOptions',
                            ].forEach(function (e) {
                              t.$watch(e, function (r) {
                                if (
                                  'data' === e &&
                                  Array.isArray(t.control.data) &&
                                  Array.isArray(r) &&
                                  t.control.data.length === r.length &&
                                  r.every(function (e, r) {
                                    return e === t.control.data[r];
                                  })
                                )
                                  return !1;
                                (t.control[e] = r),
                                  ['data', 'max', 'min', 'interval'].indexOf(e) > -1 &&
                                    t.control.syncDotsPos();
                              });
                            });
                        },
                      },
                      {
                        key: 'isDisabledByDotIndex',
                        value: function (t) {
                          return this.dots[t].disabled;
                        },
                      },
                      {
                        key: 'syncValueByPos',
                        value: function () {
                          var t = this.control.dotsValue;
                          this.isDiff(t, Array.isArray(this.value) ? this.value : [this.value]) &&
                            this.$emit('change', 1 === t.length ? t[0] : gt(t));
                        },
                      },
                      {
                        key: 'isDiff',
                        value: function (t, e) {
                          return (
                            t.length !== e.length ||
                            t.some(function (t, r) {
                              return t !== e[r];
                            })
                          );
                        },
                      },
                      {
                        key: 'emitError',
                        value: function (t, e) {
                          this.silent || console.error('[VueSlider error]: '.concat(e)),
                            this.$emit('error', t, e);
                        },
                      },
                      {
                        key: 'dragStart',
                        value: function (t) {
                          (this.focusDotIndex = t),
                            this.setScale(),
                            this.states.add(Vt.Drag),
                            this.states.add(Vt.Focus),
                            this.$emit('drag-start');
                        },
                      },
                      {
                        key: 'dragMove',
                        value: function (t) {
                          if (!this.states.has(Vt.Drag)) return !1;
                          t.preventDefault();
                          var e = this.getPosByEvent(t);
                          this.isCrossDot(e),
                            this.control.setDotPos(e, this.focusDotIndex),
                            this.lazy || this.syncValueByPos();
                          var r = this.control.dotsValue;
                          this.$emit('dragging', 1 === r.length ? r[0] : gt(r));
                        },
                      },
                      {
                        key: 'isCrossDot',
                        value: function (t) {
                          if (this.canSort) {
                            var e = this.focusDotIndex,
                              r = t;
                            r > this.dragRange[1]
                              ? ((r = this.dragRange[1]), this.focusDotIndex++)
                              : r < this.dragRange[0] &&
                                ((r = this.dragRange[0]), this.focusDotIndex--),
                              e !== this.focusDotIndex && this.control.setDotPos(r, e);
                          }
                        },
                      },
                      {
                        key: 'dragEnd',
                        value: function () {
                          var t = this;
                          if (!this.states.has(Vt.Drag)) return !1;
                          this.lazy && this.syncValueByPos(),
                            setTimeout(function () {
                              t.included && t.isNotSync
                                ? t.control.setValue(t.value)
                                : t.control.syncDotsPos(),
                                t.states.delete(Vt.Drag),
                                t.useKeyboard || t.states.delete(Vt.Focus),
                                t.$emit('drag-end');
                            });
                        },
                      },
                      {
                        key: 'blurHandle',
                        value: function (t) {
                          if (
                            !this.states.has(Vt.Focus) ||
                            !this.$refs.container ||
                            this.$refs.container.contains(t.target)
                          )
                            return !1;
                          this.states.delete(Vt.Focus);
                        },
                      },
                      {
                        key: 'clickHandle',
                        value: function (t) {
                          if (!this.clickable) return !1;
                          if (!this.states.has(Vt.Drag)) {
                            this.setScale();
                            var e = this.getPosByEvent(t);
                            this.setValueByPos(e);
                          }
                        },
                      },
                      {
                        key: 'focus',
                        value: function () {
                          var t =
                            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                          this.states.add(Vt.Focus), (this.focusDotIndex = t);
                        },
                      },
                      {
                        key: 'blur',
                        value: function () {
                          this.states.delete(Vt.Focus);
                        },
                      },
                      {
                        key: 'getValue',
                        value: function () {
                          var t = this.control.dotsValue;
                          return 1 === t.length ? t[0] : t;
                        },
                      },
                      {
                        key: 'getIndex',
                        value: function () {
                          var t = this.control.dotsIndex;
                          return 1 === t.length ? t[0] : t;
                        },
                      },
                      {
                        key: 'setValue',
                        value: function (t) {
                          this.control.setValue(Array.isArray(t) ? gt(t) : [t]),
                            this.syncValueByPos();
                        },
                      },
                      {
                        key: 'setIndex',
                        value: function (t) {
                          var e = this,
                            r = Array.isArray(t)
                              ? t.map(function (t) {
                                  return e.control.getValueByIndex(t);
                                })
                              : this.control.getValueByIndex(t);
                          this.setValue(r);
                        },
                      },
                      {
                        key: 'setValueByPos',
                        value: function (t) {
                          var e = this,
                            r = this.control.getRecentDot(t);
                          if (this.isDisabledByDotIndex(r)) return !1;
                          (this.focusDotIndex = r),
                            this.control.setDotPos(t, r),
                            this.syncValueByPos(),
                            this.useKeyboard && this.states.add(Vt.Focus),
                            setTimeout(function () {
                              e.included && e.isNotSync
                                ? e.control.setValue(e.value)
                                : e.control.syncDotsPos();
                            });
                        },
                      },
                      {
                        key: 'keydownHandle',
                        value: function (t) {
                          if (!this.useKeyboard || !this.states.has(Vt.Focus)) return !1;
                          var e = (function (t, e) {
                            switch (t.keyCode) {
                              case N.UP:
                                return function (t) {
                                  return 'ttb' === e.direction ? t - 1 : t + 1;
                                };
                              case N.RIGHT:
                                return function (t) {
                                  return 'rtl' === e.direction ? t - 1 : t + 1;
                                };
                              case N.DOWN:
                                return function (t) {
                                  return 'ttb' === e.direction ? t + 1 : t - 1;
                                };
                              case N.LEFT:
                                return function (t) {
                                  return 'rtl' === e.direction ? t + 1 : t - 1;
                                };
                              case N.END:
                                return function () {
                                  return e.max;
                                };
                              case N.HOME:
                                return function () {
                                  return e.min;
                                };
                              case N.PAGE_UP:
                                return function (t) {
                                  return t + 10;
                                };
                              case N.PAGE_DOWN:
                                return function (t) {
                                  return t - 10;
                                };
                              default:
                                return null;
                            }
                          })(t, { direction: this.direction, max: this.control.total, min: 0 });
                          if (e) {
                            t.preventDefault();
                            var r = this.control.getIndexByValue(
                                this.control.dotsValue[this.focusDotIndex]
                              ),
                              n = e(r),
                              o = this.control.parseValue(this.control.getValueByIndex(n));
                            this.isCrossDot(o),
                              this.control.setDotPos(o, this.focusDotIndex),
                              this.syncValueByPos();
                          }
                        },
                      },
                      {
                        key: 'getPosByEvent',
                        value: function (t) {
                          return (
                            L(t, this.$el, this.isReverse)[this.isHorizontal ? 'x' : 'y'] /
                            this.scale
                          );
                        },
                      },
                      {
                        key: 'renderSlot',
                        value: function (t, e, r, n) {
                          var o = this.$createElement,
                            i = this.$scopedSlots[t];
                          return i ? (n ? i(e) : o('template', { slot: t }, [i(e)])) : r;
                        },
                      },
                      {
                        key: 'render',
                        value: function () {
                          var t = this,
                            e = arguments[0];
                          return e(
                            'div',
                            {
                              ref: 'container',
                              class: this.containerClasses,
                              style: this.containerStyles,
                              attrs: { 'aria-hidden': !0 },
                              on: { click: this.clickHandle },
                            },
                            [
                              e('div', { class: 'vue-slider-rail', style: this.railStyle }, [
                                this.processArray.map(function (r, n) {
                                  return t.renderSlot(
                                    'process',
                                    r,
                                    e('div', {
                                      class: 'vue-slider-process',
                                      key: 'process-'.concat(n),
                                      style: r.style,
                                    }),
                                    !0
                                  );
                                }),
                                this.marks
                                  ? e('div', { class: 'vue-slider-marks' }, [
                                      this.control.markList.map(function (r, n) {
                                        var o;
                                        return t.renderSlot(
                                          'mark',
                                          r,
                                          e(
                                            'vue-slider-mark',
                                            {
                                              key: 'mark-'.concat(n),
                                              attrs: {
                                                mark: r,
                                                hideLabel: t.hideLabel,
                                                stepStyle: t.stepStyle,
                                                stepActiveStyle: t.stepActiveStyle,
                                                labelStyle: t.labelStyle,
                                                labelActiveStyle: t.labelActiveStyle,
                                              },
                                              style:
                                                ((o = {}),
                                                bt(o, t.isHorizontal ? 'height' : 'width', '100%'),
                                                bt(
                                                  o,
                                                  t.isHorizontal ? 'width' : 'height',
                                                  t.tailSize
                                                ),
                                                bt(o, t.mainDirection, ''.concat(r.pos, '%')),
                                                o),
                                              on: {
                                                pressLabel: function (e) {
                                                  return t.setValueByPos(e);
                                                },
                                              },
                                            },
                                            [
                                              t.renderSlot('step', r, null),
                                              t.renderSlot('label', r, null),
                                            ]
                                          ),
                                          !0
                                        );
                                      }),
                                    ])
                                  : null,
                                this.dots.map(function (r, n) {
                                  var o;
                                  return e(
                                    'vue-slider-dot',
                                    {
                                      ref: 'dot-'.concat(n),
                                      key: 'dot-'.concat(n),
                                      attrs: {
                                        value: r.value,
                                        disabled: r.disabled,
                                        focus: r.focus,
                                        'dot-style': [
                                          r.style,
                                          r.disabled ? r.disabledStyle : null,
                                          r.focus ? r.focusStyle : null,
                                        ],
                                        tooltip: r.tooltip || t.tooltip,
                                        'tooltip-style': [
                                          t.tooltipStyle,
                                          r.tooltipStyle,
                                          r.disabled ? r.tooltipDisabledStyle : null,
                                          r.focus ? r.tooltipFocusStyle : null,
                                        ],
                                        'tooltip-formatter': Array.isArray(t.tooltipFormatter)
                                          ? t.tooltipFormatter[n]
                                          : t.tooltipFormatter,
                                        'tooltip-placement': t.tooltipDirections[n],
                                      },
                                      style: [
                                        t.dotBaseStyle,
                                        ((o = {}),
                                        bt(o, t.mainDirection, ''.concat(r.pos, '%')),
                                        bt(
                                          o,
                                          'transition',
                                          ''.concat(t.mainDirection, ' ').concat(t.animateTime, 's')
                                        ),
                                        o),
                                      ],
                                      on: {
                                        'drag-start': function () {
                                          return t.dragStart(n);
                                        },
                                      },
                                    },
                                    [t.renderSlot('dot', r, null), t.renderSlot('tooltip', r, null)]
                                  );
                                }),
                              ]),
                              1 !== this.dots.length || this.data
                                ? null
                                : e('input', {
                                    class: 'vue-slider-sr-only',
                                    attrs: { type: 'range', min: this.min, max: this.max },
                                    domProps: { value: this.value },
                                  }),
                            ]
                          );
                        },
                      },
                      {
                        key: 'tailSize',
                        get: function () {
                          return B((this.isHorizontal ? this.height : this.width) || 4);
                        },
                      },
                      {
                        key: 'containerClasses',
                        get: function () {
                          return [
                            'vue-slider',
                            ['vue-slider-'.concat(this.direction)],
                            { 'vue-slider-disabled': this.disabled },
                          ];
                        },
                      },
                      {
                        key: 'containerStyles',
                        get: function () {
                          var t = Array.isArray(this.dotSize)
                              ? this.dotSize
                              : [this.dotSize, this.dotSize],
                            e = ht(t, 2),
                            r = e[0],
                            n = e[1],
                            o = this.width ? B(this.width) : this.isHorizontal ? 'auto' : B(4),
                            i = this.height ? B(this.height) : this.isHorizontal ? B(4) : 'auto';
                          return {
                            padding: this.contained
                              ? ''.concat(n / 2, 'px ').concat(r / 2, 'px')
                              : this.isHorizontal
                              ? ''.concat(n / 2, 'px 0')
                              : '0 '.concat(r / 2, 'px'),
                            width: o,
                            height: i,
                          };
                        },
                      },
                      {
                        key: 'processArray',
                        get: function () {
                          var t = this;
                          return this.control.processArray.map(function (e) {
                            var r,
                              n = ht(e, 3),
                              o = n[0],
                              i = n[1],
                              s = n[2];
                            if (o > i) {
                              var a = [i, o];
                              (o = a[0]), (i = a[1]);
                            }
                            var u = t.isHorizontal ? 'width' : 'height';
                            return {
                              start: o,
                              end: i,
                              style: pt(
                                ((r = {}),
                                bt(r, t.isHorizontal ? 'height' : 'width', '100%'),
                                bt(r, t.isHorizontal ? 'top' : 'left', 0),
                                bt(r, t.mainDirection, ''.concat(o, '%')),
                                bt(r, u, ''.concat(i - o, '%')),
                                bt(
                                  r,
                                  'transitionProperty',
                                  ''.concat(u, ',').concat(t.mainDirection)
                                ),
                                bt(r, 'transitionDuration', ''.concat(t.animateTime, 's')),
                                r),
                                t.processStyle,
                                s
                              ),
                            };
                          });
                        },
                      },
                      {
                        key: 'dotBaseStyle',
                        get: function () {
                          var t,
                            e = Array.isArray(this.dotSize)
                              ? this.dotSize
                              : [this.dotSize, this.dotSize],
                            r = ht(e, 2),
                            n = r[0],
                            o = r[1];
                          return (
                            (t = this.isHorizontal
                              ? bt(
                                  {
                                    transform: 'translate('.concat(
                                      this.isReverse ? '50%' : '-50%',
                                      ', -50%)'
                                    ),
                                    WebkitTransform: 'translate('.concat(
                                      this.isReverse ? '50%' : '-50%',
                                      ', -50%)'
                                    ),
                                    top: '50%',
                                  },
                                  'ltr' === this.direction ? 'left' : 'right',
                                  '0'
                                )
                              : bt(
                                  {
                                    transform: 'translate(-50%, '.concat(
                                      this.isReverse ? '50%' : '-50%',
                                      ')'
                                    ),
                                    WebkitTransform: 'translate(-50%, '.concat(
                                      this.isReverse ? '50%' : '-50%',
                                      ')'
                                    ),
                                    left: '50%',
                                  },
                                  'btt' === this.direction ? 'bottom' : 'top',
                                  '0'
                                )),
                            pt({ width: ''.concat(n, 'px'), height: ''.concat(o, 'px') }, t)
                          );
                        },
                      },
                      {
                        key: 'mainDirection',
                        get: function () {
                          switch (this.direction) {
                            case 'ltr':
                              return 'left';
                            case 'rtl':
                              return 'right';
                            case 'btt':
                              return 'bottom';
                            case 'ttb':
                              return 'top';
                          }
                        },
                      },
                      {
                        key: 'isHorizontal',
                        get: function () {
                          return 'ltr' === this.direction || 'rtl' === this.direction;
                        },
                      },
                      {
                        key: 'isReverse',
                        get: function () {
                          return 'rtl' === this.direction || 'btt' === this.direction;
                        },
                      },
                      {
                        key: 'tooltipDirections',
                        get: function () {
                          var t = this.tooltipPlacement || (this.isHorizontal ? 'top' : 'left');
                          return Array.isArray(t)
                            ? t
                            : this.dots.map(function () {
                                return t;
                              });
                        },
                      },
                      {
                        key: 'dots',
                        get: function () {
                          var t = this;
                          return this.control.dotsPos.map(function (e, r) {
                            return pt(
                              {
                                pos: e,
                                index: r,
                                value: t.control.dotsValue[r],
                                focus: t.states.has(Vt.Focus) && t.focusDotIndex === r,
                                disabled: !1,
                                style: t.dotStyle,
                              },
                              (Array.isArray(t.dotOptions) ? t.dotOptions[r] : t.dotOptions) || {}
                            );
                          });
                        },
                      },
                      {
                        key: 'animateTime',
                        get: function () {
                          return this.states.has(Vt.Drag) ? 0 : this.duration;
                        },
                      },
                      {
                        key: 'canSort',
                        get: function () {
                          return (
                            this.order &&
                            !this.minRange &&
                            !this.maxRange &&
                            !this.fixed &&
                            this.enableCross
                          );
                        },
                      },
                      {
                        key: 'isNotSync',
                        get: function () {
                          var t = this.control.dotsValue;
                          return Array.isArray(this.value)
                            ? this.value.length !== t.length ||
                                this.value.some(function (e, r) {
                                  return e !== t[r];
                                })
                            : this.value !== t[0];
                        },
                      },
                      {
                        key: 'dragRange',
                        get: function () {
                          var t = this.dots[this.focusDotIndex - 1],
                            e = this.dots[this.focusDotIndex + 1];
                          return [t ? t.pos : -1 / 0, e ? e.pos : 1 / 0];
                        },
                      },
                    ]),
                    e
                  );
                })(s.a);
              o(
                [
                  (function (t, e) {
                    return (
                      void 0 === e && (e = {}),
                      function (r, n) {
                        c(e, r, n),
                          Object(a.createDecorator)(function (r, n) {
                            ((r.props || (r.props = {}))[n] = e),
                              (r.model = { prop: n, event: t || n });
                          })(r, n);
                      }
                    );
                  })('change', { default: 0 }),
                ],
                Mt.prototype,
                'value',
                void 0
              ),
                o([f({ type: Boolean, default: !1 })], Mt.prototype, 'silent', void 0),
                o(
                  [
                    f({
                      default: 'ltr',
                      validator: function (t) {
                        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(t) > -1;
                      },
                    }),
                  ],
                  Mt.prototype,
                  'direction',
                  void 0
                ),
                o([f({ type: [Number, String] })], Mt.prototype, 'width', void 0),
                o([f({ type: [Number, String] })], Mt.prototype, 'height', void 0),
                o([f({ default: 14 })], Mt.prototype, 'dotSize', void 0),
                o([f({ default: !1 })], Mt.prototype, 'contained', void 0),
                o([f({ type: Number, default: 0 })], Mt.prototype, 'min', void 0),
                o([f({ type: Number, default: 100 })], Mt.prototype, 'max', void 0),
                o([f({ type: Number, default: 1 })], Mt.prototype, 'interval', void 0),
                o([f({ type: Boolean, default: !1 })], Mt.prototype, 'disabled', void 0),
                o([f({ type: Boolean, default: !0 })], Mt.prototype, 'clickable', void 0),
                o([f({ type: Number, default: 0.5 })], Mt.prototype, 'duration', void 0),
                o([f(Array)], Mt.prototype, 'data', void 0),
                o([f({ type: Boolean, default: !1 })], Mt.prototype, 'lazy', void 0),
                o(
                  [
                    f({
                      type: String,
                      validator: function (t) {
                        return ['none', 'always', 'focus'].indexOf(t) > -1;
                      },
                      default: 'focus',
                    }),
                  ],
                  Mt.prototype,
                  'tooltip',
                  void 0
                ),
                o(
                  [
                    f({
                      type: [String, Array],
                      validator: function (t) {
                        return (Array.isArray(t) ? t : [t]).every(function (t) {
                          return ['top', 'right', 'bottom', 'left'].indexOf(t) > -1;
                        });
                      },
                    }),
                  ],
                  Mt.prototype,
                  'tooltipPlacement',
                  void 0
                ),
                o(
                  [f({ type: [String, Array, Function] })],
                  Mt.prototype,
                  'tooltipFormatter',
                  void 0
                ),
                o([f({ type: Boolean, default: !1 })], Mt.prototype, 'useKeyboard', void 0),
                o([f({ type: Boolean, default: !0 })], Mt.prototype, 'enableCross', void 0),
                o([f({ type: Boolean, default: !1 })], Mt.prototype, 'fixed', void 0),
                o([f({ type: Boolean, default: !0 })], Mt.prototype, 'order', void 0),
                o([f(Number)], Mt.prototype, 'minRange', void 0),
                o([f(Number)], Mt.prototype, 'maxRange', void 0),
                o(
                  [f({ type: [Boolean, Object, Array, Function], default: !1 })],
                  Mt.prototype,
                  'marks',
                  void 0
                ),
                o([f({ type: [Boolean, Function], default: !0 })], Mt.prototype, 'process', void 0),
                o([f(Boolean)], Mt.prototype, 'included', void 0),
                o([f(Boolean)], Mt.prototype, 'adsorb', void 0),
                o([f(Boolean)], Mt.prototype, 'hideLabel', void 0),
                o([f()], Mt.prototype, 'dotOptions', void 0),
                o([f()], Mt.prototype, 'railStyle', void 0),
                o([f()], Mt.prototype, 'processStyle', void 0),
                o([f()], Mt.prototype, 'dotStyle', void 0),
                o([f()], Mt.prototype, 'tooltipStyle', void 0),
                o([f()], Mt.prototype, 'stepStyle', void 0),
                o([f()], Mt.prototype, 'stepActiveStyle', void 0),
                o([f()], Mt.prototype, 'labelStyle', void 0),
                o([f()], Mt.prototype, 'labelActiveStyle', void 0),
                o(
                  [
                    (function (t, e) {
                      void 0 === e && (e = {});
                      var r = e.deep,
                        n = void 0 !== r && r,
                        o = e.immediate,
                        i = void 0 !== o && o;
                      return Object(a.createDecorator)(function (e, r) {
                        'object' != typeof e.watch && (e.watch = Object.create(null));
                        var o = e.watch;
                        'object' != typeof o[t] || Array.isArray(o[t])
                          ? void 0 === o[t] && (o[t] = [])
                          : (o[t] = [o[t]]),
                          o[t].push({ handler: r, deep: n, immediate: i });
                      });
                    })('value'),
                  ],
                  Mt.prototype,
                  'onValueChanged',
                  null
                );
              var Ct = (Mt = o(
                  [
                    u()({
                      data: function () {
                        return { control: null };
                      },
                      components: { VueSliderDot: P, VueSliderMark: T },
                      inheritAttrs: !1,
                    }),
                  ],
                  Mt
                )),
                Nt = Ct;
              r.d(e, 'ERROR_TYPE', function () {
                return W;
              }),
                (e.default = Nt);
            },
          }).default));
    },
    './node_modules/vue-slider-component/theme/default.css': function (
      module,
      exports,
      __webpack_require__
    ) {
      var content = __webpack_require__(
        './node_modules/css-loader/dist/cjs.js!./node_modules/vue-slider-component/theme/default.css'
      );
      'string' == typeof content && (content = [[module.i, content, '']]),
        content.locals && (module.exports = content.locals);
      (0, __webpack_require__('./node_modules/vue-style-loader/lib/addStylesClient.js').default)(
        '6c84a470',
        content,
        !1,
        {}
      );
    },
    './node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-switches/dist/switches.css?vue&type=style&index=0&lang=css&': function (
      module,
      exports,
      __webpack_require__
    ) {
      var content = __webpack_require__(
        './node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-switches/dist/switches.css?vue&type=style&index=0&lang=css&'
      );
      'string' == typeof content && (content = [[module.i, content, '']]),
        content.locals && (module.exports = content.locals);
      (0, __webpack_require__('./node_modules/vue-style-loader/lib/addStylesClient.js').default)(
        'b8fc9158',
        content,
        !1,
        {}
      );
    },
    './node_modules/vue-style-loader/lib/addStylesClient.js': function (
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      'use strict';
      function listToStyles(parentId, list) {
        for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
          var item = list[i],
            id = item[0],
            part = { id: parentId + ':' + i, css: item[1], media: item[2], sourceMap: item[3] };
          newStyles[id]
            ? newStyles[id].parts.push(part)
            : styles.push((newStyles[id] = { id: id, parts: [part] }));
        }
        return styles;
      }
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, 'default', function () {
          return addStylesClient;
        });
      var hasDocument = 'undefined' != typeof document;
      if ('undefined' != typeof DEBUG && DEBUG && !hasDocument)
        throw new Error(
          "vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
        );
      var stylesInDom = {},
        head = hasDocument && (document.head || document.getElementsByTagName('head')[0]),
        singletonElement = null,
        singletonCounter = 0,
        isProduction = !1,
        noop = function () {},
        options = null,
        ssrIdKey = 'data-vue-ssr-id',
        isOldIE =
          'undefined' != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
      function addStylesClient(parentId, list, _isProduction, _options) {
        (isProduction = _isProduction), (options = _options || {});
        var styles = listToStyles(parentId, list);
        return (
          addStylesToDom(styles),
          function (newList) {
            for (var mayRemove = [], i = 0; i < styles.length; i++) {
              var item = styles[i];
              (domStyle = stylesInDom[item.id]).refs--, mayRemove.push(domStyle);
            }
            newList ? addStylesToDom((styles = listToStyles(parentId, newList))) : (styles = []);
            for (i = 0; i < mayRemove.length; i++) {
              var domStyle;
              if (0 === (domStyle = mayRemove[i]).refs) {
                for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                delete stylesInDom[domStyle.id];
              }
            }
          }
        );
      }
      function addStylesToDom(styles) {
        for (var i = 0; i < styles.length; i++) {
          var item = styles[i],
            domStyle = stylesInDom[item.id];
          if (domStyle) {
            domStyle.refs++;
            for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
            for (; j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j]));
            domStyle.parts.length > item.parts.length &&
              (domStyle.parts.length = item.parts.length);
          } else {
            var parts = [];
            for (j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j]));
            stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts };
          }
        }
      }
      function createStyleElement() {
        var styleElement = document.createElement('style');
        return (styleElement.type = 'text/css'), head.appendChild(styleElement), styleElement;
      }
      function addStyle(obj) {
        var update,
          remove,
          styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]');
        if (styleElement) {
          if (isProduction) return noop;
          styleElement.parentNode.removeChild(styleElement);
        }
        if (isOldIE) {
          var styleIndex = singletonCounter++;
          (styleElement = singletonElement || (singletonElement = createStyleElement())),
            (update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1)),
            (remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0));
        } else
          (styleElement = createStyleElement()),
            (update = function (styleElement, obj) {
              var css = obj.css,
                media = obj.media,
                sourceMap = obj.sourceMap;
              media && styleElement.setAttribute('media', media);
              options.ssrId && styleElement.setAttribute(ssrIdKey, obj.id);
              sourceMap &&
                ((css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'),
                (css +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                  btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) +
                  ' */'));
              if (styleElement.styleSheet) styleElement.styleSheet.cssText = css;
              else {
                for (; styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                styleElement.appendChild(document.createTextNode(css));
              }
            }.bind(null, styleElement)),
            (remove = function () {
              styleElement.parentNode.removeChild(styleElement);
            });
        return (
          update(obj),
          function (newObj) {
            if (newObj) {
              if (
                newObj.css === obj.css &&
                newObj.media === obj.media &&
                newObj.sourceMap === obj.sourceMap
              )
                return;
              update((obj = newObj));
            } else remove();
          }
        );
      }
      var textStore,
        replaceText =
          ((textStore = []),
          function (index, replacement) {
            return (textStore[index] = replacement), textStore.filter(Boolean).join('\n');
          });
      function applyToSingletonTag(styleElement, index, remove, obj) {
        var css = remove ? '' : obj.css;
        if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css);
        else {
          var cssNode = document.createTextNode(css),
            childNodes = styleElement.childNodes;
          childNodes[index] && styleElement.removeChild(childNodes[index]),
            childNodes.length
              ? styleElement.insertBefore(cssNode, childNodes[index])
              : styleElement.appendChild(cssNode);
        }
      }
    },
    './node_modules/vue-switches/dist/switches.css?vue&type=style&index=0&lang=css&': function (
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      'use strict';
      var _vue_style_loader_index_js_css_loader_dist_cjs_js_vue_loader_lib_loaders_stylePostLoader_js_switches_css_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        './node_modules/vue-style-loader/index.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-switches/dist/switches.css?vue&type=style&index=0&lang=css&'
      );
      __webpack_require__.n(
        _vue_style_loader_index_js_css_loader_dist_cjs_js_vue_loader_lib_loaders_stylePostLoader_js_switches_css_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__
      ).a;
    },
    './src/Header.vue': function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      var render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'div',
          { staticClass: 'gantt-elastic__header', style: Object.assign({}, _vm.style.header) },
          [
            _c(
              'div',
              {
                staticClass: 'gantt-elastic__header-title',
                style: Object.assign({}, _vm.style['header-title']),
              },
              [
                _vm.opts.title.html
                  ? _vm._e()
                  : _c(
                      'div',
                      {
                        staticClass: 'gantt-elastic__header-title--text',
                        style: Object.assign({}, _vm.style['header-title--text']),
                      },
                      [_vm._v('\n      ' + _vm._s(_vm.opts.title.label) + '\n    ')]
                    ),
                _vm._v(' '),
                _vm.opts.title.html
                  ? _c('div', {
                      staticClass: 'gantt-elastic__header-title--html',
                      style: Object.assign({}, _vm.style['header-title--html']),
                      domProps: { innerHTML: _vm._s(_vm.opts.title.label) },
                    })
                  : _vm._e(),
              ]
            ),
            _vm._v(' '),
            _c(
              'div',
              {
                staticClass: 'gantt-elastic__header-options',
                style: Object.assign({}, _vm.style['header-options']),
              },
              [
                _c(
                  'button',
                  {
                    staticClass: 'gantt-elastic__header-btn-recenter',
                    style: Object.assign({}, _vm.style['header-btn-recenter']),
                    on: {
                      click: function ($event) {
                        return $event.preventDefault(), _vm.recenterPosition($event);
                      },
                    },
                  },
                  [_vm._v('\n      ' + _vm._s(_vm.opts.locale.Now) + '\n    ')]
                ),
                _vm._v(' '),
                _c(
                  'label',
                  {
                    staticClass: 'gantt-elastic__header-label',
                    style: Object.assign({}, _vm.style['header-label']),
                  },
                  [
                    _vm._v('\n      ' + _vm._s(_vm.opts.locale['X-Scale']) + '\n      '),
                    _c(
                      'div',
                      {
                        staticClass: 'gantt-elastic__header-slider-wrapper',
                        style: Object.assign({}, _vm.style['header-slider-wrapper']),
                      },
                      [
                        _c('vue-slider', {
                          staticClass: 'gantt-elastic__header-slider',
                          style: Object.assign({}, _vm.style['header-slider']),
                          attrs: {
                            tooltip: 'none',
                            'process-style': Object.assign({}, _vm.style['header-slider--process']),
                            'slider-style': Object.assign({}, _vm.style['header-slider--slider']),
                            max: 24,
                            min: 2,
                            width: '100px',
                          },
                          model: {
                            value: _vm.scale,
                            callback: function ($$v) {
                              _vm.scale = $$v;
                            },
                            expression: 'scale',
                          },
                        }),
                      ],
                      1
                    ),
                  ]
                ),
                _vm._v(' '),
                _c(
                  'label',
                  {
                    staticClass: 'gantt-elastic__header-label',
                    style: Object.assign({}, _vm.style['header-label']),
                  },
                  [
                    _vm._v('\n      ' + _vm._s(_vm.opts.locale['Y-Scale']) + '\n      '),
                    _c(
                      'div',
                      {
                        staticClass: 'gantt-elastic__header-slider-wrapper',
                        style: Object.assign({}, _vm.style['header-slider-wrapper']),
                      },
                      [
                        _c('vue-slider', {
                          staticClass: 'gantt-elastic__header-slider',
                          style: Object.assign({}, _vm.style['header-slider']),
                          attrs: {
                            tooltip: 'none',
                            'process-style': Object.assign({}, _vm.style['header-slider--process']),
                            'slider-style': Object.assign({}, _vm.style['header-slider--slider']),
                            max: 100,
                            min: 7,
                            width: '100px',
                          },
                          model: {
                            value: _vm.height,
                            callback: function ($$v) {
                              _vm.height = $$v;
                            },
                            expression: 'height',
                          },
                        }),
                      ],
                      1
                    ),
                  ]
                ),
                _vm._v(' '),
                _c(
                  'label',
                  {
                    staticClass: 'gantt-elastic__header-label',
                    style: Object.assign({}, _vm.style['header-label']),
                  },
                  [
                    _vm._v('\n      ' + _vm._s(_vm.opts.locale['Before/After']) + '\n      '),
                    _c(
                      'div',
                      {
                        staticClass: 'gantt-elastic__header-slider-wrapper',
                        style: Object.assign({}, _vm.style['header-slider-wrapper']),
                      },
                      [
                        _c('vue-slider', {
                          staticClass: 'gantt-elastic__header-slider',
                          style: Object.assign({}, _vm.style['header-slider']),
                          attrs: {
                            tooltip: 'none',
                            'process-style': Object.assign({}, _vm.style['header-slider--process']),
                            'slider-style': Object.assign({}, _vm.style['header-slider--slider']),
                            max: 31,
                            min: 0,
                            width: '100px',
                          },
                          model: {
                            value: _vm.scope,
                            callback: function ($$v) {
                              _vm.scope = $$v;
                            },
                            expression: 'scope',
                          },
                        }),
                      ],
                      1
                    ),
                  ]
                ),
                _vm._v(' '),
                _c(
                  'label',
                  {
                    staticClass: 'gantt-elastic__header-label',
                    style: Object.assign({}, _vm.style['header-label']),
                  },
                  [
                    _vm._v('\n      ' + _vm._s(_vm.opts.locale['Task list width']) + '\n      '),
                    _c(
                      'div',
                      {
                        staticClass: 'gantt-elastic__header-slider-wrapper',
                        style: Object.assign({}, _vm.style['header-slider-wrapper']),
                      },
                      [
                        _c('vue-slider', {
                          staticClass: 'gantt-elastic__header-slider',
                          style: Object.assign({}, _vm.style['header-slider']),
                          attrs: {
                            tooltip: 'none',
                            'process-style': Object.assign({}, _vm.style['header-slider--process']),
                            'slider-style': Object.assign({}, _vm.style['header-slider--slider']),
                            max: 100,
                            min: 0,
                            width: '100px',
                          },
                          model: {
                            value: _vm.divider,
                            callback: function ($$v) {
                              _vm.divider = $$v;
                            },
                            expression: 'divider',
                          },
                        }),
                      ],
                      1
                    ),
                  ]
                ),
                _vm._v(' '),
                _c(
                  'label',
                  {
                    staticClass: 'gantt-elastic__header-task-list-switch--wrapper',
                    style: Object.assign({}, _vm.style['header-task-list-switch--label']),
                  },
                  [
                    _c('switches', {
                      staticClass: 'gantt-elastic__header-task-list-switch',
                      style: Object.assign({}, _vm.style['header-task-list-switch']),
                      model: {
                        value: _vm.root.state.options.taskList.display,
                        callback: function ($$v) {
                          _vm.$set(_vm.root.state.options.taskList, 'display', $$v);
                        },
                        expression: 'root.state.options.taskList.display',
                      },
                    }),
                    _vm._v('\n      ' + _vm._s(_vm.opts.locale['Display task list']) + '\n    '),
                  ],
                  1
                ),
              ]
            ),
          ]
        );
      };
      render._withStripped = !0;
      var vue_slider_component_umd_min = __webpack_require__(
          './node_modules/vue-slider-component/dist/vue-slider-component.umd.min.js'
        ),
        vue_slider_component_umd_min_default = __webpack_require__.n(vue_slider_component_umd_min),
        switchesvue_type_template_id_f8bdc788_render =
          (__webpack_require__('./node_modules/vue-slider-component/theme/default.css'),
          function () {
            var _vm = this,
              _h = _vm.$createElement,
              _c = _vm._self._c || _h;
            return _c('label', { class: _vm.classObject }, [
              _vm.shouldShowLabel
                ? _c('span', { staticClass: 'vue-switcher__label' }, [
                    _vm.label
                      ? _c('span', { domProps: { textContent: _vm._s(_vm.label) } })
                      : _vm._e(),
                    _vm._v(' '),
                    !_vm.label && _vm.value
                      ? _c('span', { domProps: { textContent: _vm._s(_vm.textEnabled) } })
                      : _vm._e(),
                    _vm._v(' '),
                    _vm.label || _vm.value
                      ? _vm._e()
                      : _c('span', { domProps: { textContent: _vm._s(_vm.textDisabled) } }),
                  ])
                : _vm._e(),
              _vm._v(' '),
              _c('input', {
                attrs: { type: 'checkbox', disabled: _vm.disabled },
                domProps: { checked: _vm.value },
                on: { change: _vm.trigger },
              }),
              _vm._v(' '),
              _c('div'),
            ]);
          });
      switchesvue_type_template_id_f8bdc788_render._withStripped = !0;
      var src_switchesvue_type_script_lang_js_ = {
        name: 'switches',
        props: {
          typeBold: { default: !1 },
          value: { default: !1 },
          disabled: { default: !1 },
          label: { default: '' },
          textEnabled: { default: '' },
          textDisabled: { default: '' },
          color: { default: 'default' },
          theme: { default: 'default' },
          emitOnMount: { default: !0 },
        },
        mounted() {
          this.emitOnMount && this.$emit('input', this.value);
        },
        methods: {
          trigger(e) {
            this.$emit('input', e.target.checked);
          },
        },
        computed: {
          classObject() {
            const {
              color: color,
              value: value,
              theme: theme,
              typeBold: typeBold,
              disabled: disabled,
            } = this;
            return {
              'vue-switcher': !0,
              'vue-switcher--unchecked': !value,
              'vue-switcher--disabled': disabled,
              'vue-switcher--bold': typeBold,
              'vue-switcher--bold--unchecked': typeBold && !value,
              [`vue-switcher-theme--${theme}`]: color,
              [`vue-switcher-color--${color}`]: color,
            };
          },
          shouldShowLabel() {
            return '' !== this.label || '' !== this.textEnabled || '' !== this.textDisabled;
          },
        },
      };
      __webpack_require__(
        './node_modules/vue-switches/dist/switches.css?vue&type=style&index=0&lang=css&'
      );
      function normalizeComponent(
        scriptExports,
        render,
        staticRenderFns,
        functionalTemplate,
        injectStyles,
        scopeId,
        moduleIdentifier,
        shadowMode
      ) {
        var hook,
          options = 'function' == typeof scriptExports ? scriptExports.options : scriptExports;
        if (
          (render &&
            ((options.render = render),
            (options.staticRenderFns = staticRenderFns),
            (options._compiled = !0)),
          functionalTemplate && (options.functional = !0),
          scopeId && (options._scopeId = 'data-v-' + scopeId),
          moduleIdentifier
            ? ((hook = function (context) {
                (context =
                  context ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)) ||
                  'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                  (context = __VUE_SSR_CONTEXT__),
                  injectStyles && injectStyles.call(this, context),
                  context &&
                    context._registeredComponents &&
                    context._registeredComponents.add(moduleIdentifier);
              }),
              (options._ssrRegister = hook))
            : injectStyles &&
              (hook = shadowMode
                ? function () {
                    injectStyles.call(this, this.$root.$options.shadowRoot);
                  }
                : injectStyles),
          hook)
        )
          if (options.functional) {
            options._injectStyles = hook;
            var originalRender = options.render;
            options.render = function (h, context) {
              return hook.call(context), originalRender(h, context);
            };
          } else {
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
        return { exports: scriptExports, options: options };
      }
      var component = normalizeComponent(
        src_switchesvue_type_script_lang_js_,
        switchesvue_type_template_id_f8bdc788_render,
        [],
        !1,
        null,
        null,
        null
      );
      component.options.__file = 'node_modules/vue-switches/src/switches.vue';
      var switches = component.exports;
      const defaultStyle = {
          header: {
            margin: '0px auto',
            background: '#f3f5f747',
            padding: '10px',
            overflow: 'hidden',
            clear: 'both',
            display: 'flex',
            'justify-content': 'space-between',
          },
          'header-title': { float: 'left' },
          'header-options': { float: 'right' },
          'header-title--text': {
            'font-size': '20px',
            'vertical-align': 'middle',
            'font-weight': '400',
            'line-height': '35px',
            'padding-left': '22px',
            'letter-spacing': '1px',
          },
          'header-title--html': {
            'font-size': '20px',
            'vertical-align': 'middle',
            'font-weight': '400',
            'line-height': '35px',
            'padding-left': '22px',
            'letter-spacing': '1px',
          },
          'header-btn-recenter': {
            background: '#95A5A6',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            color: 'white',
            'border-radius': '3px',
            'margin-right': '27px',
            'font-size': '16px',
            padding: '8px 12px',
          },
          'header-slider': { 'box-sizing': 'content-box' },
          'header-slider-wrapper': { display: 'inline-block', 'vertical-align': 'middle' },
          'header-slider--slider': { 'box-sizing': 'content-box' },
          'header-slider--process': { 'box-sizing': 'content-box' },
          'header-task-list-switch--label': { 'box-sizing': 'content-box' },
          'header-task-list-switch': { margin: '0px 15px', 'vertical-align': 'middle' },
          'header-label': {},
        },
        defaultOptions = {
          title: { label: 'gantt-elastic', html: !1 },
          locale: {
            Now: 'Now',
            'X-Scale': 'Zoom-X',
            'Y-Scale': 'Zoom-Y',
            'Task list width': 'Task list',
            'Before/After': 'Expand',
            'Display task list': 'Show task list',
          },
        };
      var Header_component = normalizeComponent(
        {
          name: 'GanttHeader',
          components: { vueSlider: vue_slider_component_umd_min_default.a, Switches: switches },
          props: ['options', 'dynamicStyle'],
          inject: ['root'],
          data: () => ({
            scaleTimeoutId: null,
            firstScale: !1,
            localScale: 0,
            localHeight: 0,
            localBefore: 0,
            localPercent: 0,
            sliderOptions: { xScale: { value: 0 } },
            style: {},
            opts: {},
          }),
          created() {
            (this.localScale = this.root.state.options.times.timeZoom),
              (this.localHeight = this.root.state.options.row.height),
              (this.localBefore = this.root.state.options.scope.before),
              (this.localPercent = this.root.state.options.taskList.percent),
              (this.sliderOptions.xScale.value = this.root.state.options.times.timeZoom),
              (this.style = this.root.mergeDeep({}, defaultStyle, this.dynamicStyle)),
              (this.opts = this.root.mergeDeep({}, defaultOptions, this.options));
          },
          methods: {
            getImage() {
              this.root.getImage('image/png').then((imgB64) => {
                const link = document.createElement('a');
                (link.href = imgB64),
                  (link.download = 'gantt-elastic.png'),
                  document.body.appendChild(link),
                  link.click(),
                  document.body.removeChild(link);
              });
            },
            recenterPosition() {
              this.root.$emit('recenterPosition');
            },
            setScale(value) {
              null !== this.scaleTimeoutId &&
                (clearTimeout(this.scaleTimeoutId), (this.scaleTimeoutId = null)),
                this.firstScale
                  ? (this.scaleTimeoutId = setTimeout(() => {
                      this.root.$emit('times-timeZoom-change', value), (this.scaleTimeoutId = null);
                    }, 50))
                  : (this.root.$emit('times-timeZoom-change', value), (this.firstScale = !0));
            },
          },
          computed: {
            beforeOptionsIsComponent() {
              const headerSlot = this.options.slots.header;
              return (
                'object' == typeof headerSlot.beforeOptions &&
                !Array.isArray(headerSlot.beforeOptions)
              );
            },
            beforeOptionsIsHtml() {
              return 'string' == typeof this.options.slots.header.beforeOptions;
            },
            scale: {
              get() {
                return this.localScale;
              },
              set(value) {
                (this.localScale = Number(value)), this.setScale(this.localScale);
              },
            },
            height: {
              get() {
                return this.localHeight;
              },
              set(value) {
                (this.localHeight = Number(value)),
                  this.root.$emit('row-height-change', Number(value));
              },
            },
            scope: {
              get() {
                return this.localBefore;
              },
              set(value) {
                (this.localBefore = Number(value)), this.root.$emit('scope-change', Number(value));
              },
            },
            divider: {
              get() {
                return this.localPercent;
              },
              set(value) {
                (this.localPercent = Number(value)),
                  this.root.$emit('taskList-width-change', Number(value));
              },
            },
          },
        },
        render,
        [],
        !1,
        null,
        null,
        null
      );
      Header_component.options.__file = 'src/Header.vue';
      __webpack_exports__.default = Header_component.exports;
    },
    vue: function (module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE_vue__;
    },
  }).default;
});
