/**
 * <v-tab>
 * -----------------------------------------------------------------------------
 * tab component
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('vTab', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
    id: { default: null },
    name: { required: true },
    prefix: { default: '' },
    suffix: { default: '' },
    isDisabled: { default: false },
    isSlotIf: { default: true },
    counter: 0,
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      isActive: false,
      isVisible: true,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<section v-show="isActive"
        :aria-hidden="! isActive"
        class="tabs-component-panel"
        :id="computedId"
        role="tabpanel">
        <div v-if="isSlotIf">
          <slot v-if="isActive" />
        </div>
        <div v-else>
          <slot />
        </div>
</section>
    `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    //…
  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {},
  computed: {
    header() {
      if (this.counter > 0) {
        return this.name + `<span class="badge badge-danger tab-badge">${this.counter}</span>`;
      } else if (this.counter > 999) {
        return this.name + `<span class="badge badge-danger tab-badge">↑999</span>`;
      } else {
        return this.prefix + this.name + this.suffix;
      }
    },
    computedId() {
      return this.id ? this.id : this.name.toLowerCase().replace(/ /g, '-');
    },
    hash() {
      if (this.isDisabled) {
        return '#';
      }
      return '#' + this.computedId;
    },
  },
});
