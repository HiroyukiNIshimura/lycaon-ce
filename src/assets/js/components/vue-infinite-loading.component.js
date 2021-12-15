/**
 * <infinite-loading>
 *
 * -----------------------------------------------------------------------------
 * infinite-loading
 *　https://github.com/PeachScript/vue-infinite-loading
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

const VIL_STATUS = {
  READY: 0,
  LOADING: 1,
  COMPLETE: 2,
  ERROR: 3,
};
const VIL_SPINNERS = {
  BUBBLES: {
    render(createElement) {
      return createElement(
        'span',
        {
          attrs: {
            class: 'loading-bubbles',
          },
        },
        Array.apply(Array, Array(8)).map(() =>
          createElement('span', {
            attrs: {
              class: 'bubble-item',
            },
          })
        )
      );
    },
  },
  CIRCLES: {
    render(createElement) {
      return createElement(
        'span',
        {
          attrs: {
            class: 'loading-circles',
          },
        },
        Array.apply(Array, Array(8)).map(() =>
          createElement('span', {
            attrs: {
              class: 'circle-item',
            },
          })
        )
      );
    },
  },
  DEFAULT: {
    render(createElement) {
      return createElement('i', {
        attrs: {
          class: 'loading-default',
        },
      });
    },
  },
  SPIRAL: {
    render(createElement) {
      return createElement('i', {
        attrs: {
          class: 'loading-spiral',
        },
      });
    },
  },
  WAVEDOTS: {
    render(createElement) {
      return createElement(
        'span',
        {
          attrs: {
            class: 'loading-wave-dots',
          },
        },
        Array.apply(Array, Array(5)).map(() =>
          createElement('span', {
            attrs: {
              class: 'wave-item',
            },
          })
        )
      );
    },
  },
};

parasails.registerComponent('infiniteLoading', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
    distance: {
      type: Number,
      default: 100,
    },
    spinner: String,
    direction: {
      type: String,
      default: 'bottom',
    },
    forceUseInfiniteWrapper: {
      type: [Boolean, String],
      default: false,
    },
    identifier: {
      default: +new Date(),
    },
    onInfinite: Function,
    results: {
      type: Number,
      default: 0,
    },
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      scrollParent: null,
      scrollHandler: null,
      isFirstLoad: true, // save the current loading whether it is the first loading
      status: VIL_STATUS.READY,
      slots: {
        noResults: '',
        noMore: this.i18n('No more data'),
        error: this.i18n('Opps, something went wrong'),
        errorBtnText: 'Retry',
        spinner: '',
      },
      throttleer: {
        timers: [],
        caches: [],
        throttle(fn) {
          if (this.caches.indexOf(fn) === -1) {
            // cache current handler
            this.caches.push(fn);

            // save timer for current handler
            this.timers.push(
              setTimeout(() => {
                fn();

                // empty cache and timer
                this.caches.splice(this.caches.indexOf(fn), 1);
                this.timers.shift();
              }, 50)
            );
          }
        },
        reset() {
          // reset all timers
          this.timers.forEach((timer) => {
            clearTimeout(timer);
          });
          this.timers.length = 0;

          // empty caches
          this.caches = [];
        },
      },
      loopTracker: {
        isChecked: false,
        timer: null,
        times: 0,
        track() {
          // record track times
          this.times += 1;

          // try to mark check status
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.isChecked = true;
          }, 1000);

          // throw warning if the times of continuous calls large than the maximum times
          if (this.times > 10) {
            console.log('ERRORS.INFINITE_LOOP');
            this.isChecked = true;
          }
        },
      },
      scrollBarStorage: {
        key: '_infiniteScrollHeight',
        getScrollElm(elm) {
          return elm === window ? document.documentElement : elm;
        },
        save(elm) {
          const target = this.getScrollElm(elm);

          // save scroll height on the scroll parent
          target[this.key] = target.scrollHeight;
        },
        restore(elm) {
          const target = this.getScrollElm(elm);

          /* istanbul ignore else */
          if (typeof target[this.key] === 'number') {
            target.scrollTop = target.scrollHeight - target[this.key] + target.scrollTop;
          }

          this.remove(target);
        },
        remove(elm) {
          if (elm[this.key] !== undefined) {
            // remove scroll height
            delete elm[this.key];
          }
        },
      },
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div class="infinite-loading-container">
    <div class="infinite-status-prompt" v-show="isShowSpinner" :style="slotStyles.spinner">
      <slot name="spinner" v-bind="{ isFirstLoad }">
        <component :is="spinnerView"></component>
      </slot>
    </div>
    <div class="infinite-status-prompt" :style="slotStyles.noResults" v-show="isShowNoResults">
      <slot name="no-results">
        <component v-if="slots.noResults.render" :is="slots.noResults"></component>
        <template v-else>{{ slots.noResults }}</template>
      </slot>
    </div>
    <div class="infinite-status-prompt" :style="slotStyles.noMore" v-show="isShowNoMore">
      <slot name="no-more">
        <component v-if="slots.noMore.render" :is="slots.noMore"></component>
        <template v-else>{{ slots.noMore }}</template>
      </slot>
    </div>
    <div class="infinite-status-prompt" :style="slotStyles.error" v-show="isShowError">
      <slot name="error" :trigger="attemptLoad">
        <component v-if="slots.error.render" :is="slots.error" :trigger="attemptLoad">
        </component>
        <template v-else>
          {{ slots.error }}
          <br>
          <button class="btn-try-infinite" @click="attemptLoad" v-text="slots.errorBtnText">
          </button>
        </template>
      </slot>
    </div>
  </div>
  `,
  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  /**
   * To adapt to keep-alive feature, but only work on Vue 2.2.0 and above, see: https://vuejs.org/v2/api/#keep-alive
   */
  deactivated() {
    /* istanbul ignore else */
    if (this.status === VIL_STATUS.LOADING) {
      this.status = VIL_STATUS.READY;
    }
    this.scrollParent.removeEventListener('scroll', this.scrollHandler, this.evt3rdArg);
  },
  activated() {
    this.scrollParent.addEventListener('scroll', this.scrollHandler, this.evt3rdArg);
  },
  beforeMount: function () {},
  mounted: async function () {
    this.$watch(
      'forceUseInfiniteWrapper',
      () => {
        this.scrollParent = this.getScrollParent();
      },
      { immediate: true }
    );
    this.scrollHandler = (ev) => {
      if (this.status === VIL_STATUS.READY) {
        if (ev && ev.constructor === Event && this.isVisible(this.$el)) {
          this.throttleer.throttle(this.attemptLoad);
        } else {
          this.attemptLoad();
        }
      }
    };
    setTimeout(() => {
      this.scrollHandler();
      this.scrollParent.addEventListener('scroll', this.scrollHandler, this.evt3rdArg);
    }, 1);
    this.$on('$InfiniteLoading:loaded', (ev) => {
      this.isFirstLoad = false;
      if (this.direction === 'top') {
        // wait for DOM updated
        this.$nextTick(() => {
          this.scrollBarStorage.restore(this.scrollParent);
        });
      }
      if (this.status === VIL_STATUS.LOADING) {
        this.$nextTick(this.attemptLoad.bind(null, true));
      }
      if (!ev || ev.target !== this) {
        console.log('WARNINGS.STATE_CHANGER');
      }
    });
    this.$on('$InfiniteLoading:complete', (ev) => {
      this.status = VIL_STATUS.COMPLETE;
      // force re-complation computed properties to fix the problem of get slot text delay
      this.$nextTick(() => {
        this.$forceUpdate();
      });
      this.scrollParent.removeEventListener('scroll', this.scrollHandler, this.evt3rdArg);
      if (!ev || ev.target !== this) {
        console.log('WARNINGS.STATE_CHANGER');
      }
    });
    this.$on('$InfiniteLoading:reset', (ev) => {
      this.status = VIL_STATUS.READY;
      this.isFirstLoad = true;
      this.scrollBarStorage.remove(this.scrollParent);
      this.scrollParent.addEventListener('scroll', this.scrollHandler, this.evt3rdArg);
      // wait for list to be empty and the empty action may trigger a scroll event
      setTimeout(() => {
        this.throttleer.reset();
        this.scrollHandler();
      }, 1);
      if (!ev || ev.target !== this) {
        console.log('WARNINGS.IDENTIFIER');
      }
    });
    /**
     * change state for this component, pass to the callback
     */
    this.stateChanger = {
      loaded: () => {
        this.$emit('$InfiniteLoading:loaded', { target: this });
      },
      complete: () => {
        this.$emit('$InfiniteLoading:complete', { target: this });
      },
      reset: () => {
        this.$emit('$InfiniteLoading:reset', { target: this });
      },
      error: () => {
        this.status = VIL_STATUS.ERROR;
        this.throttleer.reset();
      },
    };
    if (this.onInfinite) {
      console.log('WARNINGS.INFINITE_EVENT');
    }
  },
  beforeDestroy: function () {
    /* istanbul ignore else */
    if (!this.status !== VIL_STATUS.COMPLETE) {
      this.throttleer.reset();
      this.scrollBarStorage.remove(this.scrollParent);
      this.scrollParent.removeEventListener('scroll', this.scrollHandler, this.evt3rdArg);
    }
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    /**
     * attempt trigger load
     * @param {Boolean} isContinuousCall  the flag of continuous call, it will be true
     *                                    if this method be called in the `loaded`
     *                                    event handler
     */
    attemptLoad(isContinuousCall) {
      if (
        this.status !== VIL_STATUS.COMPLETE &&
        this.isVisible(this.$el) &&
        this.getCurrentDistance() <= this.distance
      ) {
        this.status = VIL_STATUS.LOADING;
        if (this.direction === 'top') {
          // wait for spinner display
          this.$nextTick(() => {
            this.scrollBarStorage.save(this.scrollParent);
          });
        }
        if (typeof this.onInfinite === 'function') {
          this.onInfinite.call(null, this.stateChanger);
        } else {
          this.$emit('infinite', this.stateChanger);
        }
        if (isContinuousCall && !this.forceUseInfiniteWrapper && !this.loopTracker.isChecked) {
          // check this component whether be in an infinite loop if it is not checked
          // more details: https://github.com/PeachScript/vue-infinite-loading/issues/55#issuecomment-316934169
          this.loopTracker.track();
        }
      } else if (this.status === VIL_STATUS.LOADING) {
        this.status = VIL_STATUS.READY;
      }
    },
    /**
     * get current distance from the specified direction
     * @return {Number}     distance
     */
    getCurrentDistance() {
      let distance;
      if (this.direction === 'top') {
        distance =
          typeof this.scrollParent.scrollTop === 'number' ? this.scrollParent.scrollTop : this.scrollParent.pageYOffset;
      } else {
        const infiniteElmOffsetTopFromBottom = this.$el.getBoundingClientRect().top;
        const scrollElmOffsetTopFromBottom =
          this.scrollParent === window ? window.innerHeight : this.scrollParent.getBoundingClientRect().bottom;
        distance = infiniteElmOffsetTopFromBottom - scrollElmOffsetTopFromBottom;
      }
      return distance;
    },
    /**
     * get the first scroll parent of an element
     * @param  {DOM} elm    cache element for recursive search
     * @return {DOM}        the first scroll parent
     */
    getScrollParent(elm = this.$el) {
      let result;
      if (typeof this.forceUseInfiniteWrapper === 'string') {
        result = document.querySelector(this.forceUseInfiniteWrapper);
      }
      if (!result) {
        if (elm.tagName === 'BODY') {
          result = window;
        } else if (!this.forceUseInfiniteWrapper && ['scroll', 'auto'].indexOf(getComputedStyle(elm).overflowY) > -1) {
          result = elm;
        } else if (elm.hasAttribute('infinite-wrapper') || elm.hasAttribute('data-infinite-wrapper')) {
          result = elm;
        }
      }
      return result || this.getScrollParent(elm.parentNode);
    },
    evt3rdArg: function () {
      let result = false;

      try {
        const arg = Object.defineProperty({}, 'passive', {
          get() {
            result = { passive: true };
            return true;
          },
        });

        window.addEventListener('testpassive', arg, arg);
        window.remove('testpassive', arg, arg);
      } catch (e) {
        console.log(e);
      }

      return result;
    },
    kebabCase: function (str) {
      return str.replace(/[A-Z]/g, (s) => `-${s.toLowerCase()}`);
    },
    isVisible: function (elm) {
      return elm.offsetWidth + elm.offsetHeight > 0;
    },
  },
  watch: {
    identifier() {
      this.stateChanger.reset();
    },
  },
  computed: {
    isShowSpinner() {
      return this.status === VIL_STATUS.LOADING;
    },
    isShowError() {
      return this.status === VIL_STATUS.ERROR;
    },
    isShowNoResults() {
      return this.status === VIL_STATUS.COMPLETE && this.isFirstLoad;
    },
    isShowNoMore() {
      return this.status === VIL_STATUS.COMPLETE && !this.isFirstLoad;
    },
    slotStyles() {
      var self = this;
      const styles = {};
      Object.keys(this.slots).forEach((key) => {
        const name = self.kebabCase(key);
        if (
          // no slot and the configured default slot is not a Vue component
          (!this.$slots[name] && !self.slots[key].render) ||
          // has slot and slot is pure text node
          (this.$slots[name] && !this.$slots[name][0].tag)
        ) {
          // only apply default styles for pure text slot
          styles[key] = {
            color: '#666',
            fontSize: '14px',
            padding: '10px 0',
          };
        }
      });
      return styles;
    },
    spinnerView() {
      return VIL_SPINNERS[(this.$attrs.spinner || '').toUpperCase()];
    },
  },
});
