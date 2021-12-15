/**
 * <v-text-input>
 * -----------------------------------------------------------------------------
 * input wapper
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('vTextInput', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
    type: {
      type: String,
      default: 'text',
    },
    maxlength: {
      type: Number,
      default: Number.MAX_VALUE,
    },
    value: {
      type: String,
      default: '',
    },
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      text: '',
      isPress: false,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<input :type="type" @input="onInput" v-model="text" @keyup.enter="onEnter" @keypress="onKeypress"/>
`,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    this.text = this.value;
  },
  mounted: async function () {},
  beforeDestroy: function () {
    //…
  },
  watch: {
    value: function (val) {
      this.text = val;
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onInput() {
      if (this.length > this.maxlength) {
        this.text = this.letters.splice(0, this.maxlength).join('');
      }
      this.$emit('input', this.text);
    },
    onKeypress() {
      this.isPress = true;
    },
    onEnter(event) {
      if (!this.isPress) {
        return;
      }
      this.$emit('input', this.text);
      this.$emit('keyup', event);
      this.isPress = false;
    },
  },
  computed: {
    letters() {
      return Array.of(...this.text);
    },
    length() {
      return this.letters.length;
    },
  },
});
