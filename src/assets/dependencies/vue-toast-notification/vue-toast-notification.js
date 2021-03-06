!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(require('vue')))
    : 'function' == typeof define && define.amd
    ? define('VueToast', ['vue'], t)
    : 'object' == typeof exports
    ? (exports.VueToast = t(require('vue')))
    : (e.VueToast = t(e.Vue));
})('undefined' != typeof self ? self : this, function (e) {
  return (function (e) {
    var t = {};
    function s(o) {
      if (t[o]) return t[o].exports;
      var n = (t[o] = { i: o, l: !1, exports: {} });
      return e[o].call(n.exports, n, n.exports, s), (n.l = !0), n.exports;
    }
    return (
      (s.m = e),
      (s.c = t),
      (s.d = function (e, t, o) {
        s.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
      }),
      (s.r = function (e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (s.t = function (e, t) {
        if ((1 & t && (e = s(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var o = Object.create(null);
        if (
          (s.r(o),
          Object.defineProperty(o, 'default', { enumerable: !0, value: e }),
          2 & t && 'string' != typeof e)
        )
          for (var n in e)
            s.d(
              o,
              n,
              function (t) {
                return e[t];
              }.bind(null, n)
            );
        return o;
      }),
      (s.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return s.d(t, 'a', t), t;
      }),
      (s.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (s.p = ''),
      s((s.s = 3))
    );
  })([
    function (t, s) {
      t.exports = e;
    },
    ,
    ,
    function (e, t, s) {
      'use strict';
      s.r(t),
        s.d(t, 'Component', function () {
          return a;
        }),
        s.d(t, 'Positions', function () {
          return n;
        });
      class o {
        constructor(e, t) {
          (this.startedAt = Date.now()),
            (this.callback = e),
            (this.delay = t),
            (this.timer = setTimeout(e, t));
        }
        pause() {
          this.stop(), (this.delay -= Date.now() - this.startedAt);
        }
        resume() {
          this.stop(),
            (this.startedAt = Date.now()),
            (this.timer = setTimeout(this.callback, this.delay));
        }
        stop() {
          clearTimeout(this.timer);
        }
      }
      var n = Object.freeze({
          TOP_RIGHT: 'top-right',
          TOP: 'top',
          TOP_LEFT: 'top-left',
          BOTTOM_RIGHT: 'bottom-right',
          BOTTOM: 'bottom',
          BOTTOM_LEFT: 'bottom-left',
        }),
        i = s(0);
      var r = new (s.n(i).a)();
      var a = (function (e, t, s, o, n, i, r, a) {
        var u,
          c = 'function' == typeof e ? e.options : e;
        if (
          (t && ((c.render = t), (c.staticRenderFns = s), (c._compiled = !0)),
          o && (c.functional = !0),
          i && (c._scopeId = 'data-v-' + i),
          r
            ? ((u = function (e) {
                (e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)) ||
                  'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                  (e = __VUE_SSR_CONTEXT__),
                  n && n.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(r);
              }),
              (c._ssrRegister = u))
            : n &&
              (u = a
                ? function () {
                    n.call(this, (c.functional ? this.parent : this).$root.$options.shadowRoot);
                  }
                : n),
          u)
        )
          if (c.functional) {
            c._injectStyles = u;
            var l = c.render;
            c.render = function (e, t) {
              return u.call(t), l(e, t);
            };
          } else {
            var p = c.beforeCreate;
            c.beforeCreate = p ? [].concat(p, u) : [u];
          }
        return { exports: e, options: c };
      })(
        {
          name: 'toast',
          props: {
            message: { type: String, required: !0 },
            type: { type: String, default: 'success' },
            position: {
              type: String,
              default: n.BOTTOM_RIGHT,
              validator: (e) => Object.values(n).includes(e),
            },
            duration: { type: Number, default: 3e3 },
            dismissible: { type: Boolean, default: !0 },
            onClose: { type: Function, default: () => {} },
            onClick: { type: Function, default: () => {} },
            queue: Boolean,
            pauseOnHover: { type: Boolean, default: !0 },
          },
          data: () => ({ isActive: !1, parentTop: null, parentBottom: null, isHovered: !1 }),
          beforeMount() {
            this.setupContainer();
          },
          mounted() {
            this.showNotice(), r.$on('toast.clear', this.close);
          },
          methods: {
            setupContainer() {
              if (
                ((this.parentTop = document.querySelector('.v-notices.is-top')),
                (this.parentBottom = document.querySelector('.v-notices.is-bottom')),
                this.parentTop && this.parentBottom)
              )
                return;
              this.parentTop ||
                ((this.parentTop = document.createElement('div')),
                (this.parentTop.className = 'v-notices is-top')),
                this.parentBottom ||
                  ((this.parentBottom = document.createElement('div')),
                  (this.parentBottom.className = 'v-notices is-bottom'));
              const e = document.body;
              e.appendChild(this.parentTop), e.appendChild(this.parentBottom);
            },
            shouldQueue() {
              return (
                !!this.queue &&
                (this.parentTop.childElementCount > 0 || this.parentBottom.childElementCount > 0)
              );
            },
            close() {
              this.timer.stop(),
                clearTimeout(this.queueTimer),
                (this.isActive = !1),
                setTimeout(() => {
                  var e;
                  this.onClose.apply(null, arguments),
                    this.$destroy(),
                    void 0 !== (e = this.$el).remove ? e.remove() : e.parentNode.removeChild(e);
                }, 150);
            },
            showNotice() {
              this.shouldQueue()
                ? (this.queueTimer = setTimeout(this.showNotice, 250))
                : (this.correctParent.insertAdjacentElement('afterbegin', this.$el),
                  (this.isActive = !0),
                  (this.timer = new o(this.close, this.duration)));
            },
            whenClicked() {
              this.dismissible && (this.onClick.apply(null, arguments), this.close());
            },
            toggleTimer(e) {
              this.pauseOnHover && (e ? this.timer.pause() : this.timer.resume());
            },
          },
          computed: {
            correctParent() {
              switch (this.position) {
                case n.TOP:
                case n.TOP_RIGHT:
                case n.TOP_LEFT:
                  return this.parentTop;
                case n.BOTTOM:
                case n.BOTTOM_RIGHT:
                case n.BOTTOM_LEFT:
                  return this.parentBottom;
              }
            },
            transition() {
              switch (this.position) {
                case n.TOP:
                case n.TOP_RIGHT:
                case n.TOP_LEFT:
                  return { enter: 'fadeInDown', leave: 'fadeOut' };
                case n.BOTTOM:
                case n.BOTTOM_RIGHT:
                case n.BOTTOM_LEFT:
                  return { enter: 'fadeInUp', leave: 'fadeOut' };
              }
            },
          },
          beforeDestroy() {
            r.$off('toast.clear', this.close);
          },
        },
        function () {
          var e = this,
            t = e.$createElement,
            s = e._self._c || t;
          return s(
            'transition',
            {
              attrs: {
                'enter-active-class': e.transition.enter,
                'leave-active-class': e.transition.leave,
              },
            },
            [
              s(
                'div',
                {
                  directives: [
                    { name: 'show', rawName: 'v-show', value: e.isActive, expression: 'isActive' },
                  ],
                  staticClass: 'v-toast',
                  class: ['v-toast-' + e.type, 'is-' + e.position],
                  attrs: { role: 'alert' },
                  on: {
                    mouseover: function (t) {
                      return e.toggleTimer(!0);
                    },
                    mouseleave: function (t) {
                      return e.toggleTimer(!1);
                    },
                    click: e.whenClicked,
                  },
                },
                [
                  s('div', { staticClass: 'v-toast-icon' }),
                  e._v(' '),
                  s('p', { staticClass: 'v-toast-text', domProps: { innerHTML: e._s(e.message) } }),
                ]
              ),
            ]
          );
        },
        [],
        !1,
        null,
        null,
        null
      ).exports;
      var u = (e, t = {}) => ({
        open(s) {
          let o;
          'string' == typeof s && (o = s);
          const n = { message: o },
            i = Object.assign({}, n, t, s);
          return new (e.extend(a))({ el: document.createElement('div'), propsData: i });
        },
        clear() {
          r.$emit('toast.clear');
        },
        success(e, t = {}) {
          return this.open(Object.assign({}, { message: e, type: 'success' }, t));
        },
        error(e, t = {}) {
          return this.open(Object.assign({}, { message: e, type: 'error' }, t));
        },
        info(e, t = {}) {
          return this.open(Object.assign({}, { message: e, type: 'info' }, t));
        },
        warning(e, t = {}) {
          return this.open(Object.assign({}, { message: e, type: 'warning' }, t));
        },
        default(e, t = {}) {
          return this.open(Object.assign({}, { message: e, type: 'default' }, t));
        },
      });
      a.install = (e, t = {}) => {
        let s = u(e, t);
        (e.$toast = s), (e.prototype.$toast = s);
      };
      t.default = a;
    },
  ]).default;
});
