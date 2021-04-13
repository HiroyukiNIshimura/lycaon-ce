!(function (modules) {
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
    __webpack_require__((__webpack_require__.s = 8));
})([
  function (module, exports, __webpack_require__) {
    module.exports = (function () {
      'use strict';
      var t = 'millisecond',
        n = 'second',
        e = 'minute',
        r = 'hour',
        i = 'day',
        s = 'week',
        u = 'month',
        a = 'quarter',
        o = 'year',
        h = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,
        f = /\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
        c = function (t, n, e) {
          var r = String(t);
          return !r || r.length >= n ? t : '' + Array(n + 1 - r.length).join(e) + t;
        },
        d = {
          s: c,
          z: function (t) {
            var n = -t.utcOffset(),
              e = Math.abs(n),
              r = Math.floor(e / 60),
              i = e % 60;
            return (n <= 0 ? '+' : '-') + c(r, 2, '0') + ':' + c(i, 2, '0');
          },
          m: function (t, n) {
            var e = 12 * (n.year() - t.year()) + (n.month() - t.month()),
              r = t.clone().add(e, u),
              i = n - r < 0,
              s = t.clone().add(e + (i ? -1 : 1), u);
            return Number(-(e + (n - r) / (i ? r - s : s - r)) || 0);
          },
          a: function (t) {
            return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
          },
          p: function (h) {
            return (
              { M: u, y: o, w: s, d: i, h: r, m: e, s: n, ms: t, Q: a }[h] ||
              String(h || '')
                .toLowerCase()
                .replace(/s$/, '')
            );
          },
          u: function (t) {
            return void 0 === t;
          },
        },
        $ = {
          name: 'en',
          weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
          months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
          ),
        },
        l = 'en',
        m = {};
      m[l] = $;
      var y = function (t) {
          return t instanceof v;
        },
        M = function (t, n, e) {
          var r;
          if (!t) return l;
          if ('string' == typeof t) m[t] && (r = t), n && ((m[t] = n), (r = t));
          else {
            var i = t.name;
            (m[i] = t), (r = i);
          }
          return e || (l = r), r;
        },
        g = function (t, n, e) {
          if (y(t)) return t.clone();
          var r = n ? ('string' == typeof n ? { format: n, pl: e } : n) : {};
          return (r.date = t), new v(r);
        },
        D = d;
      (D.l = M),
        (D.i = y),
        (D.w = function (t, n) {
          return g(t, { locale: n.$L, utc: n.$u });
        });
      var v = (function () {
        function c(t) {
          (this.$L = this.$L || M(t.locale, null, !0)), this.parse(t);
        }
        var d = c.prototype;
        return (
          (d.parse = function (t) {
            (this.$d = (function (t) {
              var n = t.date,
                e = t.utc;
              if (null === n) return new Date(NaN);
              if (D.u(n)) return new Date();
              if (n instanceof Date) return new Date(n);
              if ('string' == typeof n && !/Z$/i.test(n)) {
                var r = n.match(h);
                if (r)
                  return e
                    ? new Date(
                        Date.UTC(
                          r[1],
                          r[2] - 1,
                          r[3] || 1,
                          r[4] || 0,
                          r[5] || 0,
                          r[6] || 0,
                          r[7] || 0
                        )
                      )
                    : new Date(
                        r[1],
                        r[2] - 1,
                        r[3] || 1,
                        r[4] || 0,
                        r[5] || 0,
                        r[6] || 0,
                        r[7] || 0
                      );
              }
              return new Date(n);
            })(t)),
              this.init();
          }),
          (d.init = function () {
            var t = this.$d;
            (this.$y = t.getFullYear()),
              (this.$M = t.getMonth()),
              (this.$D = t.getDate()),
              (this.$W = t.getDay()),
              (this.$H = t.getHours()),
              (this.$m = t.getMinutes()),
              (this.$s = t.getSeconds()),
              (this.$ms = t.getMilliseconds());
          }),
          (d.$utils = function () {
            return D;
          }),
          (d.isValid = function () {
            return !('Invalid Date' === this.$d.toString());
          }),
          (d.isSame = function (t, n) {
            var e = g(t);
            return this.startOf(n) <= e && e <= this.endOf(n);
          }),
          (d.isAfter = function (t, n) {
            return g(t) < this.startOf(n);
          }),
          (d.isBefore = function (t, n) {
            return this.endOf(n) < g(t);
          }),
          (d.$g = function (t, n, e) {
            return D.u(t) ? this[n] : this.set(e, t);
          }),
          (d.year = function (t) {
            return this.$g(t, '$y', o);
          }),
          (d.month = function (t) {
            return this.$g(t, '$M', u);
          }),
          (d.day = function (t) {
            return this.$g(t, '$W', i);
          }),
          (d.date = function (t) {
            return this.$g(t, '$D', 'date');
          }),
          (d.hour = function (t) {
            return this.$g(t, '$H', r);
          }),
          (d.minute = function (t) {
            return this.$g(t, '$m', e);
          }),
          (d.second = function (t) {
            return this.$g(t, '$s', n);
          }),
          (d.millisecond = function (n) {
            return this.$g(n, '$ms', t);
          }),
          (d.unix = function () {
            return Math.floor(this.valueOf() / 1e3);
          }),
          (d.valueOf = function () {
            return this.$d.getTime();
          }),
          (d.startOf = function (t, a) {
            var h = this,
              f = !!D.u(a) || a,
              c = D.p(t),
              d = function (t, n) {
                var e = D.w(h.$u ? Date.UTC(h.$y, n, t) : new Date(h.$y, n, t), h);
                return f ? e : e.endOf(i);
              },
              $ = function (t, n) {
                return D.w(
                  h.toDate()[t].apply(h.toDate(), (f ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(n)),
                  h
                );
              },
              l = this.$W,
              m = this.$M,
              y = this.$D,
              M = 'set' + (this.$u ? 'UTC' : '');
            switch (c) {
              case o:
                return f ? d(1, 0) : d(31, 11);
              case u:
                return f ? d(1, m) : d(0, m + 1);
              case s:
                var g = this.$locale().weekStart || 0,
                  v = (l < g ? l + 7 : l) - g;
                return d(f ? y - v : y + (6 - v), m);
              case i:
              case 'date':
                return $(M + 'Hours', 0);
              case r:
                return $(M + 'Minutes', 1);
              case e:
                return $(M + 'Seconds', 2);
              case n:
                return $(M + 'Milliseconds', 3);
              default:
                return this.clone();
            }
          }),
          (d.endOf = function (t) {
            return this.startOf(t, !1);
          }),
          (d.$set = function (s, a) {
            var h,
              f = D.p(s),
              c = 'set' + (this.$u ? 'UTC' : ''),
              d = ((h = {}),
              (h[i] = c + 'Date'),
              (h.date = c + 'Date'),
              (h[u] = c + 'Month'),
              (h[o] = c + 'FullYear'),
              (h[r] = c + 'Hours'),
              (h[e] = c + 'Minutes'),
              (h[n] = c + 'Seconds'),
              (h[t] = c + 'Milliseconds'),
              h)[f],
              $ = f === i ? this.$D + (a - this.$W) : a;
            if (f === u || f === o) {
              var l = this.clone().set('date', 1);
              l.$d[d]($),
                l.init(),
                (this.$d = l.set('date', Math.min(this.$D, l.daysInMonth())).toDate());
            } else d && this.$d[d]($);
            return this.init(), this;
          }),
          (d.set = function (t, n) {
            return this.clone().$set(t, n);
          }),
          (d.get = function (t) {
            return this[D.p(t)]();
          }),
          (d.add = function (t, a) {
            var h,
              f = this;
            t = Number(t);
            var c = D.p(a),
              d = function (n) {
                var e = g(f);
                return D.w(e.date(e.date() + Math.round(n * t)), f);
              };
            if (c === u) return this.set(u, this.$M + t);
            if (c === o) return this.set(o, this.$y + t);
            if (c === i) return d(1);
            if (c === s) return d(7);
            var $ = ((h = {}), (h[e] = 6e4), (h[r] = 36e5), (h[n] = 1e3), h)[c] || 1,
              l = this.valueOf() + t * $;
            return D.w(l, this);
          }),
          (d.subtract = function (t, n) {
            return this.add(-1 * t, n);
          }),
          (d.format = function (t) {
            var n = this;
            if (!this.isValid()) return 'Invalid Date';
            var e = t || 'YYYY-MM-DDTHH:mm:ssZ',
              r = D.z(this),
              i = this.$locale(),
              s = this.$H,
              u = this.$m,
              a = this.$M,
              o = i.weekdays,
              h = i.months,
              c = function (t, r, i, s) {
                return (t && (t[r] || t(n, e))) || i[r].substr(0, s);
              },
              d = function (t) {
                return D.s(s % 12 || 12, t, '0');
              },
              $ =
                i.meridiem ||
                function (t, n, e) {
                  var r = t < 12 ? 'AM' : 'PM';
                  return e ? r.toLowerCase() : r;
                },
              l = {
                YY: String(this.$y).slice(-2),
                YYYY: this.$y,
                M: a + 1,
                MM: D.s(a + 1, 2, '0'),
                MMM: c(i.monthsShort, a, h, 3),
                MMMM: h[a] || h(this, e),
                D: this.$D,
                DD: D.s(this.$D, 2, '0'),
                d: String(this.$W),
                dd: c(i.weekdaysMin, this.$W, o, 2),
                ddd: c(i.weekdaysShort, this.$W, o, 3),
                dddd: o[this.$W],
                H: String(s),
                HH: D.s(s, 2, '0'),
                h: d(1),
                hh: d(2),
                a: $(s, u, !0),
                A: $(s, u, !1),
                m: String(u),
                mm: D.s(u, 2, '0'),
                s: String(this.$s),
                ss: D.s(this.$s, 2, '0'),
                SSS: D.s(this.$ms, 3, '0'),
                Z: r,
              };
            return e.replace(f, function (t, n) {
              return n || l[t] || r.replace(':', '');
            });
          }),
          (d.utcOffset = function () {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }),
          (d.diff = function (t, h, f) {
            var c,
              d = D.p(h),
              $ = g(t),
              l = 6e4 * ($.utcOffset() - this.utcOffset()),
              m = this - $,
              y = D.m(this, $);
            return (
              (y =
                ((c = {}),
                (c[o] = y / 12),
                (c[u] = y),
                (c[a] = y / 3),
                (c[s] = (m - l) / 6048e5),
                (c[i] = (m - l) / 864e5),
                (c[r] = m / 36e5),
                (c[e] = m / 6e4),
                (c[n] = m / 1e3),
                c)[d] || m),
              f ? y : D.a(y)
            );
          }),
          (d.daysInMonth = function () {
            return this.endOf(u).$D;
          }),
          (d.$locale = function () {
            return m[this.$L];
          }),
          (d.locale = function (t, n) {
            if (!t) return this.$L;
            var e = this.clone();
            return (e.$L = M(t, n, !0)), e;
          }),
          (d.clone = function () {
            return D.w(this.toDate(), this);
          }),
          (d.toDate = function () {
            return new Date(this.$d);
          }),
          (d.toJSON = function () {
            return this.isValid() ? this.toISOString() : null;
          }),
          (d.toISOString = function () {
            return this.$d.toISOString();
          }),
          (d.toString = function () {
            return this.$d.toUTCString();
          }),
          c
        );
      })();
      return (
        (g.prototype = v.prototype),
        (g.extend = function (t, n) {
          return t(n, v, g), g;
        }),
        (g.locale = M),
        (g.isDayjs = y),
        (g.unix = function (t) {
          return g(1e3 * t);
        }),
        (g.en = m[l]),
        (g.Ls = m),
        g
      );
    })();
  },
  function (module, exports) {
    module.exports = Vue;
  },
  function (module, exports, __webpack_require__) {
    var content = __webpack_require__(6);
    'string' == typeof content && (content = [[module.i, content, '']]),
      content.locals && (module.exports = content.locals);
    (0, __webpack_require__(9).default)('c3e5085c', content, !1, {});
  },
  function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    (function (global) {
      var MapShim = (function () {
          if ('undefined' != typeof Map) return Map;
          function getIndex(arr, key) {
            var result = -1;
            return (
              arr.some(function (entry, index) {
                return entry[0] === key && ((result = index), !0);
              }),
              result
            );
          }
          return (function () {
            function class_1() {
              this.__entries__ = [];
            }
            return (
              Object.defineProperty(class_1.prototype, 'size', {
                get: function () {
                  return this.__entries__.length;
                },
                enumerable: !0,
                configurable: !0,
              }),
              (class_1.prototype.get = function (key) {
                var index = getIndex(this.__entries__, key),
                  entry = this.__entries__[index];
                return entry && entry[1];
              }),
              (class_1.prototype.set = function (key, value) {
                var index = getIndex(this.__entries__, key);
                ~index ? (this.__entries__[index][1] = value) : this.__entries__.push([key, value]);
              }),
              (class_1.prototype.delete = function (key) {
                var entries = this.__entries__,
                  index = getIndex(entries, key);
                ~index && entries.splice(index, 1);
              }),
              (class_1.prototype.has = function (key) {
                return !!~getIndex(this.__entries__, key);
              }),
              (class_1.prototype.clear = function () {
                this.__entries__.splice(0);
              }),
              (class_1.prototype.forEach = function (callback, ctx) {
                void 0 === ctx && (ctx = null);
                for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                  var entry = _a[_i];
                  callback.call(ctx, entry[1], entry[0]);
                }
              }),
              class_1
            );
          })();
        })(),
        isBrowser =
          'undefined' != typeof window &&
          'undefined' != typeof document &&
          window.document === document,
        global$1 =
          void 0 !== global && global.Math === Math
            ? global
            : 'undefined' != typeof self && self.Math === Math
            ? self
            : 'undefined' != typeof window && window.Math === Math
            ? window
            : Function('return this')(),
        requestAnimationFrame$1 =
          'function' == typeof requestAnimationFrame
            ? requestAnimationFrame.bind(global$1)
            : function (callback) {
                return setTimeout(function () {
                  return callback(Date.now());
                }, 1e3 / 60);
              },
        trailingTimeout = 2;
      var REFRESH_DELAY = 20,
        transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'],
        mutationObserverSupported = 'undefined' != typeof MutationObserver,
        ResizeObserverController = (function () {
          function ResizeObserverController() {
            (this.connected_ = !1),
              (this.mutationEventsAdded_ = !1),
              (this.mutationsObserver_ = null),
              (this.observers_ = []),
              (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
              (this.refresh = (function (callback, delay) {
                var leadingCall = !1,
                  trailingCall = !1,
                  lastCallTime = 0;
                function resolvePending() {
                  leadingCall && ((leadingCall = !1), callback()), trailingCall && proxy();
                }
                function timeoutCallback() {
                  requestAnimationFrame$1(resolvePending);
                }
                function proxy() {
                  var timeStamp = Date.now();
                  if (leadingCall) {
                    if (timeStamp - lastCallTime < trailingTimeout) return;
                    trailingCall = !0;
                  } else
                    (leadingCall = !0), (trailingCall = !1), setTimeout(timeoutCallback, delay);
                  lastCallTime = timeStamp;
                }
                return proxy;
              })(this.refresh.bind(this), REFRESH_DELAY));
          }
          return (
            (ResizeObserverController.prototype.addObserver = function (observer) {
              ~this.observers_.indexOf(observer) || this.observers_.push(observer),
                this.connected_ || this.connect_();
            }),
            (ResizeObserverController.prototype.removeObserver = function (observer) {
              var observers = this.observers_,
                index = observers.indexOf(observer);
              ~index && observers.splice(index, 1),
                !observers.length && this.connected_ && this.disconnect_();
            }),
            (ResizeObserverController.prototype.refresh = function () {
              this.updateObservers_() && this.refresh();
            }),
            (ResizeObserverController.prototype.updateObservers_ = function () {
              var activeObservers = this.observers_.filter(function (observer) {
                return observer.gatherActive(), observer.hasActive();
              });
              return (
                activeObservers.forEach(function (observer) {
                  return observer.broadcastActive();
                }),
                activeObservers.length > 0
              );
            }),
            (ResizeObserverController.prototype.connect_ = function () {
              isBrowser &&
                !this.connected_ &&
                (document.addEventListener('transitionend', this.onTransitionEnd_),
                window.addEventListener('resize', this.refresh),
                mutationObserverSupported
                  ? ((this.mutationsObserver_ = new MutationObserver(this.refresh)),
                    this.mutationsObserver_.observe(document, {
                      attributes: !0,
                      childList: !0,
                      characterData: !0,
                      subtree: !0,
                    }))
                  : (document.addEventListener('DOMSubtreeModified', this.refresh),
                    (this.mutationEventsAdded_ = !0)),
                (this.connected_ = !0));
            }),
            (ResizeObserverController.prototype.disconnect_ = function () {
              isBrowser &&
                this.connected_ &&
                (document.removeEventListener('transitionend', this.onTransitionEnd_),
                window.removeEventListener('resize', this.refresh),
                this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
                this.mutationEventsAdded_ &&
                  document.removeEventListener('DOMSubtreeModified', this.refresh),
                (this.mutationsObserver_ = null),
                (this.mutationEventsAdded_ = !1),
                (this.connected_ = !1));
            }),
            (ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
              var _b = _a.propertyName,
                propertyName = void 0 === _b ? '' : _b;
              transitionKeys.some(function (key) {
                return !!~propertyName.indexOf(key);
              }) && this.refresh();
            }),
            (ResizeObserverController.getInstance = function () {
              return (
                this.instance_ || (this.instance_ = new ResizeObserverController()), this.instance_
              );
            }),
            (ResizeObserverController.instance_ = null),
            ResizeObserverController
          );
        })(),
        defineConfigurable = function (target, props) {
          for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var key = _a[_i];
            Object.defineProperty(target, key, {
              value: props[key],
              enumerable: !1,
              writable: !1,
              configurable: !0,
            });
          }
          return target;
        },
        getWindowOf = function (target) {
          return (target && target.ownerDocument && target.ownerDocument.defaultView) || global$1;
        },
        emptyRect = createRectInit(0, 0, 0, 0);
      function toFloat(value) {
        return parseFloat(value) || 0;
      }
      function getBordersSize(styles) {
        for (var positions = [], _i = 1; _i < arguments.length; _i++)
          positions[_i - 1] = arguments[_i];
        return positions.reduce(function (size, position) {
          return size + toFloat(styles['border-' + position + '-width']);
        }, 0);
      }
      function getHTMLElementContentRect(target) {
        var clientWidth = target.clientWidth,
          clientHeight = target.clientHeight;
        if (!clientWidth && !clientHeight) return emptyRect;
        var styles = getWindowOf(target).getComputedStyle(target),
          paddings = (function (styles) {
            for (
              var paddings = {}, _i = 0, positions_1 = ['top', 'right', 'bottom', 'left'];
              _i < positions_1.length;
              _i++
            ) {
              var position = positions_1[_i],
                value = styles['padding-' + position];
              paddings[position] = toFloat(value);
            }
            return paddings;
          })(styles),
          horizPad = paddings.left + paddings.right,
          vertPad = paddings.top + paddings.bottom,
          width = toFloat(styles.width),
          height = toFloat(styles.height);
        if (
          ('border-box' === styles.boxSizing &&
            (Math.round(width + horizPad) !== clientWidth &&
              (width -= getBordersSize(styles, 'left', 'right') + horizPad),
            Math.round(height + vertPad) !== clientHeight &&
              (height -= getBordersSize(styles, 'top', 'bottom') + vertPad)),
          !(function (target) {
            return target === getWindowOf(target).document.documentElement;
          })(target))
        ) {
          var vertScrollbar = Math.round(width + horizPad) - clientWidth,
            horizScrollbar = Math.round(height + vertPad) - clientHeight;
          1 !== Math.abs(vertScrollbar) && (width -= vertScrollbar),
            1 !== Math.abs(horizScrollbar) && (height -= horizScrollbar);
        }
        return createRectInit(paddings.left, paddings.top, width, height);
      }
      var isSVGGraphicsElement =
        'undefined' != typeof SVGGraphicsElement
          ? function (target) {
              return target instanceof getWindowOf(target).SVGGraphicsElement;
            }
          : function (target) {
              return (
                target instanceof getWindowOf(target).SVGElement &&
                'function' == typeof target.getBBox
              );
            };
      function getContentRect(target) {
        return isBrowser
          ? isSVGGraphicsElement(target)
            ? (function (target) {
                var bbox = target.getBBox();
                return createRectInit(0, 0, bbox.width, bbox.height);
              })(target)
            : getHTMLElementContentRect(target)
          : emptyRect;
      }
      function createRectInit(x, y, width, height) {
        return { x: x, y: y, width: width, height: height };
      }
      var ResizeObservation = (function () {
          function ResizeObservation(target) {
            (this.broadcastWidth = 0),
              (this.broadcastHeight = 0),
              (this.contentRect_ = createRectInit(0, 0, 0, 0)),
              (this.target = target);
          }
          return (
            (ResizeObservation.prototype.isActive = function () {
              var rect = getContentRect(this.target);
              return (
                (this.contentRect_ = rect),
                rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight
              );
            }),
            (ResizeObservation.prototype.broadcastRect = function () {
              var rect = this.contentRect_;
              return (this.broadcastWidth = rect.width), (this.broadcastHeight = rect.height), rect;
            }),
            ResizeObservation
          );
        })(),
        ResizeObserverEntry = function (target, rectInit) {
          var _a,
            x,
            y,
            width,
            height,
            Constr,
            rect,
            contentRect =
              ((x = (_a = rectInit).x),
              (y = _a.y),
              (width = _a.width),
              (height = _a.height),
              (Constr = 'undefined' != typeof DOMRectReadOnly ? DOMRectReadOnly : Object),
              (rect = Object.create(Constr.prototype)),
              defineConfigurable(rect, {
                x: x,
                y: y,
                width: width,
                height: height,
                top: y,
                right: x + width,
                bottom: height + y,
                left: x,
              }),
              rect);
          defineConfigurable(this, { target: target, contentRect: contentRect });
        },
        ResizeObserverSPI = (function () {
          function ResizeObserverSPI(callback, controller, callbackCtx) {
            if (
              ((this.activeObservations_ = []),
              (this.observations_ = new MapShim()),
              'function' != typeof callback)
            )
              throw new TypeError('The callback provided as parameter 1 is not a function.');
            (this.callback_ = callback),
              (this.controller_ = controller),
              (this.callbackCtx_ = callbackCtx);
          }
          return (
            (ResizeObserverSPI.prototype.observe = function (target) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.');
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(target instanceof getWindowOf(target).Element))
                  throw new TypeError('parameter 1 is not of type "Element".');
                var observations = this.observations_;
                observations.has(target) ||
                  (observations.set(target, new ResizeObservation(target)),
                  this.controller_.addObserver(this),
                  this.controller_.refresh());
              }
            }),
            (ResizeObserverSPI.prototype.unobserve = function (target) {
              if (!arguments.length)
                throw new TypeError('1 argument required, but only 0 present.');
              if ('undefined' != typeof Element && Element instanceof Object) {
                if (!(target instanceof getWindowOf(target).Element))
                  throw new TypeError('parameter 1 is not of type "Element".');
                var observations = this.observations_;
                observations.has(target) &&
                  (observations.delete(target),
                  observations.size || this.controller_.removeObserver(this));
              }
            }),
            (ResizeObserverSPI.prototype.disconnect = function () {
              this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
            }),
            (ResizeObserverSPI.prototype.gatherActive = function () {
              var _this = this;
              this.clearActive(),
                this.observations_.forEach(function (observation) {
                  observation.isActive() && _this.activeObservations_.push(observation);
                });
            }),
            (ResizeObserverSPI.prototype.broadcastActive = function () {
              if (this.hasActive()) {
                var ctx = this.callbackCtx_,
                  entries = this.activeObservations_.map(function (observation) {
                    return new ResizeObserverEntry(observation.target, observation.broadcastRect());
                  });
                this.callback_.call(ctx, entries, ctx), this.clearActive();
              }
            }),
            (ResizeObserverSPI.prototype.clearActive = function () {
              this.activeObservations_.splice(0);
            }),
            (ResizeObserverSPI.prototype.hasActive = function () {
              return this.activeObservations_.length > 0;
            }),
            ResizeObserverSPI
          );
        })(),
        observers = 'undefined' != typeof WeakMap ? new WeakMap() : new MapShim(),
        ResizeObserver = function ResizeObserver(callback) {
          if (!(this instanceof ResizeObserver))
            throw new TypeError('Cannot call a class as a function.');
          if (!arguments.length) throw new TypeError('1 argument required, but only 0 present.');
          var controller = ResizeObserverController.getInstance(),
            observer = new ResizeObserverSPI(callback, controller, this);
          observers.set(this, observer);
        };
      ['observe', 'unobserve', 'disconnect'].forEach(function (method) {
        ResizeObserver.prototype[method] = function () {
          var _a;
          return (_a = observers.get(this))[method].apply(_a, arguments);
        };
      });
      var index = void 0 !== global$1.ResizeObserver ? global$1.ResizeObserver : ResizeObserver;
      __webpack_exports__.a = index;
    }.call(this, __webpack_require__(4)));
  },
  function (module, exports) {
    var g;
    g = (function () {
      return this;
    })();
    try {
      g = g || new Function('return this')();
    } catch (e) {
      'object' == typeof window && (g = window);
    }
    module.exports = g;
  },
  function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_GanttElastic_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      2
    );
    __webpack_require__.n(
      _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_GanttElastic_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__
    ).a;
  },
  function (module, exports, __webpack_require__) {
    (module.exports = __webpack_require__(7)(!1)).push([
      module.i,
      "\n[class^='gantt-elastic'],\n[class*=' gantt-elastic'] {\n  box-sizing: border-box;\n}\n.gantt-elastic__main-view svg {\n  display: block;\n}\n.gantt-elastic__grid-horizontal-line,\n.gantt-elastic__grid-vertical-line {\n  stroke: #a0a0a0;\n  stroke-width: 1;\n}\nforeignObject > * {\n  margin: 0px;\n}\n.gantt-elastic .p-2 {\n  padding: 10rem;\n}\n.gantt-elastic__main-view-main-container,\n.gantt-elastic__main-view-container {\n  overflow: hidden;\n  max-width: 100%;\n}\n.gantt-elastic__task-list-header-column:last-of-type {\n  border-right: 1px solid #00000050;\n}\n.gantt-elastic__task-list-item:last-of-type {\n  border-bottom: 1px solid #00000050;\n}\n.gantt-elastic__task-list-item-value-wrapper:hover {\n  overflow: visible !important;\n}\n.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value-container {\n  position: relative;\n  overflow: visible !important;\n}\n.gantt-elastic__task-list-item-value-wrapper:hover > .gantt-elastic__task-list-item-value {\n  position: absolute;\n}\n",
      '',
    ]);
  },
  function (module, exports) {
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
            'number' == typeof id && (alreadyImportedModules[id] = !0);
          }
          for (i = 0; i < modules.length; i++) {
            var item = modules[i];
            ('number' == typeof item[0] && alreadyImportedModules[item[0]]) ||
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
  function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    __webpack_require__.r(__webpack_exports__);
    var external_Vue_ = __webpack_require__(1),
      external_Vue_default = __webpack_require__.n(external_Vue_),
      render = function () {
        var _h = this.$createElement,
          _c = this._self._c || _h;
        return _c(
          'div',
          { staticClass: 'gantt-elastic', staticStyle: { width: '100%' } },
          [
            this._t('header'),
            this._v(' '),
            _c('main-view', { ref: 'mainView' }),
            this._v(' '),
            this._t('footer'),
          ],
          2
        );
      };
    render._withStripped = !0;
    var dayjs_min = __webpack_require__(0),
      dayjs_min_default = __webpack_require__.n(dayjs_min),
      MainViewvue_type_template_id_0bc4212e_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'div',
          {
            staticClass: 'gantt-elastic__main-view',
            style: Object.assign({}, _vm.root.style['main-view']),
          },
          [
            _c(
              'div',
              {
                staticClass: 'gantt-elastic__main-container-wrapper',
                style: Object.assign({}, _vm.root.style['main-container-wrapper'], {
                  height: _vm.root.state.options.height + 'px',
                }),
              },
              [
                _c(
                  'div',
                  {
                    ref: 'mainView',
                    staticClass: 'gantt-elastic__main-container',
                    style: Object.assign({}, _vm.root.style['main-container'], {
                      width: _vm.root.state.options.clientWidth + 'px',
                      height: _vm.root.state.options.height + 'px',
                    }),
                  },
                  [
                    _c(
                      'div',
                      {
                        staticClass: 'gantt-elastic__container',
                        style: Object.assign({}, _vm.root.style.container),
                        on: { mousemove: _vm.mouseMove, mouseup: _vm.mouseUp },
                      },
                      [
                        _c(
                          'div',
                          {
                            directives: [
                              {
                                name: 'show',
                                rawName: 'v-show',
                                value: _vm.root.state.options.taskList.display,
                                expression: 'root.state.options.taskList.display',
                              },
                            ],
                            ref: 'taskList',
                            staticClass: 'gantt-elastic__task-list-container',
                            style: Object.assign({}, _vm.root.style['task-list-container'], {
                              width: _vm.root.state.options.taskList.finalWidth + 'px',
                              height: _vm.root.state.options.height + 'px',
                            }),
                          },
                          [_c('task-list')],
                          1
                        ),
                        _vm._v(' '),
                        _c(
                          'div',
                          {
                            ref: 'chartContainer',
                            staticClass: 'gantt-elastic__main-view-container',
                            style: Object.assign({}, _vm.root.style['main-view-container']),
                            on: {
                              mousedown: _vm.chartMouseDown,
                              touchstart: _vm.chartMouseDown,
                              mouseup: _vm.chartMouseUp,
                              touchend: _vm.chartMouseUp,
                              mousemove: function ($event) {
                                return $event.preventDefault(), _vm.chartMouseMove($event);
                              },
                              touchmove: function ($event) {
                                return $event.preventDefault(), _vm.chartMouseMove($event);
                              },
                              wheel: function ($event) {
                                return $event.preventDefault(), _vm.chartWheel($event);
                              },
                            },
                          },
                          [_c('chart')],
                          1
                        ),
                      ]
                    ),
                  ]
                ),
                _vm._v(' '),
                _c(
                  'div',
                  {
                    ref: 'chartScrollContainerVertical',
                    staticClass:
                      'gantt-elastic__chart-scroll-container gantt-elastic__chart-scroll-container--vertical',
                    style: Object.assign(
                      {},
                      _vm.root.style['chart-scroll-container'],
                      _vm.root.style['chart-scroll-container--vertical'],
                      _vm.verticalStyle
                    ),
                    on: { scroll: _vm.onVerticalScroll },
                  },
                  [
                    _c('div', {
                      staticClass: 'gantt-elastic__chart-scroll--vertical',
                      style: {
                        width: '1px',
                        height: _vm.root.state.options.allVisibleTasksHeight + 'px',
                      },
                    }),
                  ]
                ),
              ]
            ),
            _vm._v(' '),
            _c(
              'div',
              {
                ref: 'chartScrollContainerHorizontal',
                staticClass:
                  'gantt-elastic__chart-scroll-container gantt-elastic__chart-scroll-container--horizontal',
                style: Object.assign(
                  {},
                  _vm.root.style['chart-scroll-container'],
                  _vm.root.style['chart-scroll-container--horizontal'],
                  { marginLeft: _vm.getMarginLeft }
                ),
                on: { scroll: _vm.onHorizontalScroll },
              },
              [
                _c('div', {
                  staticClass: 'gantt-elastic__chart-scroll--horizontal',
                  style: { height: '1px', width: _vm.root.state.options.width + 'px' },
                }),
              ]
            ),
          ]
        );
      };
    MainViewvue_type_template_id_0bc4212e_render._withStripped = !0;
    var TaskListvue_type_template_id_6e11f12f_render = function () {
      var _vm = this,
        _h = _vm.$createElement,
        _c = _vm._self._c || _h;
      return _c(
        'div',
        {
          directives: [
            {
              name: 'show',
              rawName: 'v-show',
              value: _vm.root.state.options.taskList.display,
              expression: 'root.state.options.taskList.display',
            },
          ],
          ref: 'taskListWrapper',
          staticClass: 'gantt-elastic__task-list-wrapper',
          style: Object.assign({}, _vm.root.style['task-list-wrapper'], {
            width: '100%',
            height: '100%',
          }),
        },
        [
          _c(
            'div',
            {
              ref: 'taskList',
              staticClass: 'gantt-elastic__task-list',
              style: Object.assign({}, _vm.root.style['task-list']),
            },
            [
              _c('task-list-header'),
              _vm._v(' '),
              _c(
                'div',
                {
                  ref: 'taskListItems',
                  staticClass: 'gantt-elastic__task-list-items',
                  style: Object.assign({}, _vm.root.style['task-list-items'], {
                    height: _vm.root.state.options.rowsHeight + 'px',
                  }),
                },
                _vm._l(_vm.root.visibleTasks, function (task) {
                  return _c('task-list-item', { key: task.id, attrs: { task: task } });
                }),
                1
              ),
            ],
            1
          ),
        ]
      );
    };
    TaskListvue_type_template_id_6e11f12f_render._withStripped = !0;
    var TaskListHeadervue_type_template_id_aefdd7c8_render = function () {
      var _vm = this,
        _h = _vm.$createElement,
        _c = _vm._self._c || _h;
      return _c(
        'div',
        {
          staticClass: 'gantt-elastic__task-list-header',
          style: Object.assign({}, _vm.root.style['task-list-header'], {
            height: _vm.root.state.options.calendar.height + 'px',
            'margin-bottom': _vm.root.state.options.calendar.gap + 'px',
          }),
        },
        _vm._l(_vm.root.getTaskListColumns, function (column) {
          return _c(
            'div',
            {
              key: column._id,
              staticClass: 'gantt-elastic__task-list-header-column',
              style: Object.assign(
                {},
                _vm.root.style['task-list-header-column'],
                column.style['task-list-header-column'],
                _vm.getStyle(column)
              ),
            },
            [
              column.expander
                ? _c('task-list-expander', {
                    attrs: {
                      tasks: _vm.collapsible,
                      options: _vm.root.state.options.taskList.expander,
                    },
                  })
                : _vm._e(),
              _vm._v(' '),
              _c(
                'div',
                {
                  staticClass: 'gantt-elastic__task-list-header-label',
                  style: Object.assign(
                    {},
                    _vm.root.style['task-list-header-label'],
                    column.style['task-list-header-label']
                  ),
                  attrs: { column: column },
                  on: { mouseup: _vm.resizerMouseUp },
                },
                [_vm._v('\n      ' + _vm._s(column.label) + '\n    ')]
              ),
              _vm._v(' '),
              _c(
                'div',
                {
                  staticClass: 'gantt-elastic__task-list-header-resizer-wrapper',
                  style: Object.assign(
                    {},
                    _vm.root.style['task-list-header-resizer-wrapper'],
                    column.style['task-list-header-resizer-wrapper']
                  ),
                  attrs: { column: column },
                  on: {
                    mousedown: function ($event) {
                      return _vm.resizerMouseDown($event, column);
                    },
                  },
                },
                [
                  _c(
                    'div',
                    {
                      staticClass: 'gantt-elastic__task-list-header-resizer',
                      style: Object.assign(
                        {},
                        _vm.root.style['task-list-header-resizer'],
                        column.style['task-list-header-resizer']
                      ),
                    },
                    [
                      _c('div', {
                        staticClass: 'gantt-elastic__task-list-header-resizer-dot',
                        style: Object.assign(
                          {},
                          _vm.root.style['task-list-header-resizer-dot'],
                          column.style['task-list-header-resizer-dot']
                        ),
                      }),
                      _vm._v(' '),
                      _c('div', {
                        staticClass: 'gantt-elastic__task-list-header-resizer-dot',
                        style: Object.assign(
                          {},
                          _vm.root.style['task-list-header-resizer-dot'],
                          column.style['task-list-header-resizer-dot']
                        ),
                      }),
                      _vm._v(' '),
                      _c('div', {
                        staticClass: 'gantt-elastic__task-list-header-resizer-dot',
                        style: Object.assign(
                          {},
                          _vm.root.style['task-list-header-resizer-dot'],
                          column.style['task-list-header-resizer-dot']
                        ),
                      }),
                    ]
                  ),
                ]
              ),
            ],
            1
          );
        }),
        0
      );
    };
    TaskListHeadervue_type_template_id_aefdd7c8_render._withStripped = !0;
    var Expandervue_type_template_id_09a21177_render = function () {
      var _vm = this,
        _h = _vm.$createElement,
        _c = _vm._self._c || _h;
      return _c(
        'div',
        {
          class: _vm.getClassPrefix() + '-wrapper',
          style: Object.assign({}, _vm.root.style[_vm.getClassPrefix(!1) + '-wrapper'], _vm.style),
        },
        [
          _vm.allChildren.length
            ? _c(
                'svg',
                {
                  class: _vm.getClassPrefix() + '-content',
                  style: Object.assign({}, _vm.root.style[_vm.getClassPrefix(!1) + '-content']),
                  attrs: { width: _vm.options.size, height: _vm.options.size },
                  on: { click: _vm.toggle },
                },
                [
                  _c('rect', {
                    class: _vm.getClassPrefix() + '-border',
                    style: Object.assign(
                      {},
                      _vm.root.style[_vm.getClassPrefix(!1) + '-border'],
                      _vm.borderStyle
                    ),
                    attrs: {
                      x: _vm.border,
                      y: _vm.border,
                      width: _vm.options.size - 2 * _vm.border,
                      height: _vm.options.size - 2 * _vm.border,
                      rx: '2',
                      ry: '2',
                    },
                  }),
                  _vm._v(' '),
                  _vm.allChildren.length
                    ? _c('line', {
                        class: _vm.getClassPrefix() + '-line',
                        style: Object.assign({}, _vm.root.style[_vm.getClassPrefix(!1) + '-line']),
                        attrs: {
                          x1: _vm.lineOffset,
                          y1: _vm.options.size / 2,
                          x2: _vm.options.size - _vm.lineOffset,
                          y2: _vm.options.size / 2,
                        },
                      })
                    : _vm._e(),
                  _vm._v(' '),
                  _vm.collapsed
                    ? _c('line', {
                        class: _vm.getClassPrefix() + '-line',
                        style: Object.assign({}, _vm.root.style[_vm.getClassPrefix(!1) + '-line']),
                        attrs: {
                          x1: _vm.options.size / 2,
                          y1: _vm.lineOffset,
                          x2: _vm.options.size / 2,
                          y2: _vm.options.size - _vm.lineOffset,
                        },
                      })
                    : _vm._e(),
                ]
              )
            : _vm._e(),
        ]
      );
    };
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
    Expandervue_type_template_id_09a21177_render._withStripped = !0;
    var component = normalizeComponent(
      {
        name: 'Expander',
        inject: ['root'],
        props: ['tasks', 'options', 'type'],
        data: () => ({ border: 0.5, borderStyle: { 'stroke-width': 0.5 }, lineOffset: 5 }),
        computed: {
          style() {
            if ('taskList' !== this.type) return {};
            const margin = this.root.state.options.taskList.expander.margin;
            return {
              'padding-left':
                this.tasks[0].parents.length * this.root.state.options.taskList.expander.padding +
                margin +
                'px',
              margin: 'auto 0',
            };
          },
          allChildren() {
            const children = [];
            return (
              this.tasks.forEach((task) => {
                task.allChildren.forEach((childId) => {
                  children.push(childId);
                });
              }),
              children
            );
          },
          collapsed() {
            if (0 === this.tasks.length) return !1;
            let collapsed = 0;
            for (let i = 0, len = this.tasks.length; i < len; i++)
              this.tasks[i].collapsed && collapsed++;
            return collapsed === this.tasks.length;
          },
        },
        methods: {
          getClassPrefix(full = !0) {
            return `${full ? 'gantt-elastic__' : ''}${this.options.type}-expander`;
          },
          toggle() {
            if (0 === this.tasks.length) return;
            const collapsed = !this.collapsed;
            this.tasks.forEach((task) => {
              task.collapsed = collapsed;
            });
          },
        },
      },
      Expandervue_type_template_id_09a21177_render,
      [],
      !1,
      null,
      null,
      null
    );
    component.options.__file = 'src/components/Expander.vue';
    var Expander = component.exports,
      TaskListHeader_component = normalizeComponent(
        {
          name: 'TaskListHeader',
          components: { TaskListExpander: Expander },
          inject: ['root'],
          data: () => ({ resizer: { moving: !1, x: 0 } }),
          computed: {
            collapsible() {
              return this.root.state.tasks.filter((task) => task.allChildren.length > 0);
            },
          },
          methods: {
            getStyle: (column) => ({ width: column.finalWidth + 'px' }),
            resizerMouseDown(event, column) {
              this.resizer.moving ||
                ((this.resizer.moving = column),
                (this.resizer.x = event.clientX),
                (this.resizer.initialWidth = column.width),
                this.root.$emit('taskList-column-width-change-start', this.resizer.moving));
            },
            resizerMouseMove(event) {
              if (this.resizer.moving) {
                const lastWidth = this.resizer.moving.width;
                (this.resizer.moving.width =
                  this.resizer.initialWidth + event.clientX - this.resizer.x),
                  this.resizer.moving.width < this.root.state.options.taskList.minWidth &&
                    (this.resizer.moving.width = this.root.state.options.taskList.minWidth),
                  lastWidth !== this.resizer.moving.width &&
                    this.root.$emit('taskList-column-width-change', this.resizer.moving);
              }
            },
            resizerMouseUp(event) {
              this.resizer.moving &&
                (this.root.$emit('taskList-column-width-change-stop', this.resizer.moving),
                (this.resizer.moving = !1));
            },
          },
          created() {
            (this.mouseUpListener = document.addEventListener(
              'mouseup',
              this.resizerMouseUp.bind(this)
            )),
              (this.mouseMoveListener = document.addEventListener(
                'mousemove',
                this.resizerMouseMove.bind(this)
              )),
              this.root.$on('main-view-mousemove', this.resizerMouseMove),
              this.root.$on('main-view-mouseup', this.resizerMouseUp);
          },
          beforeDestroy() {
            document.removeEventListener('mouseup', this.resizerMouseUp),
              document.removeEventListener('mousemove', this.resizerMouseMove);
          },
        },
        TaskListHeadervue_type_template_id_aefdd7c8_render,
        [],
        !1,
        null,
        null,
        null
      );
    TaskListHeader_component.options.__file = 'src/components/TaskList/TaskListHeader.vue';
    var TaskListHeader = TaskListHeader_component.exports,
      TaskListItemvue_type_template_id_9716293c_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'div',
          {
            staticClass: 'gantt-elastic__task-list-item',
            style: Object.assign({}, _vm.root.style['task-list-item']),
          },
          _vm._l(_vm.columns, function (column) {
            return _c(
              'item-column',
              { key: column._id, attrs: { column: column, task: _vm.task } },
              [
                column.expander
                  ? _c('task-list-expander', {
                      attrs: {
                        tasks: [_vm.task],
                        options: _vm.root.state.options.taskList.expander,
                        type: 'taskList',
                      },
                    })
                  : _vm._e(),
              ],
              1
            );
          }),
          1
        );
      };
    TaskListItemvue_type_template_id_9716293c_render._withStripped = !0;
    var ItemColumnvue_type_template_id_cb5a6c96_render = function () {
      var _vm = this,
        _h = _vm.$createElement,
        _c = _vm._self._c || _h;
      return _c(
        'div',
        { staticClass: 'gantt-elastic__task-list-item-column', style: _vm.itemColumnStyle },
        [
          _c(
            'div',
            { staticClass: 'gantt-elastic__task-list-item-value-wrapper', style: _vm.wrapperStyle },
            [
              _vm._t('default'),
              _vm._v(' '),
              _c(
                'div',
                {
                  staticClass: 'gantt-elastic__task-list-item-value-container',
                  style: _vm.containerStyle,
                },
                [
                  _vm.html
                    ? _c('div', {
                        staticClass: 'gantt-elastic__task-list-item-value',
                        style: _vm.valueStyle,
                        domProps: { innerHTML: _vm._s(_vm.value) },
                        on: {
                          click: function ($event) {
                            return _vm.emitEvent('click', $event);
                          },
                          mouseenter: function ($event) {
                            return _vm.emitEvent('mouseenter', $event);
                          },
                          mouseover: function ($event) {
                            return _vm.emitEvent('mouseover', $event);
                          },
                          mouseout: function ($event) {
                            return _vm.emitEvent('mouseout', $event);
                          },
                          mousemove: function ($event) {
                            return _vm.emitEvent('mousemove', $event);
                          },
                          mousedown: function ($event) {
                            return _vm.emitEvent('mousedown', $event);
                          },
                          mouseup: function ($event) {
                            return _vm.emitEvent('mouseup', $event);
                          },
                          mousewheel: function ($event) {
                            return _vm.emitEvent('mousewheel', $event);
                          },
                          touchstart: function ($event) {
                            return _vm.emitEvent('touchstart', $event);
                          },
                          touchmove: function ($event) {
                            return _vm.emitEvent('touchmove', $event);
                          },
                          touchend: function ($event) {
                            return _vm.emitEvent('touchend', $event);
                          },
                        },
                      })
                    : _c(
                        'div',
                        {
                          staticClass: 'gantt-elastic__task-list-item-value',
                          style: _vm.valueStyle,
                          on: {
                            click: function ($event) {
                              return _vm.emitEvent('click', $event);
                            },
                            mouseenter: function ($event) {
                              return _vm.emitEvent('mouseenter', $event);
                            },
                            mouseover: function ($event) {
                              return _vm.emitEvent('mouseover', $event);
                            },
                            mouseout: function ($event) {
                              return _vm.emitEvent('mouseout', $event);
                            },
                            mousemove: function ($event) {
                              return _vm.emitEvent('mousemove', $event);
                            },
                            mousedown: function ($event) {
                              return _vm.emitEvent('mousedown', $event);
                            },
                            mouseup: function ($event) {
                              return _vm.emitEvent('mouseup', $event);
                            },
                            mousewheel: function ($event) {
                              return _vm.emitEvent('mousewheel', $event);
                            },
                            touchstart: function ($event) {
                              return _vm.emitEvent('touchstart', $event);
                            },
                            touchmove: function ($event) {
                              return _vm.emitEvent('touchmove', $event);
                            },
                            touchend: function ($event) {
                              return _vm.emitEvent('touchend', $event);
                            },
                          },
                        },
                        [_vm._v('\n        ' + _vm._s(_vm.value) + '\n      ')]
                      ),
                ]
              ),
            ],
            2
          ),
        ]
      );
    };
    ItemColumnvue_type_template_id_cb5a6c96_render._withStripped = !0;
    var ItemColumn_component = normalizeComponent(
      {
        name: 'ItemColumn',
        inject: ['root'],
        props: ['column', 'task'],
        data: () => ({}),
        methods: {
          emitEvent(eventName, event) {
            void 0 !== this.column.events &&
              'function' == typeof this.column.events[eventName] &&
              this.column.events[eventName]({ event: event, data: this.task, column: this.column }),
              this.root.$emit(`taskList-${this.task.type}-${eventName}`, {
                event: event,
                data: this.task,
                column: this.column,
              });
          },
        },
        computed: {
          html() {
            return void 0 !== this.column.html && !0 === this.column.html;
          },
          value() {
            return 'function' == typeof this.column.value
              ? this.column.value(this.task)
              : this.task[this.column.value];
          },
          itemColumnStyle() {
            return {
              ...this.root.style['task-list-item-column'],
              ...this.column.style['task-list-item-column'],
              width: this.column.finalWidth + 'px',
              height: this.column.height + 'px',
            };
          },
          wrapperStyle() {
            return {
              ...this.root.style['task-list-item-value-wrapper'],
              ...this.column.style['task-list-item-value-wrapper'],
            };
          },
          containerStyle() {
            return {
              ...this.root.style['task-list-item-value-container'],
              ...this.column.style['task-list-item-value-container'],
            };
          },
          valueStyle() {
            return {
              ...this.root.style['task-list-item-value'],
              ...this.column.style['task-list-item-value'],
            };
          },
        },
      },
      ItemColumnvue_type_template_id_cb5a6c96_render,
      [],
      !1,
      null,
      null,
      null
    );
    ItemColumn_component.options.__file = 'src/components/TaskList/ItemColumn.vue';
    var TaskListItem_component = normalizeComponent(
      {
        name: 'TaskListItem',
        components: { TaskListExpander: Expander, ItemColumn: ItemColumn_component.exports },
        inject: ['root'],
        props: ['task'],
        data: () => ({}),
        computed: {
          columns() {
            return this.root.state.options.taskList.columns;
          },
        },
      },
      TaskListItemvue_type_template_id_9716293c_render,
      [],
      !1,
      null,
      null,
      null
    );
    TaskListItem_component.options.__file = 'src/components/TaskList/TaskListItem.vue';
    var TaskList_component = normalizeComponent(
      {
        name: 'TaskList',
        components: {
          TaskListHeader: TaskListHeader,
          TaskListItem: TaskListItem_component.exports,
        },
        inject: ['root'],
        data: () => ({}),
        mounted() {
          (this.root.state.refs.taskListWrapper = this.$refs.taskListWrapper),
            (this.root.state.refs.taskList = this.$refs.taskList),
            (this.root.state.refs.taskListItems = this.$refs.taskListItems);
        },
      },
      TaskListvue_type_template_id_6e11f12f_render,
      [],
      !1,
      null,
      null,
      null
    );
    TaskList_component.options.__file = 'src/components/TaskList/TaskList.vue';
    var TaskList = TaskList_component.exports,
      Chartvue_type_template_id_67c3f5cd_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'div',
          {
            ref: 'chart',
            staticClass: 'gantt-elastic__chart',
            style: Object.assign({}, _vm.root.style.chart),
          },
          [
            _c(
              'div',
              {
                ref: 'chartCalendarContainer',
                staticClass: 'gantt-elastic__chart-calendar-container',
                style: Object.assign({}, _vm.root.style['chart-calendar-container'], {
                  height: _vm.root.state.options.calendar.height + 'px',
                  'margin-bottom': _vm.root.state.options.calendar.gap + 'px',
                }),
              },
              [_c('calendar')],
              1
            ),
            _vm._v(' '),
            _c(
              'div',
              {
                ref: 'chartGraphContainer',
                staticClass: 'gantt-elastic__chart-graph-container',
                style: Object.assign({}, _vm.root.style['chart-graph-container'], {
                  height:
                    _vm.root.state.options.height - _vm.root.state.options.calendar.height + 'px',
                }),
              },
              [
                _c(
                  'div',
                  {
                    style: Object.assign({}, _vm.root.style['chart-area'], {
                      width: _vm.root.state.options.width + 'px',
                      height: _vm.root.state.options.rowsHeight + 'px',
                    }),
                  },
                  [
                    _c(
                      'div',
                      {
                        ref: 'chartGraph',
                        staticClass: 'gantt-elastic__chart-graph',
                        style: Object.assign({}, _vm.root.style['chart-graph'], { height: '100%' }),
                      },
                      [
                        _c(
                          'svg',
                          {
                            ref: 'chartGraphSvg',
                            staticClass: 'gantt-elastic__chart-graph-svg',
                            style: Object.assign({}, _vm.root.style['chart-graph-svg']),
                            attrs: {
                              x: '0',
                              y: '0',
                              width: _vm.root.state.options.width + 'px',
                              height: _vm.root.state.options.allVisibleTasksHeight + 'px',
                              xmlns: 'http://www.w3.org/2000/svg',
                            },
                          },
                          [
                            _c('days-highlight'),
                            _vm._v(' '),
                            _c('grid'),
                            _vm._v(' '),
                            _c('dependency-lines', { attrs: { tasks: _vm.root.visibleTasks } }),
                            _vm._v(' '),
                            _vm._l(_vm.root.visibleTasks, function (task) {
                              return _c(
                                'g',
                                {
                                  key: task.id,
                                  staticClass: 'gantt-elastic__chart-row-wrapper',
                                  style: Object.assign({}, _vm.root.style['chart-row-wrapper']),
                                  attrs: { task: task },
                                },
                                [_c(task.type, { tag: 'component', attrs: { task: task } })],
                                1
                              );
                            }),
                          ],
                          2
                        ),
                      ]
                    ),
                  ]
                ),
              ]
            ),
          ]
        );
      };
    Chartvue_type_template_id_67c3f5cd_render._withStripped = !0;
    var Gridvue_type_template_id_2bf979a7_render = function () {
      var _vm = this,
        _h = _vm.$createElement,
        _c = _vm._self._c || _h;
      return _c(
        'svg',
        {
          ref: 'chart',
          staticClass: 'gantt-elastic__grid-lines-wrapper',
          style: Object.assign({}, _vm.root.style['grid-lines-wrapper']),
          attrs: {
            x: '0',
            y: '0',
            width: _vm.root.state.options.width,
            height: _vm.root.state.options.allVisibleTasksHeight,
            xmlns: 'http://www.w3.org/2000/svg',
          },
        },
        [
          _c(
            'g',
            {
              staticClass: 'gantt-elastic__grid-lines',
              style: Object.assign({}, _vm.root.style['grid-lines']),
            },
            [
              _vm._l(_vm.horizontalLines, function (line) {
                return _c('line', {
                  key: line.key,
                  staticClass: 'gantt-elastic__grid-line-horizontal',
                  style: Object.assign({}, _vm.root.style['grid-line-horizontal']),
                  attrs: { x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 },
                });
              }),
              _vm._v(' '),
              _vm._l(_vm.verticalLines, function (line) {
                return _c('line', {
                  key: line.key,
                  staticClass: 'gantt-elastic__grid-line-vertical',
                  style: Object.assign({}, _vm.root.style['grid-line-vertical']),
                  attrs: { x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 },
                });
              }),
              _vm._v(' '),
              _c('line', {
                staticClass: 'gantt-elastic__grid-line-time',
                style: Object.assign({}, _vm.root.style['grid-line-time']),
                attrs: {
                  x1: _vm.timeLinePosition.x,
                  y1: _vm.timeLinePosition.y1,
                  x2: _vm.timeLinePosition.x,
                  y2: _vm.timeLinePosition.y2,
                },
              }),
            ],
            2
          ),
        ]
      );
    };
    Gridvue_type_template_id_2bf979a7_render._withStripped = !0;
    var Grid_component = normalizeComponent(
      {
        name: 'Grid',
        inject: ['root'],
        data: () => ({}),
        created() {
          this.root.$on('recenterPosition', this.recenterPosition);
        },
        mounted() {
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.root.scrollToTime(this.timeLinePosition.time);
            });
          });
        },
        methods: {
          recenterPosition() {
            this.root.scrollToTime(this.timeLinePosition.time);
          },
        },
        computed: {
          verticalLines() {
            let lines = [];
            const state = this.root.state;
            return (
              state.options.times.steps.forEach((step) => {
                this.root.isInsideViewPort(step.offset.px, 1) &&
                  lines.push({
                    key: step.time,
                    x1: step.offset.px,
                    y1: 0,
                    x2: step.offset.px,
                    y2:
                      state.tasks.length *
                        (state.options.row.height + 2 * state.options.chart.grid.horizontal.gap) +
                      this.root.style['grid-line-vertical']['stroke-width'],
                  });
              }),
              lines
            );
          },
          horizontalLines() {
            let lines = [];
            const state = this.root.state.options;
            for (let index = 0, len = this.root.visibleTasks.length; index <= len; index++) {
              const y =
                index * (state.row.height + 2 * state.chart.grid.horizontal.gap) +
                this.root.style['grid-line-vertical']['stroke-width'] / 2;
              lines.push({ key: 'hl' + index, x1: 0, y1: y, x2: '100%', y2: y });
            }
            return lines;
          },
          inViewPort() {
            return (line) => {
              const state = this.root.state.options;
              return line.x1 >= state.scroll.chart.left && line.x1 <= state.scroll.chart.right;
            };
          },
          timeLinePosition() {
            const d = new Date(),
              current = d.getTime(),
              currentOffset = this.root.timeToPixelOffsetX(current),
              timeLine = { x: 0, y1: 0, y2: '100%', dateTime: '', time: current };
            return (
              (timeLine.x = currentOffset), (timeLine.dateTime = d.toLocaleDateString()), timeLine
            );
          },
        },
      },
      Gridvue_type_template_id_2bf979a7_render,
      [],
      !1,
      null,
      null,
      null
    );
    Grid_component.options.__file = 'src/components/Chart/Grid.vue';
    var Grid = Grid_component.exports,
      DaysHighlightvue_type_template_id_1bfe64e8_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _vm.showWorkingDays
          ? _c(
              'g',
              {
                staticClass: 'gantt-elastic__chart-days-highlight-container',
                style: Object.assign({}, _vm.root.style['chart-days-highlight-container']),
              },
              _vm._l(_vm.workingDays, function (day) {
                return _c('rect', {
                  key: _vm.getKey(day),
                  staticClass: 'gantt-elastic__chart-days-highlight-rect',
                  style: Object.assign({}, _vm.root.style['chart-days-highlight-rect']),
                  attrs: { x: day.offset.px, y: '0', width: day.width.px, height: '100%' },
                });
              }),
              0
            )
          : _vm._e();
      };
    DaysHighlightvue_type_template_id_1bfe64e8_render._withStripped = !0;
    var DaysHighlight_component = normalizeComponent(
      {
        name: 'DaysHighlight',
        inject: ['root'],
        data: () => ({}),
        methods: { getKey: (day) => dayjs_min_default()(day.time).format('YYYY-MM-DD') },
        computed: {
          workingDays() {
            return this.root.state.options.times.steps.filter(
              (step) =>
                -1 ===
                this.root.state.options.calendar.workingDays.indexOf(
                  dayjs_min_default()(step.time).day()
                )
            );
          },
          showWorkingDays() {
            const calendar = this.root.state.options.calendar;
            return !(
              void 0 === calendar.workingDays ||
              !Array.isArray(calendar.workingDays) ||
              !calendar.workingDays.length
            );
          },
        },
      },
      DaysHighlightvue_type_template_id_1bfe64e8_render,
      [],
      !1,
      null,
      null,
      null
    );
    DaysHighlight_component.options.__file = 'src/components/Chart/DaysHighlight.vue';
    var DaysHighlight = DaysHighlight_component.exports,
      Calendarvue_type_template_id_dee108e2_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'div',
          {
            staticClass: 'gantt-elastic__calendar-wrapper',
            style: Object.assign({}, _vm.root.style['calendar-wrapper'], {
              width: _vm.root.state.options.width + 'px',
            }),
          },
          [
            _c(
              'div',
              {
                staticClass: 'gantt-elastic__calendar',
                style: Object.assign({}, _vm.root.style.calendar, {
                  width: _vm.root.state.options.width + 'px',
                }),
              },
              [
                _vm.root.state.options.calendar.month.display
                  ? _c('calendar-row', { attrs: { items: _vm.dates.months, which: 'month' } })
                  : _vm._e(),
                _vm._v(' '),
                _vm.root.state.options.calendar.day.display
                  ? _c('calendar-row', { attrs: { items: _vm.dates.days, which: 'day' } })
                  : _vm._e(),
                _vm._v(' '),
                _vm.root.state.options.calendar.hour.display
                  ? _c('calendar-row', { attrs: { items: _vm.dates.hours, which: 'hour' } })
                  : _vm._e(),
              ],
              1
            ),
          ]
        );
      };
    Calendarvue_type_template_id_dee108e2_render._withStripped = !0;
    var CalendarRowvue_type_template_id_0daf06fb_render = function () {
      var _vm = this,
        _h = _vm.$createElement,
        _c = _vm._self._c || _h;
      return _c(
        'div',
        {
          class: 'gantt-elastic__calendar-row gantt-elastic__calendar-row--' + _vm.which,
          style: _vm.rowStyle,
        },
        _vm._l(_vm.items, function (item, itemIndex) {
          return _c(
            'div',
            {
              key: item.key,
              class:
                'gantt-elastic__calendar-row-rect gantt-elastic__calendar-row-rect--' + _vm.which,
              style: _vm.rectStyle,
            },
            _vm._l(item.children, function (child, childIndex) {
              return _c(
                'div',
                {
                  key: child.key,
                  class:
                    'gantt-elastic__calendar-row-rect-child gantt-elastic__calendar-row-rect-child--' +
                    _vm.which,
                  style: _vm.rectChildStyle[itemIndex][childIndex],
                },
                [
                  _c(
                    'div',
                    {
                      class:
                        'gantt-elastic__calendar-row-text gantt-elastic__calendar-row-text--' +
                        _vm.which,
                      style: _vm.textStyle(child),
                    },
                    [_vm._v('\n        ' + _vm._s(child.label) + '\n      ')]
                  ),
                ]
              );
            }),
            0
          );
        }),
        0
      );
    };
    CalendarRowvue_type_template_id_0daf06fb_render._withStripped = !0;
    var CalendarRow_component = normalizeComponent(
      {
        name: 'CalendarRow',
        inject: ['root'],
        props: ['items', 'which'],
        data: () => ({}),
        methods: {
          getTextX(item) {
            let x = item.x + item.width / 2 - item.textWidth / 2;
            if ('month' === this.which && this.root.isInsideViewPort(item.x, item.width, 0)) {
              let scrollWidth =
                this.root.state.options.scroll.chart.right -
                this.root.state.options.scroll.chart.left;
              (x =
                this.root.state.options.scroll.chart.left +
                scrollWidth / 2 -
                item.textWidth / 2 +
                2) +
                item.textWidth +
                2 >
              item.x + item.width
                ? (x = item.x + item.width - item.textWidth - 2)
                : x < item.x && (x = item.x + 2);
            }
            return x - item.x;
          },
        },
        computed: {
          rowStyle() {
            return {
              ...this.root.style['calendar-row'],
              ...this.root.style['calendar-row--' + this.which],
            };
          },
          rectStyle() {
            return {
              ...this.root.style['calendar-row-rect'],
              ...this.root.style['calendar-row-rect--' + this.which],
            };
          },
          rectChildStyle() {
            const basicStyle = {
                ...this.root.style['calendar-row-rect-child'],
                ...this.root.style['calendar-row-rect-child--' + this.which],
              },
              style = [];
            for (let item of this.items) {
              const childrenStyle = [];
              for (let child of item.children)
                childrenStyle.push({
                  ...basicStyle,
                  width: child.width + 'px',
                  height: child.height + 'px',
                });
              style.push(childrenStyle);
            }
            return style;
          },
          textStyle() {
            const basicStyle = {
              ...this.root.style['calendar-row-text'],
              ...this.root.style['calendar-row-text--' + this.which],
            };
            return (child) => {
              const style = { ...basicStyle };
              return 'month' === this.which && (style.left = this.getTextX(child) + 'px'), style;
            };
          },
        },
      },
      CalendarRowvue_type_template_id_0daf06fb_render,
      [],
      !1,
      null,
      null,
      null
    );
    CalendarRow_component.options.__file = 'src/components/Calendar/CalendarRow.vue';
    var Calendar_component = normalizeComponent(
      {
        name: 'Calendar',
        components: { CalendarRow: CalendarRow_component.exports },
        inject: ['root'],
        data: () => ({}),
        methods: {
          howManyHoursFit(dayIndex) {
            let fullCellWidth = this.root.state.options.times.steps[dayIndex].width.px,
              formatNames = Object.keys(this.root.state.options.calendar.hour.format);
            for (let hours = 24; hours > 1; hours = Math.ceil(hours / 2))
              for (let formatName of formatNames)
                if (
                  (this.root.state.options.calendar.hour.maxWidths[formatName] + 3) * hours <=
                    fullCellWidth &&
                  hours > 1
                )
                  return { count: hours, type: formatName };
            return { count: 0, type: '' };
          },
          howManyDaysFit() {
            let fullWidth = this.root.state.options.width,
              formatNames = Object.keys(this.root.state.options.calendar.day.format);
            for (
              let days = this.root.state.options.times.steps.length;
              days > 1;
              days = Math.ceil(days / 2)
            )
              for (let formatName of formatNames)
                if (
                  (this.root.state.options.calendar.day.maxWidths[formatName] + 3) * days <=
                    fullWidth &&
                  days > 1
                )
                  return { count: days, type: formatName };
            return { count: 0, type: '' };
          },
          howManyMonthsFit() {
            let fullWidth = this.root.state.options.width,
              formatNames = Object.keys(this.root.state.options.calendar.month.format);
            dayjs_min_default()(this.root.state.options.times.firstTime).clone();
            this.root.state.options.times.lastTime;
            let monthsCount = this.root.monthsCount(
              this.root.state.options.times.firstTime,
              this.root.state.options.times.lastTime
            );
            if (1 === monthsCount)
              for (let formatName of formatNames)
                if (this.root.state.options.calendar.month.maxWidths[formatName] + 3 <= fullWidth)
                  return { count: 1, type: formatName };
            for (let months = monthsCount; months > 1; months = Math.ceil(months / 2))
              for (let formatName of formatNames)
                if (
                  (this.root.state.options.calendar.month.maxWidths[formatName] + 3) * months <=
                    fullWidth &&
                  months > 1
                )
                  return { count: months, type: formatName };
            return { count: 0, type: formatNames[0] };
          },
          generateHours() {
            let allHours = [];
            if (!this.root.state.options.calendar.hour.display) return allHours;
            const steps = this.root.state.options.times.steps;
            this.root.state.options.locale.name;
            for (let hourIndex = 0, len = steps.length; hourIndex < len; hourIndex++) {
              const hoursCount = this.howManyHoursFit(hourIndex);
              if (0 === hoursCount.count) continue;
              const hours = { key: hourIndex + 'step', children: [] },
                hourStep = 24 / hoursCount.count,
                hourWidthPx = steps[hourIndex].width.px / hoursCount.count;
              for (let i = 0, len = hoursCount.count; i < len; i++) {
                const hour = i * hourStep;
                let index = hourIndex;
                hourIndex > 0 && (index = hourIndex - 24 * Math.floor(hourIndex / 24));
                let textWidth = 0;
                void 0 !== this.root.state.options.calendar.hour.widths[index] &&
                  (textWidth = this.root.state.options.calendar.hour.widths[index][
                    hoursCount.type
                  ]);
                let x = steps[hourIndex].offset.px + hourWidthPx * i;
                hours.children.push({
                  index: hourIndex,
                  key: 'h' + i,
                  x: x,
                  y:
                    this.root.state.options.calendar.day.height +
                    this.root.state.options.calendar.month.height,
                  width: hourWidthPx,
                  textWidth: textWidth,
                  height: this.root.state.options.calendar.hour.height,
                  label: this.root.state.options.calendar.hour.formatted[hoursCount.type][hour],
                });
              }
              allHours.push(hours);
            }
            return allHours;
          },
          generateDays() {
            let days = [];
            if (!this.root.state.options.calendar.day.display) return days;
            const daysCount = this.howManyDaysFit();
            if (0 === daysCount.count) return days;
            const steps = this.root.state.options.times.steps,
              localeName = this.root.state.options.locale.name,
              dayStep = Math.ceil(steps.length / daysCount.count);
            for (let dayIndex = 0, len = steps.length; dayIndex < len; dayIndex += dayStep) {
              let dayWidthPx = 0;
              for (let currentStep = 0; currentStep < dayStep; currentStep++)
                void 0 !== steps[dayIndex + currentStep] &&
                  (dayWidthPx += steps[dayIndex + currentStep].width.px);
              const date = dayjs_min_default()(steps[dayIndex].time);
              let textWidth = 0;
              void 0 !== this.root.state.options.calendar.day.widths[dayIndex] &&
                (textWidth = this.root.state.options.calendar.day.widths[dayIndex][daysCount.type]);
              let x = steps[dayIndex].offset.px;
              days.push({
                index: dayIndex,
                key: steps[dayIndex].time + 'd',
                x: x,
                y: this.root.state.options.calendar.month.height,
                width: dayWidthPx,
                textWidth: textWidth,
                height: this.root.state.options.calendar.day.height,
                label: this.root.state.options.calendar.day.format[daysCount.type](
                  date.locale(localeName)
                ),
              });
            }
            return days.map((item) => ({ key: item.key, children: [item] }));
          },
          generateMonths() {
            let months = [];
            if (!this.root.state.options.calendar.month.display) return months;
            const monthsCount = this.howManyMonthsFit();
            if (0 === monthsCount.count) return months;
            this.root.state.options.times.steps;
            const localeName = this.root.state.options.locale.name;
            let formatNames = Object.keys(this.root.state.options.calendar.month.format),
              currentDate = dayjs_min_default()(this.root.state.options.times.firstTime);
            for (let monthIndex = 0; monthIndex < monthsCount.count; monthIndex++) {
              let monthWidth = 0,
                monthOffset = Number.MAX_SAFE_INTEGER,
                finalDate = dayjs_min_default()(currentDate).add(1, 'month').startOf('month');
              finalDate.valueOf() > this.root.state.options.times.lastTime &&
                (finalDate = dayjs_min_default()(this.root.state.options.times.lastTime));
              for (
                let step = 0, len = this.root.state.options.times.steps.length;
                step < len;
                step++
              ) {
                let currentStep = this.root.state.options.times.steps[step];
                currentStep.time >= currentDate.valueOf() &&
                  currentStep.time < finalDate.valueOf() &&
                  ((monthWidth += currentStep.width.px),
                  currentStep.offset.px < monthOffset && (monthOffset = currentStep.offset.px));
              }
              let choosenFormatName,
                label = '';
              for (let formatName of formatNames)
                this.root.state.options.calendar.month.maxWidths[formatName] + 2 <= monthWidth &&
                  ((label = this.root.state.options.calendar.month.format[formatName](
                    currentDate.locale(localeName)
                  )),
                  (choosenFormatName = formatName));
              let textWidth = 0;
              void 0 !== this.root.state.options.calendar.month.widths[monthIndex] &&
                (textWidth = this.root.state.options.calendar.month.widths[monthIndex][
                  choosenFormatName
                ]);
              let x = monthOffset;
              months.push({
                index: monthIndex,
                key: monthIndex + 'm',
                x: x,
                y: 0,
                width: monthWidth,
                textWidth: textWidth,
                choosenFormatName: choosenFormatName,
                height: this.root.state.options.calendar.month.height,
                label: label,
              }),
                (currentDate = currentDate.add(1, 'month').startOf('month')).valueOf() >
                  this.root.state.options.times.lastTime &&
                  (currentDate = dayjs_min_default()(this.root.state.options.times.lastTime));
            }
            return months.map((item) => ({ key: item.key, children: [item] }));
          },
          calculateCalendarDimensions({ hours: hours, days: days, months: months }) {
            let height = 0;
            this.root.state.options.calendar.hour.display &&
              hours.length > 0 &&
              (height += this.root.state.options.calendar.hour.height),
              this.root.state.options.calendar.day.display &&
                days.length > 0 &&
                (height += this.root.state.options.calendar.day.height),
              this.root.state.options.calendar.month.display &&
                months.length > 0 &&
                (height += this.root.state.options.calendar.month.height),
              (this.root.state.options.calendar.height = height);
          },
        },
        computed: {
          dates() {
            const allDates = {
              hours: this.generateHours(),
              days: this.generateDays(),
              months: this.generateMonths(),
            };
            return this.calculateCalendarDimensions(allDates), allDates;
          },
        },
      },
      Calendarvue_type_template_id_dee108e2_render,
      [],
      !1,
      null,
      null,
      null
    );
    Calendar_component.options.__file = 'src/components/Calendar/Calendar.vue';
    var Calendar = Calendar_component.exports,
      DependencyLinesvue_type_template_id_f1cbf6ba_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'svg',
          {
            staticClass: 'gantt-elastic__chart-dependency-lines-container',
            style: Object.assign({}, _vm.root.style['chart-dependency-lines-container']),
            attrs: { x: '0', y: '0', width: '100%', height: '100%' },
          },
          _vm._l(_vm.dependencyTasks, function (task) {
            return _c(
              'g',
              { key: task.id, attrs: { task: task } },
              _vm._l(task.dependencyLines, function (dependencyLine) {
                return _c('path', {
                  key: dependencyLine.id,
                  staticClass: 'gantt-elastic__chart-dependency-lines-path',
                  style: Object.assign(
                    {},
                    _vm.root.style['chart-dependency-lines-path'],
                    task.style['chart-dependency-lines-path']
                  ),
                  attrs: { task: task, d: dependencyLine.points },
                });
              }),
              0
            );
          }),
          0
        );
      };
    DependencyLinesvue_type_template_id_f1cbf6ba_render._withStripped = !0;
    var DependencyLines_component = normalizeComponent(
      {
        name: 'DependencyLines',
        inject: ['root'],
        props: ['tasks'],
        data: () => ({}),
        methods: {
          getPoints(fromTaskId, toTaskId) {
            const fromTask = this.root.getTask(fromTaskId),
              toTask = this.root.getTask(toTaskId);
            if (
              null === fromTask ||
              null === toTask ||
              !this.root.isTaskVisible(toTask) ||
              !this.root.isTaskVisible(fromTask)
            )
              return null;
            const startX = fromTask.x + fromTask.width,
              startY = fromTask.y + fromTask.height / 2,
              stopX = toTask.x,
              stopY = toTask.y + toTask.height / 2,
              distanceX = stopX - startX;
            let distanceY,
              yMultiplier = 1;
            stopY >= startY
              ? (distanceY = stopY - startY)
              : ((distanceY = startY - stopY), (yMultiplier = -1));
            let points = `M ${startX} ${startY}\n          L ${startX + 10},${startY} `;
            return (points +=
              distanceX <= 14
                ? `Q ${startX + 10 + 4},${startY} ${startX + 10 + 4},${
                    startY + 4 * yMultiplier
                  }\n            L ${startX + 10 + 4},${
                    startY + (distanceY * yMultiplier) / 2 - 4 * yMultiplier
                  }\n            Q ${startX + 10 + 4},${startY + (distanceY * yMultiplier) / 2} ${
                    startX + 10
                  },${startY + (distanceY * yMultiplier) / 2}\n            L ${
                    startX - 10 + distanceX
                  },${startY + (distanceY * yMultiplier) / 2}\n            Q ${
                    startX - 10 + distanceX - 4
                  },${startY + (distanceY * yMultiplier) / 2} ${startX - 10 + distanceX - 4},${
                    startY + (distanceY * yMultiplier) / 2 + 4 * yMultiplier
                  }\n            L ${startX - 10 + distanceX - 4},${
                    stopY - 4 * yMultiplier
                  }\n            Q ${startX - 10 + distanceX - 4},${stopY} ${
                    startX - 10 + distanceX
                  },${stopY}\n            L ${stopX},${stopY}`
                : `L ${startX + distanceX / 2 - 4},${startY}\n            Q ${
                    startX + distanceX / 2
                  },${startY} ${startX + distanceX / 2},${
                    startY + 4 * yMultiplier
                  }\n            L ${startX + distanceX / 2},${
                    stopY - 4 * yMultiplier
                  }\n            Q ${startX + distanceX / 2},${stopY} ${
                    startX + distanceX / 2 + 4
                  },${stopY}\n            L ${stopX},${stopY}`);
          },
        },
        computed: {
          dependencyTasks() {
            return this.tasks
              .filter((task) => void 0 !== task.dependentOn)
              .map(
                (task) => (
                  (task.dependencyLines = task.dependentOn.map((id) => ({
                    points: this.getPoints(id, task.id),
                  }))),
                  task
                )
              )
              .filter((task) => null !== task.dependencyLines.points);
          },
        },
      },
      DependencyLinesvue_type_template_id_f1cbf6ba_render,
      [],
      !1,
      null,
      null,
      null
    );
    DependencyLines_component.options.__file = 'src/components/Chart/DependencyLines.vue';
    var DependencyLines = DependencyLines_component.exports,
      Taskvue_type_template_id_e9c23eca_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'g',
          {
            staticClass:
              'gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-task-wrapper',
            style: Object.assign(
              {},
              _vm.root.style['chart-row-bar-wrapper'],
              _vm.root.style['chart-row-task-wrapper'],
              _vm.task.style['chart-row-bar-wrapper']
            ),
          },
          [
            _vm.displayExpander
              ? _c(
                  'foreignObject',
                  {
                    staticClass:
                      'gantt-elastic__chart-expander gantt-elastic__chart-expander--task',
                    style: Object.assign(
                      {},
                      _vm.root.style['chart-expander'],
                      _vm.root.style['chart-expander--task'],
                      _vm.task.style['chart-expander']
                    ),
                    attrs: {
                      x:
                        _vm.task.x -
                        _vm.root.state.options.chart.expander.offset -
                        _vm.root.state.options.chart.expander.size,
                      y:
                        _vm.task.y +
                        (_vm.root.state.options.row.height -
                          _vm.root.state.options.chart.expander.size) /
                          2,
                      width: _vm.root.state.options.chart.expander.size,
                      height: _vm.root.state.options.chart.expander.size,
                    },
                  },
                  [
                    _c('expander', {
                      attrs: {
                        tasks: [_vm.task],
                        options: _vm.root.state.options.chart.expander,
                        type: 'chart',
                      },
                    }),
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(' '),
            _c(
              'svg',
              {
                staticClass: 'gantt-elastic__chart-row-bar gantt-elastic__chart-row-task',
                style: Object.assign(
                  {},
                  _vm.root.style['chart-row-bar'],
                  _vm.root.style['chart-row-task'],
                  _vm.task.style['chart-row-bar']
                ),
                attrs: {
                  x: _vm.task.x,
                  y: _vm.task.y,
                  width: _vm.task.width,
                  height: _vm.task.height,
                  viewBox: '0 0 ' + _vm.task.width + ' ' + _vm.task.height,
                  xmlns: 'http://www.w3.org/2000/svg',
                },
                on: {
                  click: function ($event) {
                    return _vm.emitEvent('click', $event);
                  },
                  mouseenter: function ($event) {
                    return _vm.emitEvent('mouseenter', $event);
                  },
                  mouseover: function ($event) {
                    return _vm.emitEvent('mouseover', $event);
                  },
                  mouseout: function ($event) {
                    return _vm.emitEvent('mouseout', $event);
                  },
                  mousemove: function ($event) {
                    return _vm.emitEvent('mousemove', $event);
                  },
                  mousedown: function ($event) {
                    return _vm.emitEvent('mousedown', $event);
                  },
                  mouseup: function ($event) {
                    return _vm.emitEvent('mouseup', $event);
                  },
                  mousewheel: function ($event) {
                    return _vm.emitEvent('mousewheel', $event);
                  },
                  touchstart: function ($event) {
                    return _vm.emitEvent('touchstart', $event);
                  },
                  touchmove: function ($event) {
                    return _vm.emitEvent('touchmove', $event);
                  },
                  touchend: function ($event) {
                    return _vm.emitEvent('touchend', $event);
                  },
                },
              },
              [
                _c('defs', [
                  _c('clipPath', { attrs: { id: _vm.clipPathId } }, [
                    _c('polygon', { attrs: { points: _vm.getPoints } }),
                  ]),
                ]),
                _vm._v(' '),
                _c('polygon', {
                  staticClass:
                    'gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-task-polygon',
                  style: Object.assign(
                    {},
                    _vm.root.style['chart-row-bar-polygon'],
                    _vm.root.style['chart-row-task-polygon'],
                    _vm.task.style.base,
                    _vm.task.style['chart-row-bar-polygon']
                  ),
                  attrs: { points: _vm.getPoints },
                }),
                _vm._v(' '),
                _c('progress-bar', {
                  attrs: { task: _vm.task, 'clip-path': 'url(#' + _vm.clipPathId + ')' },
                }),
              ],
              1
            ),
            _vm._v(' '),
            _vm.root.state.options.chart.text.display
              ? _c('chart-text', { attrs: { task: _vm.task } })
              : _vm._e(),
          ],
          1
        );
      };
    Taskvue_type_template_id_e9c23eca_render._withStripped = !0;
    var Textvue_type_template_id_459c2fe4_render = function () {
      var _vm = this,
        _h = _vm.$createElement,
        _c = _vm._self._c || _h;
      return _c(
        'svg',
        {
          staticClass: 'gantt-elastic__chart-row-text-wrapper',
          style: Object.assign({}, _vm.root.style['chart-row-text-wrapper']),
          attrs: {
            x: _vm.task.x + _vm.task.width + _vm.root.state.options.chart.text.offset,
            y: _vm.task.y - _vm.root.state.options.chart.grid.horizontal.gap,
            width: _vm.getWidth,
            height: _vm.getHeight,
          },
        },
        [
          _c('foreignObject', { attrs: { x: '0', y: '0', width: '100%', height: _vm.getHeight } }, [
            _c(
              'div',
              {
                staticClass: 'gantt-elastic__chart-row-text',
                style: Object.assign({}, _vm.root.style['chart-row-text']),
                attrs: { xmlns: 'http://www.w3.org/1999/xhtml' },
              },
              [
                _vm.html
                  ? _vm._e()
                  : _c(
                      'div',
                      {
                        staticClass:
                          'gantt-elastic__chart-row-text-content gantt-elastic__chart-row-text-content--text',
                        style: Object.assign(
                          {},
                          _vm.root.style['chart-row-text-content'],
                          _vm.root.style['chart-row-text-content--text'],
                          _vm.contentStyle
                        ),
                      },
                      [_c('div', [_vm._v(_vm._s(_vm.task.label))])]
                    ),
                _vm._v(' '),
                _vm.html
                  ? _c('div', {
                      staticClass:
                        'gantt-elastic__chart-row-text-content gantt-elastic__chart-row-text-content--html',
                      style: Object.assign(
                        {},
                        _vm.root.style['chart-row-text-content'],
                        _vm.root.style['chart-row-text-content--html'],
                        _vm.contentStyle
                      ),
                      domProps: { innerHTML: _vm._s(_vm.task.label) },
                    })
                  : _vm._e(),
              ]
            ),
          ]),
        ],
        1
      );
    };
    Textvue_type_template_id_459c2fe4_render._withStripped = !0;
    var Text_component = normalizeComponent(
      {
        name: 'ChartText',
        inject: ['root'],
        props: ['task'],
        data: () => ({}),
        computed: {
          getWidth() {
            const textStyle = this.root.style['chart-row-text'];
            return (
              (this.root.state.ctx.font = `${textStyle['font-weight']} ${textStyle['font-size']} ${textStyle['font-family']}`),
              this.root.state.ctx.measureText(this.task.label).width +
                2 * this.root.state.options.chart.text.xPadding
            );
          },
          getHeight() {
            return this.task.height + 2 * this.root.state.options.chart.grid.horizontal.gap;
          },
          contentStyle() {
            return { height: '100%', 'line-height': this.getHeight + 'px' };
          },
          html() {
            const cols = this.root.state.options.taskList.columns;
            for (let i = 0, len = cols.length; i < len; i++) {
              const col = cols[i];
              if ('label' === col.value && void 0 !== col.html && col.html) return !0;
            }
            return !1;
          },
        },
      },
      Textvue_type_template_id_459c2fe4_render,
      [],
      !1,
      null,
      null,
      null
    );
    Text_component.options.__file = 'src/components/Chart/Text.vue';
    var Text = Text_component.exports,
      ProgressBarvue_type_template_id_4bc39355_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'g',
          {
            staticClass: 'gantt-elastic__chart-row-progress-bar-wrapper',
            style: Object.assign(
              {},
              _vm.root.style['chart-row-progress-bar-wrapper'],
              _vm.task.style['chart-row-progress-bar-wrapper']
            ),
          },
          [
            _c('defs', [
              _c(
                'pattern',
                {
                  attrs: {
                    id: 'diagonalHatch',
                    width: _vm.root.state.options.chart.progress.width,
                    height: _vm.root.state.options.chart.progress.width,
                    patternTransform: 'rotate(45 0 0)',
                    patternUnits: 'userSpaceOnUse',
                  },
                },
                [
                  _c('line', {
                    staticClass: 'chart-row-progress-bar-line',
                    style: Object.assign(
                      {},
                      _vm.root.style['chart-row-progress-bar-line'],
                      _vm.task.style['chart-row-progress-bar-line']
                    ),
                    attrs: {
                      x1: '0',
                      y1: '0',
                      x2: '0',
                      y2: _vm.root.state.options.chart.progress.width,
                    },
                  }),
                ]
              ),
            ]),
            _vm._v(' '),
            _vm.root.state.options.chart.progress.bar
              ? _c('rect', {
                  staticClass: 'gantt-elastic__chart-row-progress-bar-solid',
                  style: Object.assign(
                    {},
                    _vm.root.style['chart-row-progress-bar-solid'],
                    _vm.task.style['chart-row-progress-bar-solid']
                  ),
                  attrs: { x: '0', y: '0', width: _vm.getProgressWidth },
                })
              : _vm._e(),
            _vm._v(' '),
            _vm.root.state.options.chart.progress.pattern
              ? _c('g', [
                  _c('rect', {
                    staticClass: 'gantt-elastic__chart-row-progress-bar-pattern',
                    style: Object.assign(
                      {},
                      _vm.root.style['chart-row-progress-bar-pattern'],
                      _vm.task.style['chart-row-progress-bar-pattern']
                    ),
                    attrs: {
                      x: _vm.getProgressWidth,
                      y: '0',
                      width: 100 - _vm.task.progress + '%',
                      height: '100%',
                    },
                  }),
                  _vm._v(' '),
                  _c('path', {
                    staticClass: 'gantt-elastic__chart-row-progress-bar-outline',
                    style: Object.assign(
                      {},
                      _vm.root.style['chart-row-progress-bar-outline'],
                      _vm.task.style.base,
                      _vm.task.style['chart-row-progress-bar-outline']
                    ),
                    attrs: { d: _vm.getLinePoints },
                  }),
                ])
              : _vm._e(),
          ]
        );
      };
    ProgressBarvue_type_template_id_4bc39355_render._withStripped = !0;
    var ProgressBar_component = normalizeComponent(
      {
        name: 'ProgressBar',
        inject: ['root'],
        props: ['task'],
        data: () => ({}),
        computed: {
          getProgressWidth() {
            return this.task.progress + '%';
          },
          getLinePoints() {
            const start = (this.task.width / 100) * this.task.progress;
            return `M ${start} 0 L ${start} ${this.task.height}`;
          },
          getSolidStyle() {
            return Object.assign(
              {},
              this.root.state.options.chart.progress.styles.bar.solid,
              this.task.progressBarStyle.bar
            );
          },
          getLineStyle() {
            return Object.assign(
              {},
              {
                stroke: this.root.state.options.row.styles.bar.stroke + 'a0',
                'stroke-width': this.root.state.options.row.styles.bar['stroke-width'] / 2,
              },
              this.task.style
            );
          },
        },
      },
      ProgressBarvue_type_template_id_4bc39355_render,
      [],
      !1,
      null,
      null,
      null
    );
    ProgressBar_component.options.__file = 'src/components/Chart/ProgressBar.vue';
    var ProgressBar = ProgressBar_component.exports,
      Task_mixin = {
        computed: {
          getViewBox() {
            const task = this.task;
            return `0 0 ${task.width} ${task.height}`;
          },
          getGroupTransform() {
            return `translate(${this.task.x} ${this.task.y})`;
          },
          displayExpander() {
            const expander = this.root.state.options.chart.expander;
            return (
              expander.display ||
              (expander.displayIfTaskListHidden && !this.root.state.options.taskList.display)
            );
          },
        },
        methods: {
          emitEvent(eventName, event) {
            this.root.state.options.scroll.scrolling ||
              this.root.$emit(`chart-${this.task.type}-${eventName}`, {
                event: event,
                data: this.task,
              });
          },
        },
      },
      Task_component = normalizeComponent(
        {
          name: 'Task',
          components: { ChartText: Text, ProgressBar: ProgressBar, Expander: Expander },
          inject: ['root'],
          props: ['task'],
          mixins: [Task_mixin],
          data: () => ({}),
          computed: {
            clipPathId() {
              return 'gantt-elastic__task-clip-path-' + this.task.id;
            },
            getPoints() {
              const task = this.task;
              return `0,0 ${task.width},0 ${task.width},${task.height} 0,${task.height}`;
            },
          },
        },
        Taskvue_type_template_id_e9c23eca_render,
        [],
        !1,
        null,
        null,
        null
      );
    /**
     * @fileoverview Task mixin
     * @license MIT
     * @author Rafal Pospiech <neuronet.io@gmail.com>
     * @package GanttElastic
     */ Task_component.options.__file = 'src/components/Chart/Row/Task.vue';
    var Task = Task_component.exports,
      Milestonevue_type_template_id_3013006c_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'g',
          {
            staticClass:
              'gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-milestone-wrapper',
            style: Object.assign(
              {},
              _vm.root.style['chart-row-bar-wrapper'],
              _vm.root.style['chart-row-milestone-wrapper'],
              _vm.task.style['chart-row-bar-wrapper']
            ),
          },
          [
            _vm.displayExpander
              ? _c(
                  'foreignObject',
                  {
                    staticClass:
                      'gantt-elastic__chart-expander gantt-elastic__chart-expander--milestone',
                    style: Object.assign(
                      {},
                      _vm.root.style['chart-expander'],
                      _vm.root.style['chart-expander--milestone'],
                      _vm.task.style['chart-expander']
                    ),
                    attrs: {
                      x:
                        _vm.task.x -
                        _vm.root.state.options.chart.expander.offset -
                        _vm.root.state.options.chart.expander.size,
                      y:
                        _vm.task.y +
                        (_vm.root.state.options.row.height -
                          _vm.root.state.options.chart.expander.size) /
                          2,
                      width: _vm.root.state.options.chart.expander.size,
                      height: _vm.root.state.options.chart.expander.size,
                    },
                  },
                  [
                    _c('expander', {
                      attrs: {
                        tasks: [_vm.task],
                        options: _vm.root.state.options.chart.expander,
                        type: 'chart',
                      },
                    }),
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(' '),
            _c(
              'svg',
              {
                staticClass: 'gantt-elastic__chart-row-bar gantt-elastic__chart-row-milestone',
                style: Object.assign(
                  {},
                  _vm.root.style['chart-row-bar'],
                  _vm.root.style['chart-row-milestone'],
                  _vm.task.style['chart-row-bar']
                ),
                attrs: {
                  x: _vm.task.x,
                  y: _vm.task.y,
                  width: _vm.task.width,
                  height: _vm.task.height,
                  viewBox: '0 0 ' + _vm.task.width + ' ' + _vm.task.height,
                  xmlns: 'http://www.w3.org/2000/svg',
                },
                on: {
                  click: function ($event) {
                    return _vm.emitEvent('click', $event);
                  },
                  mouseenter: function ($event) {
                    return _vm.emitEvent('mouseenter', $event);
                  },
                  mouseover: function ($event) {
                    return _vm.emitEvent('mouseover', $event);
                  },
                  mouseout: function ($event) {
                    return _vm.emitEvent('mouseout', $event);
                  },
                  mousemove: function ($event) {
                    return _vm.emitEvent('mousemove', $event);
                  },
                  mousedown: function ($event) {
                    return _vm.emitEvent('mousedown', $event);
                  },
                  mouseup: function ($event) {
                    return _vm.emitEvent('mouseup', $event);
                  },
                  mousewheel: function ($event) {
                    return _vm.emitEvent('mousewheel', $event);
                  },
                  touchstart: function ($event) {
                    return _vm.emitEvent('touchstart', $event);
                  },
                  touchmove: function ($event) {
                    return _vm.emitEvent('touchmove', $event);
                  },
                  touchend: function ($event) {
                    return _vm.emitEvent('touchend', $event);
                  },
                },
              },
              [
                _c('defs', [
                  _c('clipPath', { attrs: { id: _vm.clipPathId } }, [
                    _c('polygon', { attrs: { points: _vm.getPoints } }),
                  ]),
                ]),
                _vm._v(' '),
                _c('polygon', {
                  staticClass:
                    'gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-milestone-polygon',
                  style: Object.assign(
                    {},
                    _vm.root.style['chart-row-bar-polygon'],
                    _vm.root.style['chart-row-milestone-polygon'],
                    _vm.task.style.base,
                    _vm.task.style['chart-row-bar-polygon']
                  ),
                  attrs: { points: _vm.getPoints },
                }),
                _vm._v(' '),
                _c('progress-bar', {
                  attrs: { task: _vm.task, 'clip-path': 'url(#' + _vm.clipPathId + ')' },
                }),
              ],
              1
            ),
            _vm._v(' '),
            _vm.root.state.options.chart.text.display
              ? _c('chart-text', { attrs: { task: _vm.task } })
              : _vm._e(),
          ],
          1
        );
      };
    Milestonevue_type_template_id_3013006c_render._withStripped = !0;
    var Milestone_component = normalizeComponent(
      {
        name: 'Milestone',
        components: { ChartText: Text, ProgressBar: ProgressBar, Expander: Expander },
        inject: ['root'],
        props: ['task'],
        mixins: [Task_mixin],
        data: () => ({}),
        computed: {
          clipPathId() {
            return 'gantt-elastic__milestone-clip-path-' + this.task.id;
          },
          getPoints() {
            const task = this.task,
              fifty = task.height / 2;
            let offset = fifty;
            return (
              task.width / 2 - offset < 0 && (offset = task.width / 2),
              `0,${fifty}\n        ${offset},0\n        ${task.width - offset},0\n        ${
                task.width
              },${fifty}\n        ${task.width - offset},${task.height}\n        ${offset},${
                task.height
              }`
            );
          },
        },
      },
      Milestonevue_type_template_id_3013006c_render,
      [],
      !1,
      null,
      null,
      null
    );
    Milestone_component.options.__file = 'src/components/Chart/Row/Milestone.vue';
    var Milestone = Milestone_component.exports,
      Projectvue_type_template_id_077bbd73_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'g',
          {
            staticClass:
              'gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-project-wrapper',
            style: Object.assign(
              {},
              _vm.root.style['chart-row-bar-wrapper'],
              _vm.root.style['chart-row-project-wrapper'],
              _vm.task.style['chart-row-bar-wrapper']
            ),
          },
          [
            _vm.displayExpander
              ? _c(
                  'foreignObject',
                  {
                    staticClass:
                      'gantt-elastic__chart-expander gantt-elastic__chart-expander--project',
                    style: Object.assign(
                      {},
                      _vm.root.style['chart-expander'],
                      _vm.root.style['chart-expander--project'],
                      _vm.task.style['chart-expander']
                    ),
                    attrs: {
                      x:
                        _vm.task.x -
                        _vm.root.state.options.chart.expander.offset -
                        _vm.root.state.options.chart.expander.size,
                      y:
                        _vm.task.y +
                        (_vm.root.state.options.row.height -
                          _vm.root.state.options.chart.expander.size) /
                          2,
                      width: _vm.root.state.options.chart.expander.size,
                      height: _vm.root.state.options.chart.expander.size,
                    },
                  },
                  [
                    _c('expander', {
                      attrs: {
                        tasks: [_vm.task],
                        options: _vm.root.state.options.chart.expander,
                        type: 'chart',
                      },
                    }),
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(' '),
            _c(
              'svg',
              {
                staticClass: 'gantt-elastic__chart-row-bar gantt-elastic__chart-row-project',
                style: Object.assign(
                  {},
                  _vm.root.style['chart-row-bar'],
                  _vm.root.style['chart-row-project'],
                  _vm.task.style['chart-row-bar']
                ),
                attrs: {
                  x: _vm.task.x,
                  y: _vm.task.y,
                  width: _vm.task.width,
                  height: _vm.task.height,
                  viewBox: '0 0 ' + _vm.task.width + ' ' + _vm.task.height,
                  xmlns: 'http://www.w3.org/2000/svg',
                },
                on: {
                  click: function ($event) {
                    return _vm.emitEvent('click', $event);
                  },
                  mouseenter: function ($event) {
                    return _vm.emitEvent('mouseenter', $event);
                  },
                  mouseover: function ($event) {
                    return _vm.emitEvent('mouseover', $event);
                  },
                  mouseout: function ($event) {
                    return _vm.emitEvent('mouseout', $event);
                  },
                  mousemove: function ($event) {
                    return _vm.emitEvent('mousemove', $event);
                  },
                  mousedown: function ($event) {
                    return _vm.emitEvent('mousedown', $event);
                  },
                  mouseup: function ($event) {
                    return _vm.emitEvent('mouseup', $event);
                  },
                  mousewheel: function ($event) {
                    return _vm.emitEvent('mousewheel', $event);
                  },
                  touchstart: function ($event) {
                    return _vm.emitEvent('touchstart', $event);
                  },
                  touchmove: function ($event) {
                    return _vm.emitEvent('touchmove', $event);
                  },
                  touchend: function ($event) {
                    return _vm.emitEvent('touchend', $event);
                  },
                },
              },
              [
                _c('defs', [
                  _c('clipPath', { attrs: { id: _vm.clipPathId } }, [
                    _c('path', { attrs: { d: _vm.getPoints } }),
                  ]),
                ]),
                _vm._v(' '),
                _c('path', {
                  staticClass:
                    'gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-project-polygon',
                  style: Object.assign(
                    {},
                    _vm.root.style['chart-row-bar-polygon'],
                    _vm.root.style['chart-row-project-polygon'],
                    _vm.task.style.base,
                    _vm.task.style['chart-row-bar-polygon']
                  ),
                  attrs: { d: _vm.getPoints },
                }),
                _vm._v(' '),
                _c('progress-bar', {
                  attrs: { task: _vm.task, 'clip-path': 'url(#' + _vm.clipPathId + ')' },
                }),
              ],
              1
            ),
            _vm._v(' '),
            _vm.root.state.options.chart.text.display
              ? _c('chart-text', { attrs: { task: _vm.task } })
              : _vm._e(),
          ],
          1
        );
      };
    Projectvue_type_template_id_077bbd73_render._withStripped = !0;
    var Project_component = normalizeComponent(
      {
        name: 'Project',
        components: { ChartText: Text, ProgressBar: ProgressBar, Expander: Expander },
        inject: ['root'],
        props: ['task'],
        mixins: [Task_mixin],
        data: () => ({}),
        computed: {
          clipPathId() {
            return 'gantt-elastic__project-clip-path-' + this.task.id;
          },
          getPoints() {
            const task = this.task,
              bottom = task.height - task.height / 4,
              corner = task.height / 6,
              smallCorner = task.height / 8;
            return `M ${smallCorner},0\n                L ${
              task.width - smallCorner
            } 0\n                L ${task.width} ${smallCorner}\n                L ${
              task.width
            } ${bottom}\n                L ${task.width - corner} ${
              task.height
            }\n                L ${task.width - 2 * corner} ${bottom}\n                L ${
              2 * corner
            } ${bottom}\n                L ${corner} ${
              task.height
            }\n                L 0 ${bottom}\n                L 0 ${smallCorner}\n                Z\n        `;
          },
          displayExpander() {
            const expander = this.root.state.options.chart.expander;
            return (
              expander.display ||
              (expander.displayIfTaskListHidden && !this.root.state.options.taskList.display)
            );
          },
        },
      },
      Projectvue_type_template_id_077bbd73_render,
      [],
      !1,
      null,
      null,
      null
    );
    Project_component.options.__file = 'src/components/Chart/Row/Project.vue';
    var Chart_component = normalizeComponent(
      {
        name: 'Chart',
        components: {
          Grid: Grid,
          DependencyLines: DependencyLines,
          Calendar: Calendar,
          Task: Task,
          Milestone: Milestone,
          Project: Project_component.exports,
          DaysHighlight: DaysHighlight,
        },
        inject: ['root'],
        data: () => ({ moving: !1 }),
        mounted() {
          (this.root.state.refs.chart = this.$refs.chart),
            (this.root.state.refs.chartCalendarContainer = this.$refs.chartCalendarContainer),
            (this.root.state.refs.chartGraphContainer = this.$refs.chartGraphContainer),
            (this.root.state.refs.chartGraph = this.$refs.chartGraph),
            (this.root.state.refs.chartGraphSvg = this.$refs.chartGraphSvg);
        },
        computed: {
          getViewBox() {
            return `0 0 ${this.root.state.options.width} ${this.root.state.options.allVisibleTasksHeight}`;
          },
        },
      },
      Chartvue_type_template_id_67c3f5cd_render,
      [],
      !1,
      null,
      null,
      null
    );
    Chart_component.options.__file = 'src/components/Chart/Chart.vue';
    var MainView_component = normalizeComponent(
      {
        name: 'MainView',
        components: { TaskList: TaskList, Chart: Chart_component.exports },
        inject: ['root'],
        data: () => ({
          defs: '',
          mousePos: {
            x: 0,
            y: 0,
            movementX: 0,
            movementY: 0,
            lastX: 0,
            lastY: 0,
            positiveX: 0,
            positiveY: 0,
            currentX: 0,
            currentY: 0,
          },
        }),
        mounted() {
          (this.viewBoxWidth = this.$el.clientWidth),
            (this.root.state.refs.mainView = this.$refs.mainView),
            (this.root.state.refs.chartContainer = this.$refs.chartContainer),
            (this.root.state.refs.taskList = this.$refs.taskList),
            (this.root.state.refs.chartScrollContainerHorizontal = this.$refs.chartScrollContainerHorizontal),
            (this.root.state.refs.chartScrollContainerVertical = this.$refs.chartScrollContainerVertical),
            document.addEventListener('mouseup', this.chartMouseUp.bind(this)),
            document.addEventListener('mousemove', this.chartMouseMove.bind(this)),
            document.addEventListener('touchmove', this.chartMouseMove.bind(this)),
            document.addEventListener('touchend', this.chartMouseUp.bind(this));
        },
        computed: {
          getMarginLeft() {
            return this.root.state.options.taskList.display
              ? this.root.state.options.taskList.finalWidth + 'px'
              : '0px';
          },
          verticalStyle() {
            return {
              width: this.root.state.options.scrollBarHeight + 'px',
              height: this.root.state.options.rowsHeight + 'px',
              'margin-top':
                this.root.state.options.calendar.height +
                this.root.state.options.calendar.gap +
                'px',
            };
          },
          getViewBox() {
            return this.root.state.options.clientWidth
              ? `0 0 ${
                  this.root.state.options.clientWidth - this.root.state.options.scrollBarHeight
                } ${this.root.state.options.height}`
              : `0 0 0 ${this.root.state.options.height}`;
          },
        },
        methods: {
          mouseMove(event) {
            this.root.$emit('main-view-mousemove', event);
          },
          mouseUp(event) {
            this.root.$emit('main-view-mouseup', event);
          },
          onHorizontalScroll(ev) {
            this.root.$emit('chart-scroll-horizontal', ev);
          },
          onVerticalScroll(ev) {
            this.root.$emit('chart-scroll-vertical', ev);
          },
          chartWheel(ev) {
            this.root.$emit('chart-wheel', ev);
          },
          chartMouseDown(ev) {
            void 0 !== ev.touches &&
              ((this.mousePos.x = this.mousePos.lastX = ev.touches[0].screenX),
              (this.mousePos.y = this.mousePos.lastY = ev.touches[0].screenY),
              (this.mousePos.movementX = 0),
              (this.mousePos.movementY = 0),
              (this.mousePos.currentX = this.$refs.chartScrollContainerHorizontal.scrollLeft),
              (this.mousePos.currentY = this.$refs.chartScrollContainerVertical.scrollTop)),
              (this.root.state.options.scroll.scrolling = !0);
          },
          chartMouseUp(ev) {
            this.root.state.options.scroll.scrolling = !1;
          },
          chartMouseMove(ev) {
            if (this.root.state.options.scroll.scrolling) {
              ev.preventDefault(), ev.stopImmediatePropagation(), ev.stopPropagation();
              const touch = void 0 !== ev.touches;
              let movementX, movementY;
              if (touch) {
                const screenX = ev.touches[0].screenX,
                  screenY = ev.touches[0].screenY;
                (movementX = this.mousePos.x - screenX),
                  (movementY = this.mousePos.y - screenY),
                  (this.mousePos.lastX = screenX),
                  (this.mousePos.lastY = screenY);
              } else (movementX = ev.movementX), (movementY = ev.movementY);
              const horizontal = this.$refs.chartScrollContainerHorizontal,
                vertical = this.$refs.chartScrollContainerVertical;
              let x = 0,
                y = 0;
              (x = touch
                ? this.mousePos.currentX +
                  movementX * this.root.state.options.scroll.dragXMoveMultiplier
                : horizontal.scrollLeft -
                  movementX * this.root.state.options.scroll.dragXMoveMultiplier),
                (horizontal.scrollLeft = x),
                (y = touch
                  ? this.mousePos.currentY +
                    movementY * this.root.state.options.scroll.dragYMoveMultiplier
                  : vertical.scrollTop -
                    movementY * this.root.state.options.scroll.dragYMoveMultiplier),
                (vertical.scrollTop = y);
            }
          },
        },
        beforeDestroy() {
          document.removeEventListener('mouseup', this.chartMouseUp),
            document.removeEventListener('mousemove', this.chartMouseMove),
            document.removeEventListener('touchmove', this.chartMouseMove),
            document.removeEventListener('touchend', this.chartMouseUp);
        },
      },
      MainViewvue_type_template_id_0bc4212e_render,
      [],
      !1,
      null,
      null,
      null
    );
    MainView_component.options.__file = 'src/components/MainView.vue';
    var MainView = MainView_component.exports;
    /**
     * @fileoverview Styles for gantt-elastic
     * @license MIT
     * @author Rafal Pospiech <neuronet.io@gmail.com>
     * @package GanttElastic
     */ var ResizeObserver_es = __webpack_require__(3);
    const ctx = document.createElement('canvas').getContext('2d');
    let VueInst = external_Vue_default.a;
    'undefined' != typeof Vue && void 0 === VueInst && (VueInst = Vue);
    function isObject(item) {
      return (
        item &&
        'object' == typeof item &&
        !Array.isArray(item) &&
        !(item instanceof HTMLElement) &&
        !(item instanceof CanvasRenderingContext2D) &&
        'function' != typeof item
      );
    }
    function mergeDeep(target, ...sources) {
      if (!sources.length) return target;
      const source = sources.shift();
      if (isObject(target) && isObject(source))
        for (const key in source)
          if (isObject(source[key]))
            void 0 === target[key] && (target[key] = {}),
              (target[key] = mergeDeep(target[key], source[key]));
          else if (Array.isArray(source[key])) {
            target[key] = [];
            for (let item of source[key])
              isObject(item) ? target[key].push(mergeDeep({}, item)) : target[key].push(item);
          } else target[key] = source[key];
      return mergeDeep(target, ...sources);
    }
    function notEqualDeep(left, right, cache = [], path = '') {
      if (typeof right != typeof left) return { left: left, right: right, what: path + '.typeof' };
      if (Array.isArray(left) && !Array.isArray(right))
        return { left: left, right: right, what: path + '.isArray' };
      if (Array.isArray(right) && !Array.isArray(left))
        return { left: left, right: right, what: path + '.isArray' };
      if (Array.isArray(left) && Array.isArray(right)) {
        if (left.length !== right.length)
          return { left: left, right: right, what: path + '.length' };
        let what;
        for (let index = 0, len = left.length; index < len; index++)
          if ((what = notEqualDeep(left[index], right[index], cache, path + '.' + index)))
            return what;
      } else {
        if (isObject(left) && !isObject(right))
          return { left: left, right: right, what: path + '.isObject' };
        if (isObject(right) && !isObject(left))
          return { left: left, right: right, what: path + '.isObject' };
        if (isObject(left) && isObject(right))
          for (let key in left) {
            if (!left.hasOwnProperty(key) || !left.propertyIsEnumerable(key)) continue;
            if (!right.hasOwnProperty(key))
              return { left: left, right: right, what: path + '.' + key };
            let what;
            if ((what = notEqualDeep(left[key], right[key], cache, path + '.' + key))) return what;
          }
        else if (left !== right) return { left: left, right: right, what: path + '. !==' };
      }
      return !1;
    }
    var src_GanttElasticvue_type_script_lang_js_ = {
        name: 'GanttElastic',
        components: { MainView: MainView },
        props: ['tasks', 'options', 'dynamicStyle'],
        provide() {
          const provider = {},
            self = this;
          return (
            Object.defineProperty(provider, 'root', { enumerable: !0, get: () => self }), provider
          );
        },
        data: () => ({
          state: {
            tasks: [],
            options: {
              scrollBarHeight: 0,
              allVisibleTasksHeight: 0,
              outerHeight: 0,
              scroll: { left: 0, top: 0 },
            },
            dynamicStyle: {},
            refs: {},
            tasksById: {},
            taskTree: {},
            ctx: ctx,
            emitTasksChanges: !0,
            emitOptionsChanges: !0,
            resizeObserver: null,
            unwatchTasks: null,
            unwatchOptions: null,
            unwatchStyle: null,
            unwatchOutputTasks: null,
            unwatchOutputOptions: null,
            unwatchOutputStyle: null,
          },
        }),
        methods: {
          mergeDeep: mergeDeep,
          mergeDeepReactive: function mergeDeepReactive(component, target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();
            if (isObject(target) && isObject(source))
              for (const key in source)
                isObject(source[key])
                  ? (void 0 === target[key] && component.$set(target, key, {}),
                    mergeDeepReactive(component, target[key], source[key]))
                  : Array.isArray(source[key])
                  ? component.$set(target, key, source[key])
                  : 'function' == typeof source[key]
                  ? -1 === source[key].toString().indexOf('[native code]') &&
                    (target[key] = source[key])
                  : component.$set(target, key, source[key]);
            return mergeDeepReactive(component, target, ...sources);
          },
          getScrollBarHeight() {
            const outer = document.createElement('div');
            (outer.style.visibility = 'hidden'),
              (outer.style.height = '100px'),
              (outer.style.msOverflowStyle = 'scrollbar'),
              document.body.appendChild(outer);
            var noScroll = outer.offsetHeight;
            outer.style.overflow = 'scroll';
            var inner = document.createElement('div');
            (inner.style.height = '100%'), outer.appendChild(inner);
            var withScroll = inner.offsetHeight;
            outer.parentNode.removeChild(outer);
            const height = noScroll - withScroll;
            return (
              (this.style['chart-scroll-container--vertical']['margin-left'] = `-${height}px`),
              (this.state.options.scrollBarHeight = height)
            );
          },
          fillTasks(tasks) {
            for (let task of tasks)
              void 0 === task.x && (task.x = 0),
                void 0 === task.y && (task.y = 0),
                void 0 === task.width && (task.width = 0),
                void 0 === task.height && (task.height = 0),
                void 0 === task.mouseOver && (task.mouseOver = !1),
                void 0 === task.collapsed && (task.collapsed = !1),
                void 0 === task.dependentOn && (task.dependentOn = []),
                void 0 === task.parentId && (task.parentId = null),
                void 0 === task.style && (task.style = {}),
                void 0 === task.children && (task.children = []),
                void 0 === task.allChildren && (task.allChildren = []),
                void 0 === task.parents && (task.parents = []),
                void 0 === task.parent && (task.parent = null),
                void 0 === task.startTime &&
                  (task.startTime = dayjs_min_default()(task.start).valueOf()),
                void 0 === task.endTime && task.hasOwnProperty('end')
                  ? (task.endTime = dayjs_min_default()(task.end).valueOf())
                  : void 0 === task.endTime &&
                    task.hasOwnProperty('duration') &&
                    (task.endTime = task.startTime + task.duration),
                void 0 === task.duration &&
                  task.hasOwnProperty('endTime') &&
                  (task.duration = task.endTime - task.startTime);
            return tasks;
          },
          mapTasks(tasks, options) {
            for (let [index, task] of tasks.entries())
              tasks[index] = {
                ...task,
                id: task[options.taskMapping.id],
                start: task[options.taskMapping.start],
                label: task[options.taskMapping.label],
                duration: task[options.taskMapping.duration],
                progress: task[options.taskMapping.progress],
                type: task[options.taskMapping.type],
                style: task[options.taskMapping.style],
                collapsed: task[options.taskMapping.collapsed],
              };
            return tasks;
          },
          initialize(itsUpdate = '') {
            let options = mergeDeep(
                {},
                this.state.options,
                (function (userOptions) {
                  let localeName = 'en';
                  return (
                    void 0 !== userOptions.locale &&
                      void 0 !== userOptions.locale.name &&
                      (localeName = userOptions.locale.name),
                    {
                      slots: { header: {} },
                      taskMapping: {
                        id: 'id',
                        start: 'start',
                        label: 'label',
                        duration: 'duration',
                        progress: 'progress',
                        type: 'type',
                        style: 'style',
                        collapsed: 'collapsed',
                      },
                      width: 0,
                      height: 0,
                      clientWidth: 0,
                      outerHeight: 0,
                      rowsHeight: 0,
                      allVisibleTasksHeight: 0,
                      scroll: {
                        scrolling: !1,
                        dragXMoveMultiplier: 3,
                        dragYMoveMultiplier: 2,
                        top: 0,
                        taskList: { left: 0, right: 0, top: 0, bottom: 0 },
                        chart: {
                          left: 0,
                          right: 0,
                          percent: 0,
                          timePercent: 0,
                          top: 0,
                          bottom: 0,
                          time: 0,
                          timeCenter: 0,
                          dateTime: { left: '', right: '' },
                        },
                      },
                      scope: { before: 1, after: 1 },
                      times: {
                        timeScale: 6e4,
                        timeZoom: 17,
                        timePerPixel: 0,
                        firstTime: null,
                        lastTime: null,
                        firstTaskTime: 0,
                        lastTaskTime: 0,
                        totalViewDurationMs: 0,
                        totalViewDurationPx: 0,
                        stepDuration: 'day',
                        steps: [],
                      },
                      row: { height: 24 },
                      maxRows: 20,
                      maxHeight: 0,
                      chart: {
                        grid: { horizontal: { gap: 6 } },
                        progress: { width: 20, height: 6, pattern: !0, bar: !1 },
                        text: { offset: 4, xPadding: 10, display: !0 },
                        expander: {
                          type: 'chart',
                          display: !1,
                          displayIfTaskListHidden: !0,
                          offset: 4,
                          size: 18,
                        },
                      },
                      taskList: {
                        display: !0,
                        resizeAfterThreshold: !0,
                        widthThreshold: 75,
                        columns: [{ id: 0, label: 'ID', value: 'id', width: 40 }],
                        percent: 100,
                        width: 0,
                        finalWidth: 0,
                        widthFromPercentage: 0,
                        minWidth: 18,
                        expander: {
                          type: 'task-list',
                          size: 16,
                          columnWidth: 24,
                          padding: 16,
                          margin: 10,
                          straight: !1,
                        },
                      },
                      calendar: {
                        workingDays: [1, 2, 3, 4, 5],
                        gap: 6,
                        height: 0,
                        strokeWidth: 1,
                        hour: {
                          height: 20,
                          display: !0,
                          widths: [],
                          maxWidths: { short: 0, medium: 0, long: 0 },
                          formatted: { long: [], medium: [], short: [] },
                          format: {
                            long: (date) => date.format('HH:mm'),
                            medium: (date) => date.format('HH:mm'),
                            short: (date) => date.format('HH'),
                          },
                        },
                        day: {
                          height: 20,
                          display: !0,
                          widths: [],
                          maxWidths: { short: 0, medium: 0, long: 0 },
                          format: {
                            long: (date) => date.format('DD dddd'),
                            medium: (date) => date.format('DD ddd'),
                            short: (date) => date.format('DD'),
                          },
                        },
                        month: {
                          height: 20,
                          display: !0,
                          widths: [],
                          maxWidths: { short: 0, medium: 0, long: 0 },
                          format: {
                            short: (date) => date.format('MM'),
                            medium: (date) => date.format("MMM 'YY"),
                            long: (date) => date.format('MMMM YYYY'),
                          },
                        },
                      },
                      locale: {
                        name: 'en',
                        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
                          '_'
                        ),
                        weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
                        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
                        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
                          '_'
                        ),
                        monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
                        weekStart: 1,
                        relativeTime: {
                          future: 'in %s',
                          past: '%s ago',
                          s: 'a few seconds',
                          m: 'a minute',
                          mm: '%d minutes',
                          h: 'an hour',
                          hh: '%d hours',
                          d: 'a day',
                          dd: '%d days',
                          M: 'a month',
                          MM: '%d months',
                          y: 'a year',
                          yy: '%d years',
                        },
                        formats: {
                          LT: 'HH:mm',
                          LTS: 'HH:mm:ss',
                          L: 'DD/MM/YYYY',
                          LL: 'D MMMM YYYY',
                          LLL: 'D MMMM YYYY HH:mm',
                          LLLL: 'dddd, D MMMM YYYY HH:mm',
                        },
                        ordinal: (n) => {
                          const s = ['th', 'st', 'nd', 'rd'],
                            v = n % 100;
                          return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
                        },
                      },
                    }
                  );
                })(this.options),
                this.options
              ),
              tasks = this.mapTasks(this.tasks, options);
            0 === Object.keys(this.state.dynamicStyle).length && this.initializeStyle(),
              dayjs_min_default.a.locale(options.locale, null, !0),
              dayjs_min_default.a.locale(options.locale.name),
              void 0 === options.taskList && (options.taskList = {}),
              (options.taskList.columns = options.taskList.columns.map(
                (column, index) => (
                  (column.thresholdPercent = 100),
                  (column.widthFromPercentage = 0),
                  (column.finalWidth = 0),
                  void 0 === column.height && (column.height = 0),
                  void 0 === column.style && (column.style = {}),
                  (column._id = `${index}-${column.label}`),
                  column
                )
              )),
              (this.state.options = options),
              (tasks = this.fillTasks(tasks)),
              (this.state.tasksById = this.resetTaskTree(tasks)),
              (this.state.taskTree = this.makeTaskTree(this.state.rootTask, tasks)),
              (this.state.tasks = this.state.taskTree.allChildren.map((childId) =>
                this.getTask(childId)
              )),
              this.calculateTaskListColumnsDimensions(),
              (this.state.options.scrollBarHeight = this.getScrollBarHeight()),
              (this.state.options.outerHeight =
                this.state.options.height + this.state.options.scrollBarHeight),
              this.globalOnResize();
          },
          initializeStyle() {
            this.state.dynamicStyle = mergeDeep(
              {},
              (function (userStyle) {
                let fontSize = '12px',
                  fontFamily = window
                    .getComputedStyle(document.body)
                    .getPropertyValue('font-family')
                    .toString();
                return (
                  void 0 !== userStyle &&
                    (void 0 !== userStyle.fontSize && (fontSize = userStyle.fontSize),
                    void 0 !== userStyle.fontFamily && (fontFamily = userStyle.fontFamily)),
                  (function (fontSize = '12px', fontFamily = 'Arial, sans-serif') {
                    return {
                      fontSize: fontSize,
                      fontFamily: fontFamily,
                      'main-view': { background: '#FFFFFF' },
                      'main-container-wrapper': {
                        overflow: 'hidden',
                        'border-top': '1px solid #eee',
                        'border-bottom': '1px solid #eee',
                      },
                      'main-container': { float: 'left', 'max-width': '100%' },
                      'main-view-container': {},
                      container: { display: 'flex', 'max-width': '100%', height: '100%' },
                      'calendar-wrapper': { 'user-select': 'none' },
                      calendar: { width: '100%', background: '#f3f5f7', display: 'block' },
                      'calendar-row': { display: 'flex', 'justify-content': 'space-evenly' },
                      'calendar-row--month': {},
                      'calendar-row--day': {},
                      'calendar-row--hour': { 'border-bottom': '1px solid #eee' },
                      'calendar-row-rect': { background: 'transparent', display: 'flex' },
                      'calendar-row-rect--month': {},
                      'calendar-row-rect--day': {},
                      'calendar-row-rect--hour': {},
                      'calendar-row-rect-child': {
                        display: 'block',
                        'border-right-width': '1px',
                        'border-right-color': '#dadada',
                        'border-right-style': 'solid',
                        position: 'relative',
                      },
                      'calendar-row-rect-child--month': {},
                      'calendar-row-rect-child--day': { 'text-align': 'center' },
                      'calendar-row-rect-child--hour': { 'text-align': 'center' },
                      'calendar-row-text': {
                        'font-family': fontFamily,
                        'font-size': fontSize,
                        color: '#606060',
                        display: 'inline-block',
                        position: 'relative',
                      },
                      'calendar-row-text--month': {},
                      'calendar-row-text--day': {},
                      'calendar-row-text--hour': {},
                      'task-list-wrapper': {},
                      'task-list': { background: 'transparent', 'border-color': '#eee' },
                      'task-list-header': {
                        display: 'flex',
                        'user-select': 'none',
                        'vertical-align': 'middle',
                        'border-bottom': '1px solid #eee',
                        'border-left': '1px solid #eee',
                      },
                      'task-list-header-column': {
                        'border-left': '1px solid #00000050',
                        'box-sizing': 'border-box',
                        display: 'flex',
                        background: '#f3f5f7',
                        'border-color': 'transparent',
                      },
                      'task-list-expander-wrapper': {
                        display: 'inline-flex',
                        'flex-shrink': '0',
                        'box-sizing': 'border-box',
                        margin: '0 0 0 10px',
                      },
                      'task-list-expander-content': {
                        display: 'inline-flex',
                        cursor: 'pointer',
                        margin: 'auto 0px',
                        'box-sizing': 'border-box',
                        'user-select': 'none',
                      },
                      'task-list-expander-line': {
                        fill: 'transparent',
                        stroke: '#000000',
                        'stroke-width': '1',
                        'stroke-linecap': 'round',
                      },
                      'task-list-expander-border': { fill: '#ffffffa0', stroke: '#000000A0' },
                      'chart-expander-wrapper': {
                        display: 'block',
                        'line-height': '1',
                        'box-sizing': 'border-box',
                        margin: '0',
                      },
                      'chart-expander-content': {
                        display: 'inline-flex',
                        cursor: 'pointer',
                        margin: 'auto 0px',
                        'box-sizing': 'border-box',
                        'user-select': 'none',
                      },
                      'chart-expander-line': {
                        fill: 'transparent',
                        stroke: '#000000',
                        'stroke-width': '1',
                        'stroke-linecap': 'round',
                      },
                      'chart-expander-border': { fill: '#ffffffa0', stroke: '#000000A0' },
                      'task-list-container': {},
                      'task-list-header-label': {
                        overflow: 'hidden',
                        'text-overflow': 'ellipsis',
                        'font-family': fontFamily,
                        'font-size': fontSize,
                        'box-sizing': 'border-box',
                        margin: 'auto 6px',
                        'flex-grow': '1',
                        'vertical-align': 'middle',
                      },
                      'task-list-header-resizer-wrapper': {
                        background: 'transparent',
                        height: '100%',
                        width: '6px',
                        cursor: 'col-resize',
                        display: 'inline-flex',
                        'vertical-align': 'center',
                      },
                      'task-list-header-resizer': { margin: 'auto 0px' },
                      'task-list-header-resizer-dot': {
                        width: '3px',
                        height: '3px',
                        background: '#ddd',
                        'border-radius': '100%',
                        margin: '4px 0px',
                      },
                      'task-list-items': { overflow: 'hidden' },
                      'task-list-item': {
                        'border-top': '1px solid #eee',
                        'border-right': '1px solid #eee',
                        'box-sizing': 'border-box',
                        display: 'flex',
                        background: 'transparent',
                      },
                      'task-list-item-column': {
                        display: 'inline-flex',
                        'flex-shrink': '0',
                        'border-left': '1px solid #00000050',
                        'box-sizing': 'border-box',
                        'border-color': '#eee',
                      },
                      'task-list-item-value-wrapper': {
                        overflow: 'hidden',
                        display: 'flex',
                        width: '100%',
                      },
                      'task-list-item-value-container': { margin: 'auto 0px', overflow: 'hidden' },
                      'task-list-item-value': {
                        display: 'block',
                        'flex-shrink': '100',
                        'font-family': fontFamily,
                        'font-size': fontSize,
                        'margin-top': 'auto',
                        'margin-bottom': 'auto',
                        'margin-left': '6px',
                        'margin-right': '6px',
                        overflow: 'hidden',
                        'text-overflow': 'ellipsis',
                        'line-height': '1.5em',
                        'word-break': 'keep-all',
                        'white-space': 'nowrap',
                        color: '#606060',
                        background: '#FFFFFF',
                      },
                      'grid-lines': {},
                      'grid-line-horizontal': { stroke: '#00000010', 'stroke-width': 1 },
                      'grid-line-vertical': { stroke: '#00000010', 'stroke-width': 1 },
                      'grid-line-time': { stroke: '#FF000080', 'stroke-width': 1 },
                      chart: { 'user-select': 'none', overflow: 'hidden' },
                      'chart-calendar-container': {
                        'user-select': 'none',
                        overflow: 'hidden',
                        'max-width': '100%',
                        'border-right': '1px solid #eee',
                      },
                      'chart-graph-container': {
                        'user-select': 'none',
                        overflow: 'hidden',
                        'max-width': '100%',
                        'border-right': '1px solid #eee',
                      },
                      'chart-area': {},
                      'chart-graph': { overflow: 'hidden' },
                      'chart-row-text-wrapper': {},
                      'chart-row-text': {
                        background: '#ffffffa0',
                        'border-radius': '10px',
                        'font-family': fontFamily,
                        'font-size': fontSize,
                        'font-weight': 'normal',
                        color: '#000000a0',
                        height: '100%',
                        display: 'inline-block',
                      },
                      'chart-row-text-content': { padding: '0px 6px' },
                      'chart-row-text-content--text': {},
                      'chart-row-text-content--html': {},
                      'chart-row-wrapper': {},
                      'chart-row-bar-wrapper': {},
                      'chart-row-bar': {},
                      'chart-row-bar-polygon': {
                        stroke: '#E74C3C',
                        'stroke-width': 1,
                        fill: '#F75C4C',
                      },
                      'chart-row-project-wrapper': {},
                      'chart-row-project': {},
                      'chart-row-project-polygon': {},
                      'chart-row-milestone-wrapper': {},
                      'chart-row-milestone': {},
                      'chart-row-milestone-polygon': {},
                      'chart-row-task-wrapper': {},
                      'chart-row-task': {},
                      'chart-row-task-polygon': {},
                      'chart-row-progress-bar-wrapper': {},
                      'chart-row-progress-bar': {},
                      'chart-row-progress-bar-line': { stroke: '#ffffff25', 'stroke-width': 20 },
                      'chart-row-progress-bar-solid': { fill: '#0EAC51', height: '20%' },
                      'chart-row-progress-bar-pattern': {
                        fill: 'url(#diagonalHatch)',
                        transform: 'translateY(0.1) scaleY(0.8)',
                      },
                      'chart-row-progress-bar-outline': { stroke: '#E74C3C', 'stroke-width': 1 },
                      'chart-dependency-lines-wrapper': {},
                      'chart-dependency-lines-path': {
                        fill: 'transparent',
                        stroke: '#FFa00090',
                        'stroke-width': 2,
                      },
                      'chart-scroll-container': {},
                      'chart-scroll-container--horizontal': {
                        overflow: 'auto',
                        'max-width': '100%',
                      },
                      'chart-scroll-container--vertical': {
                        'overflow-y': 'auto',
                        'overflow-x': 'hidden',
                        'max-height': '100%',
                        float: 'right',
                      },
                      'chart-days-highlight-rect': { fill: '#f3f5f780' },
                      'slot-header-beforeOptions': { display: 'inline-block' },
                    };
                  })(fontSize, fontFamily)
                );
              })(this.dynamicStyle),
              this.dynamicStyle
            );
          },
          getCalendarHeight() {
            return this.state.options.calendar.height + this.state.options.calendar.strokeWidth;
          },
          getMaximalLevel() {
            let maximalLevel = 0;
            return (
              this.state.tasks.forEach((task) => {
                task.parents.length > maximalLevel && (maximalLevel = task.parents.length);
              }),
              maximalLevel - 1
            );
          },
          getMaximalExpanderWidth() {
            return (
              this.getMaximalLevel() * this.state.options.taskList.expander.padding +
              this.state.options.taskList.expander.margin
            );
          },
          syncScrollTop() {
            this.state.refs.taskListItems &&
              this.state.refs.chartGraph.scrollTop !== this.state.refs.taskListItems.scrollTop &&
              (this.state.options.scroll.top = this.state.refs.taskListItems.scrollTop = this.state.refs.chartScrollContainerVertical.scrollTop = this.state.refs.chartGraph.scrollTop);
          },
          calculateTaskListColumnsDimensions() {
            let final = 0,
              percentage = 0;
            for (let column of this.state.options.taskList.columns)
              column.expander
                ? (column.widthFromPercentage =
                    ((this.getMaximalExpanderWidth() + column.width) / 100) *
                    this.state.options.taskList.percent)
                : (column.widthFromPercentage =
                    (column.width / 100) * this.state.options.taskList.percent),
                (percentage += column.widthFromPercentage),
                (column.finalWidth = (column.thresholdPercent * column.widthFromPercentage) / 100),
                (final += column.finalWidth),
                (column.height =
                  this.getTaskHeight() - this.style['grid-line-horizontal']['stroke-width']);
            (this.state.options.taskList.widthFromPercentage = percentage),
              (this.state.options.taskList.finalWidth = final);
          },
          resetTaskTree(tasks) {
            this.$set(this.state, 'rootTask', {
              id: null,
              label: 'root',
              children: [],
              allChildren: [],
              parents: [],
              parent: null,
              __root: !0,
            });
            const tasksById = {};
            for (let i = 0, len = tasks.length; i < len; i++) {
              let current = tasks[i];
              (current.children = []),
                (current.allChildren = []),
                (current.parent = null),
                (current.parents = []),
                (tasksById[current.id] = current);
            }
            return tasksById;
          },
          makeTaskTree(task, tasks) {
            for (let i = 0, len = tasks.length; i < len; i++) {
              let current = tasks[i];
              current.parentId === task.id &&
                (task.parents.length &&
                  task.parents.forEach((parent) => current.parents.push(parent)),
                task.propertyIsEnumerable('__root')
                  ? ((current.parents = []), (current.parent = null))
                  : (current.parents.push(task.id), (current.parent = task.id)),
                (current = this.makeTaskTree(current, tasks)),
                task.allChildren.push(current.id),
                task.children.push(current.id),
                current.allChildren.forEach((childId) => task.allChildren.push(childId)));
            }
            return task;
          },
          getTask(taskId) {
            return void 0 !== this.state.tasksById[taskId] ? this.state.tasksById[taskId] : null;
          },
          getChildren(taskId) {
            return this.state.tasks.filter((task) => task.parent === taskId);
          },
          isTaskVisible(task) {
            ('number' != typeof task && 'string' != typeof task) || (task = this.getTask(task));
            for (let i = 0, len = task.parents.length; i < len; i++)
              if (this.getTask(task.parents[i]).collapsed) return !1;
            return !0;
          },
          getSVG() {
            return this.state.options.mainView.outerHTML;
          },
          getImage(type = 'image/png') {
            return new Promise((resolve) => {
              const img = new Image();
              (img.onload = () => {
                const canvas = document.createElement('canvas');
                (canvas.width = this.state.options.mainView.clientWidth),
                  (canvas.height = this.state.options.rowsHeight),
                  canvas.getContext('2d').drawImage(img, 0, 0),
                  resolve(canvas.toDataURL(type));
              }),
                (img.src = 'data:image/svg+xml,' + encodeURIComponent(this.getSVG()));
            });
          },
          getHeight(visibleTasks, outer = !1) {
            let height =
              visibleTasks.length *
                (this.state.options.row.height + 2 * this.state.options.chart.grid.horizontal.gap) +
              this.state.options.calendar.height +
              this.state.options.calendar.strokeWidth +
              this.state.options.calendar.gap;
            return outer && (height += this.state.options.scrollBarHeight), height;
          },
          getTaskHeight(withStroke = !1) {
            return withStroke
              ? this.state.options.row.height +
                  2 * this.state.options.chart.grid.horizontal.gap +
                  this.style['grid-line-horizontal']['stroke-width']
              : this.state.options.row.height + 2 * this.state.options.chart.grid.horizontal.gap;
          },
          getTasksHeight(visibleTasks) {
            return visibleTasks.length * this.getTaskHeight();
          },
          timeToPixelOffsetX(ms) {
            let x = ms - this.state.options.times.firstTime;
            return x && (x /= this.state.options.times.timePerPixel), x;
          },
          pixelOffsetXToTime(pixelOffsetX) {
            return (
              (pixelOffsetX + this.style['grid-line-vertical']['stroke-width'] / 2) *
                this.state.options.times.timePerPixel +
              this.state.options.times.firstTime
            );
          },
          isInsideViewPort(x, width, buffer = 5e3) {
            return (
              (x + width + buffer >= this.state.options.scroll.chart.left &&
                x - buffer <= this.state.options.scroll.chart.right) ||
              (x - buffer <= this.state.options.scroll.chart.left &&
                x + width + buffer >= this.state.options.scroll.chart.right)
            );
          },
          onScrollChart(ev) {
            this._onScrollChart(
              this.state.refs.chartScrollContainerHorizontal.scrollLeft,
              this.state.refs.chartScrollContainerVertical.scrollTop
            );
          },
          _onScrollChart(left, top) {
            if (
              this.state.options.scroll.chart.left === left &&
              this.state.options.scroll.chart.top === top
            )
              return;
            const chartContainerWidth = this.state.refs.chartContainer.clientWidth;
            (this.state.options.scroll.chart.left = left),
              (this.state.options.scroll.chart.right = left + chartContainerWidth),
              (this.state.options.scroll.chart.percent =
                (left / this.state.options.times.totalViewDurationPx) * 100),
              (this.state.options.scroll.chart.top = top),
              (this.state.options.scroll.chart.time = this.pixelOffsetXToTime(left)),
              (this.state.options.scroll.chart.timeCenter = this.pixelOffsetXToTime(
                left + chartContainerWidth / 2
              )),
              (this.state.options.scroll.chart.dateTime.left = dayjs_min_default()(
                this.state.options.scroll.chart.time
              ).valueOf()),
              (this.state.options.scroll.chart.dateTime.right = dayjs_min_default()(
                this.pixelOffsetXToTime(left + this.state.refs.chart.clientWidth)
              ).valueOf()),
              this.scrollTo(left, top);
          },
          scrollToTime(time) {
            let pos = this.timeToPixelOffsetX(time);
            const chartContainerWidth = this.state.refs.chartContainer.clientWidth;
            (pos -= chartContainerWidth / 2) > this.state.options.width &&
              (pos = this.state.options.width - chartContainerWidth),
              this.scrollTo(pos);
          },
          scrollTo(left = null, top = null) {
            null !== left &&
              ((this.state.refs.chartCalendarContainer.scrollLeft = left),
              (this.state.refs.chartGraphContainer.scrollLeft = left),
              (this.state.refs.chartScrollContainerHorizontal.scrollLeft = left),
              (this.state.options.scroll.left = left)),
              null !== top &&
                ((this.state.refs.chartScrollContainerVertical.scrollTop = top),
                (this.state.refs.chartGraph.scrollTop = top),
                (this.state.refs.taskListItems.scrollTop = top),
                (this.state.options.scroll.top = top),
                this.syncScrollTop());
          },
          fixScrollPos() {
            this.scrollToTime(this.state.options.scroll.chart.timeCenter);
          },
          onWheelChart(ev) {
            if (ev.shiftKey || 0 !== ev.deltaX)
              if (ev.shiftKey && 0 === ev.deltaX) {
                let left = this.state.options.scroll.left + ev.deltaY;
                const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth,
                  scrollWidth =
                    this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;
                left < 0 ? (left = 0) : left > scrollWidth && (left = scrollWidth),
                  this.scrollTo(left);
              } else {
                let left = this.state.options.scroll.left + ev.deltaX;
                const chartClientWidth = this.state.refs.chartScrollContainerHorizontal.clientWidth,
                  scrollWidth =
                    this.state.refs.chartScrollContainerHorizontal.scrollWidth - chartClientWidth;
                left < 0 ? (left = 0) : left > scrollWidth && (left = scrollWidth),
                  this.scrollTo(left);
              }
            else {
              let top = this.state.options.scroll.top + ev.deltaY;
              const chartClientHeight = this.state.options.rowsHeight,
                scrollHeight = this.state.refs.chartGraph.scrollHeight - chartClientHeight;
              top < 0 ? (top = 0) : top > scrollHeight && (top = scrollHeight),
                this.scrollTo(null, top);
            }
          },
          onTimeZoomChange(timeZoom) {
            (this.state.options.times.timeZoom = timeZoom),
              this.recalculateTimes(),
              this.calculateSteps(),
              this.fixScrollPos();
          },
          onRowHeightChange(height) {
            (this.state.options.row.height = height),
              this.calculateTaskListColumnsDimensions(),
              this.syncScrollTop();
          },
          onScopeChange(value) {
            (this.state.options.scope.before = value),
              (this.state.options.scope.after = value),
              this.initTimes(),
              this.calculateSteps(),
              this.computeCalendarWidths(),
              this.fixScrollPos();
          },
          onTaskListWidthChange(value) {
            (this.state.options.taskList.percent = value),
              this.calculateTaskListColumnsDimensions(),
              this.fixScrollPos();
          },
          onTaskListColumnWidthChange() {
            this.calculateTaskListColumnsDimensions(), this.fixScrollPos();
          },
          initializeEvents() {
            this.$on('chart-scroll-horizontal', this.onScrollChart),
              this.$on('chart-scroll-vertical', this.onScrollChart),
              this.$on('chart-wheel', this.onWheelChart),
              this.$on('times-timeZoom-change', this.onTimeZoomChange),
              this.$on('row-height-change', this.onRowHeightChange),
              this.$on('scope-change', this.onScopeChange),
              this.$on('taskList-width-change', this.onTaskListWidthChange),
              this.$on('taskList-column-width-change', this.onTaskListColumnWidthChange);
          },
          recalculateTimes() {
            let steps =
                (60 * this.state.options.times.timeScale) / this.state.options.times.timeScale,
              percent = this.state.options.times.timeZoom / 100;
            (this.state.options.times.timePerPixel =
              this.state.options.times.timeScale * steps * percent +
              Math.pow(2, this.state.options.times.timeZoom)),
              (this.state.options.times.totalViewDurationMs = dayjs_min_default()(
                this.state.options.times.lastTime
              ).diff(this.state.options.times.firstTime, 'milliseconds')),
              (this.state.options.times.totalViewDurationPx =
                this.state.options.times.totalViewDurationMs /
                this.state.options.times.timePerPixel),
              (this.state.options.width =
                this.state.options.times.totalViewDurationPx +
                this.style['grid-line-vertical']['stroke-width']);
          },
          initTimes() {
            (this.state.options.times.firstTime = dayjs_min_default()(
              this.state.options.times.firstTaskTime
            )
              .locale(this.state.options.locale.name)
              .startOf('day')
              .subtract(this.state.options.scope.before, 'days')
              .startOf('day')
              .valueOf()),
              (this.state.options.times.lastTime = dayjs_min_default()(
                this.state.options.times.lastTaskTime
              )
                .locale(this.state.options.locale.name)
                .endOf('day')
                .add(this.state.options.scope.after, 'days')
                .endOf('day')
                .valueOf()),
              this.recalculateTimes();
          },
          calculateSteps() {
            const steps = [],
              lastMs = dayjs_min_default()(this.state.options.times.lastTime).valueOf(),
              currentDate = dayjs_min_default()(this.state.options.times.firstTime);
            steps.push({ time: currentDate.valueOf(), offset: { ms: 0, px: 0 } });
            for (
              let currentDate = dayjs_min_default()(this.state.options.times.firstTime)
                .add(1, this.state.options.times.stepDuration)
                .startOf('day');
              currentDate.valueOf() <= lastMs;
              currentDate = currentDate.add(1, this.state.options.times.stepDuration).startOf('day')
            ) {
              const offsetMs = currentDate.diff(this.state.options.times.firstTime, 'milliseconds'),
                offsetPx = offsetMs / this.state.options.times.timePerPixel,
                step = { time: currentDate.valueOf(), offset: { ms: offsetMs, px: offsetPx } },
                previousStep = steps[steps.length - 1];
              (previousStep.width = {
                ms: offsetMs - previousStep.offset.ms,
                px: offsetPx - previousStep.offset.px,
              }),
                steps.push(step);
            }
            const lastStep = steps[steps.length - 1];
            (lastStep.width = {
              ms: this.state.options.times.totalViewDurationMs - lastStep.offset.ms,
              px: this.state.options.times.totalViewDurationPx - lastStep.offset.px,
            }),
              (this.state.options.times.steps = steps);
          },
          computeCalendarWidths() {
            this.computeDayWidths(), this.computeHourWidths(), this.computeMonthWidths();
          },
          computeHourWidths() {
            const style = {
              ...this.style['calendar-row-text'],
              ...this.style['calendar-row-text--hour'],
            };
            this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];
            const localeName = this.state.options.locale.name;
            let currentDate = dayjs_min_default()('2018-01-01T00:00:00').locale(localeName),
              maxWidths = this.state.options.calendar.hour.maxWidths;
            if (!maxWidths.length) {
              for (let formatName in this.state.options.calendar.hour.format)
                maxWidths[formatName] = 0;
              for (let hour = 0; hour < 24; hour++) {
                let widths = { hour: hour };
                for (let formatName in this.state.options.calendar.hour.format) {
                  const hourFormatted = this.state.options.calendar.hour.format[formatName](
                    currentDate
                  );
                  this.state.options.calendar.hour.formatted[formatName].push(hourFormatted),
                    (widths[formatName] = this.state.ctx.measureText(hourFormatted).width);
                }
                this.state.options.calendar.hour.widths.push(widths);
                for (let formatName in this.state.options.calendar.hour.format)
                  widths[formatName] > maxWidths[formatName] &&
                    (maxWidths[formatName] = widths[formatName]);
                currentDate = currentDate.add(1, 'hour');
              }
            }
          },
          computeDayWidths() {
            const style = {
              ...this.style['calendar-row-text'],
              ...this.style['calendar-row-text--day'],
            };
            this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];
            const localeName = this.state.options.locale.name;
            let currentDate = dayjs_min_default()(this.state.options.times.steps[0].time).locale(
                localeName
              ),
              maxWidths = this.state.options.calendar.day.maxWidths;
            (this.state.options.calendar.day.widths = []),
              Object.keys(this.state.options.calendar.day.format).forEach((formatName) => {
                maxWidths[formatName] = 0;
              });
            for (
              let day = 0, daysLen = this.state.options.times.steps.length;
              day < daysLen;
              day++
            ) {
              const widths = { day: day };
              Object.keys(this.state.options.calendar.day.format).forEach((formatName) => {
                widths[formatName] = this.state.ctx.measureText(
                  this.state.options.calendar.day.format[formatName](currentDate)
                ).width;
              }),
                this.state.options.calendar.day.widths.push(widths),
                Object.keys(this.state.options.calendar.day.format).forEach((formatName) => {
                  widths[formatName] > maxWidths[formatName] &&
                    (maxWidths[formatName] = widths[formatName]);
                }),
                (currentDate = currentDate.add(1, 'day'));
            }
          },
          monthsCount(fromTime, toTime) {
            if (fromTime > toTime) return 0;
            let currentMonth = dayjs_min_default()(fromTime),
              previousMonth = currentMonth.clone(),
              monthsCount = 1;
            for (; currentMonth.valueOf() <= toTime; )
              (currentMonth = currentMonth.add(1, 'day')),
                previousMonth.month() !== currentMonth.month() && monthsCount++,
                (previousMonth = currentMonth.clone());
            return monthsCount;
          },
          computeMonthWidths() {
            const style = {
              ...this.style['calendar-row-text'],
              ...this.style['calendar-row-text--month'],
            };
            this.state.ctx.font = style['font-size'] + ' ' + style['font-family'];
            let maxWidths = this.state.options.calendar.month.maxWidths;
            (this.state.options.calendar.month.widths = []),
              Object.keys(this.state.options.calendar.month.format).forEach((formatName) => {
                maxWidths[formatName] = 0;
              });
            const localeName = this.state.options.locale.name;
            let currentDate = dayjs_min_default()(this.state.options.times.firstTime).locale(
              localeName
            );
            const monthsCount = this.monthsCount(
              this.state.options.times.firstTime,
              this.state.options.times.lastTime
            );
            for (let month = 0; month < monthsCount; month++) {
              const widths = { month: month };
              Object.keys(this.state.options.calendar.month.format).forEach((formatName) => {
                widths[formatName] = this.state.ctx.measureText(
                  this.state.options.calendar.month.format[formatName](currentDate)
                ).width;
              }),
                this.state.options.calendar.month.widths.push(widths),
                Object.keys(this.state.options.calendar.month.format).forEach((formatName) => {
                  widths[formatName] > maxWidths[formatName] &&
                    (maxWidths[formatName] = widths[formatName]);
                }),
                (currentDate = currentDate.add(1, 'month'));
            }
          },
          prepareDates() {
            let firstTaskTime = Number.MAX_SAFE_INTEGER,
              lastTaskTime = 0;
            for (let index = 0, len = this.state.tasks.length; index < len; index++) {
              let task = this.state.tasks[index];
              task.startTime < firstTaskTime && (firstTaskTime = task.startTime),
                task.startTime + task.duration > lastTaskTime &&
                  (lastTaskTime = task.startTime + task.duration);
            }
            (this.state.options.times.firstTaskTime = firstTaskTime),
              (this.state.options.times.lastTaskTime = lastTaskTime),
              (this.state.options.times.firstTime = dayjs_min_default()(firstTaskTime)
                .locale(this.state.options.locale.name)
                .startOf('day')
                .subtract(this.state.options.scope.before, 'days')
                .startOf('day')
                .valueOf()),
              (this.state.options.times.lastTime = dayjs_min_default()(lastTaskTime)
                .locale(this.state.options.locale.name)
                .endOf('day')
                .add(this.state.options.scope.after, 'days')
                .endOf('day')
                .valueOf());
          },
          setup(itsUpdate = '') {
            this.initialize(itsUpdate),
              this.prepareDates(),
              this.initTimes(),
              this.calculateSteps(),
              this.computeCalendarWidths(),
              (this.state.options.taskList.width = this.state.options.taskList.columns.reduce(
                (prev, current) => ({ width: prev.width + current.width }),
                { width: 0 }
              ).width);
          },
          globalOnResize() {
            if (void 0 !== this.$el && this.$el) {
              if (
                ((this.state.options.clientWidth = this.$el.clientWidth),
                this.state.options.taskList.widthFromPercentage >
                  (this.state.options.clientWidth / 100) *
                    this.state.options.taskList.widthThreshold)
              ) {
                let diffPercent =
                  100 -
                  ((this.state.options.taskList.widthFromPercentage -
                    (this.state.options.clientWidth / 100) *
                      this.state.options.taskList.widthThreshold) /
                    this.state.options.taskList.widthFromPercentage) *
                    100;
                diffPercent < 0 && (diffPercent = 0),
                  this.state.options.taskList.columns.forEach((column) => {
                    column.thresholdPercent = diffPercent;
                  });
              } else
                this.state.options.taskList.columns.forEach((column) => {
                  column.thresholdPercent = 100;
                });
              this.calculateTaskListColumnsDimensions(),
                this.$emit('calendar-recalculate'),
                this.syncScrollTop();
            }
          },
        },
        computed: {
          visibleTasks() {
            const visibleTasks = this.state.tasks.filter((task) => this.isTaskVisible(task)),
              maxRows = visibleTasks.slice(0, this.state.options.maxRows);
            this.state.options.rowsHeight = this.getTasksHeight(maxRows);
            let heightCompensation = 0;
            this.state.options.maxHeight &&
              this.state.options.rowsHeight > this.state.options.maxHeight &&
              ((heightCompensation = this.state.options.rowsHeight - this.state.options.maxHeight),
              (this.state.options.rowsHeight = this.state.options.maxHeight)),
              (this.state.options.height = this.getHeight(maxRows) - heightCompensation),
              (this.state.options.allVisibleTasksHeight = this.getTasksHeight(visibleTasks)),
              (this.state.options.outerHeight = this.getHeight(maxRows, !0) - heightCompensation);
            let len = visibleTasks.length;
            for (let index = 0; index < len; index++) {
              let task = visibleTasks[index];
              (task.width =
                task.duration / this.state.options.times.timePerPixel -
                this.style['grid-line-vertical']['stroke-width']),
                task.width < 0 && (task.width = 0),
                (task.height = this.state.options.row.height),
                (task.x = this.timeToPixelOffsetX(task.startTime)),
                (task.y =
                  (this.state.options.row.height +
                    2 * this.state.options.chart.grid.horizontal.gap) *
                    index +
                  this.state.options.chart.grid.horizontal.gap);
            }
            return visibleTasks;
          },
          style() {
            return this.state.dynamicStyle;
          },
          getTaskListColumns() {
            return this.calculateTaskListColumnsDimensions(), this.state.options.taskList.columns;
          },
          outputTasks() {
            return this.state.tasks;
          },
          outputOptions() {
            return this.state.options;
          },
        },
        created() {
          this.initializeEvents(),
            this.setup(),
            (this.state.unwatchTasks = this.$watch(
              'tasks',
              (tasks) => {
                notEqualDeep(tasks, this.outputTasks) && this.setup('tasks');
              },
              { deep: !0 }
            )),
            (this.state.unwatchOptions = this.$watch(
              'options',
              (opts) => {
                notEqualDeep(opts, this.outputOptions) && this.setup('options');
              },
              { deep: !0 }
            )),
            (this.state.unwatchStyle = this.$watch(
              'dynamicStyle',
              (style) => {
                notEqualDeep(style, this.dynamicStyle) && this.initializeStyle();
              },
              { deep: !0, immediate: !0 }
            )),
            (this.state.unwatchOutputTasks = this.$watch(
              'outputTasks',
              (tasks) => {
                this.$emit(
                  'tasks-changed',
                  tasks.map((task) => task)
                );
              },
              { deep: !0 }
            )),
            (this.state.unwatchOutputOptions = this.$watch(
              'outputOptions',
              (options) => {
                this.$emit('options-changed', mergeDeep({}, options));
              },
              { deep: !0 }
            )),
            (this.state.unwatchOutputStyle = this.$watch(
              'style',
              (style) => {
                this.$emit('dynamic-style-changed', mergeDeep({}, style));
              },
              { deep: !0 }
            )),
            this.$root.$emit('gantt-elastic-created', this),
            this.$emit('created', this);
        },
        beforeMount() {
          this.$emit('before-mount', this);
        },
        mounted() {
          (this.state.options.clientWidth = this.$el.clientWidth),
            (this.state.resizeObserver = new ResizeObserver_es.a((entries, observer) => {
              this.globalOnResize();
            })),
            this.state.resizeObserver.observe(this.$el.parentNode),
            this.globalOnResize(),
            this.$emit('ready', this),
            this.$root.$emit('gantt-elastic-mounted', this),
            this.$emit('mounted', this),
            this.$root.$emit('gantt-elastic-ready', this);
        },
        beforeUpdate() {
          this.$emit('before-update');
        },
        updated() {
          this.$nextTick(() => {
            this.$emit('updated');
          });
        },
        beforeDestroy() {
          this.state.resizeObserver.unobserve(this.$el.parentNode),
            this.state.unwatchTasks(),
            this.state.unwatchOptions(),
            this.state.unwatchStyle(),
            this.state.unwatchOutputTasks(),
            this.state.unwatchOutputOptions(),
            this.state.unwatchOutputStyle(),
            this.$emit('before-destroy');
        },
        destroyed() {
          this.$emit('destroyed');
        },
      },
      GanttElastic_component =
        (__webpack_require__(5),
        normalizeComponent(
          src_GanttElasticvue_type_script_lang_js_,
          render,
          [],
          !1,
          null,
          null,
          null
        ));
    GanttElastic_component.options.__file = 'src/GanttElastic.vue';
    var src_GanttElastic = GanttElastic_component.exports,
      GanttElastic_standalonevue_type_template_id_47914d89_render = function () {
        var _vm = this,
          _h = _vm.$createElement,
          _c = _vm._self._c || _h;
        return _c(
          'gantt-elastic',
          { attrs: { tasks: _vm.tasks, options: _vm.options, dynamicStyle: _vm.dynamicStyle } },
          [
            _vm.components.header
              ? _c(_vm.components.header, {
                  tag: 'component',
                  attrs: { slot: 'header' },
                  slot: 'header',
                })
              : _vm._e(),
            _vm._v(' '),
            _vm.components.footer
              ? _c(_vm.components.footer, {
                  tag: 'component',
                  attrs: { slot: 'footer' },
                  slot: 'footer',
                })
              : _vm._e(),
          ],
          1
        );
      };
    GanttElastic_standalonevue_type_template_id_47914d89_render._withStripped = !0;
    var GanttElastic_standalone_component = normalizeComponent(
      {
        name: 'GanttElasticStandalone',
        components: { 'gantt-elastic': src_GanttElastic },
        props: ['header', 'footer'],
        data: { components: {}, tasks: [], options: {}, dynamicStyle: {} },
      },
      GanttElastic_standalonevue_type_template_id_47914d89_render,
      [],
      !1,
      null,
      null,
      null
    );
    GanttElastic_standalone_component.options.__file = 'src/GanttElastic.standalone.vue';
    var GanttElastic_standalone = GanttElastic_standalone_component.exports;
    /**
     * @fileoverview Bundle main entry file
     * @license MIT
     * @author Rafal Pospiech <neuronet.io@gmail.com>
     * @package GanttElasticStandalone
     */ window.GanttElastic = {
      component: GanttElastic_standalone,
      mount(config) {
        const ready = 'function' == typeof config.ready ? config.ready : () => {},
          cfg = mergeDeep({}, config);
        void 0 === cfg.dynamicStyle && (cfg.dynamicStyle = {});
        const ganttElastic = { ...GanttElastic_standalone };
        for (let prop in cfg)
          ['el', 'ready'].includes(prop) ||
            (void 0 === ganttElastic[prop]
              ? (ganttElastic[prop] = cfg[prop])
              : (ganttElastic[prop] = { ...ganttElastic[prop], ...cfg[prop] }));
        return new external_Vue_default.a(ganttElastic)
          .$on('gantt-elastic-ready', ready)
          .$mount(cfg.el);
      },
    };
    __webpack_exports__.default = GanttElastic_standalone;
  },
  function (module, __webpack_exports__, __webpack_require__) {
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
          domStyle.parts.length > item.parts.length && (domStyle.parts.length = item.parts.length);
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
          (update = applyToTag.bind(null, styleElement)),
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
    function applyToTag(styleElement, obj) {
      var css = obj.css,
        media = obj.media,
        sourceMap = obj.sourceMap;
      if (
        (media && styleElement.setAttribute('media', media),
        options.ssrId && styleElement.setAttribute(ssrIdKey, obj.id),
        sourceMap &&
          ((css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'),
          (css +=
            '\n/*# sourceMappingURL=data:application/json;base64,' +
            btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) +
            ' */')),
        styleElement.styleSheet)
      )
        styleElement.styleSheet.cssText = css;
      else {
        for (; styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
        styleElement.appendChild(document.createTextNode(css));
      }
    }
  },
]);
