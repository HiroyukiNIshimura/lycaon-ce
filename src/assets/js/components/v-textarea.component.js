/**
 * <v-textarea>
 * -----------------------------------------------------------------------------
 * textarea wapper
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('vTextarea', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
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
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<textarea @input="onInput" v-model="text" @focus="onEditorFocus" @blur="onEditorBlur"></textarea>
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
    onEditorFocus(event) {
      this.$emit('focus', event);
    },
    onEditorBlur(event) {
      this.$emit('blur', event);
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
