/**
 * <v-tagify>
 * -----------------------------------------------------------------------------
 * tab component
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('vTagify', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
    mode: { default: '' },
    settings: {},
    initialValue: '',
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      tagify: {},
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<textarea :name="computedId" v-if="mode === 'textarea'" :tagify="tagify">{{ initialValue ? initialValue : '' }}</textarea>
<input :name="computedId" v-else :value="initialValue" :tagify="tagify">
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    this.tagify = new Tagify(this.$el, this.settings);

    this.tagify.on('add', this.onAddTag);
    this.tagify.on('remove', this.onRemoveTag);
    //this.tagify.on('input', this.onInput);
    //this.tagify.on('edit', this.onTagEdit);
    //this.tagify.on('invalid', this.onInvalidTag);
  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onAddTag: function (e) {
      this.$emit('add', e);
    },
    onRemoveTag: function (e) {
      this.$emit('remove', e);
    },
    addTags: function (data) {
      this.tagify.addTags(data);
    },
    removeAllTags: function () {
      this.tagify.removeAllTags();
    },
  },
  computed: {
    computedId: function () {
      var dt = new Date();
      return 'tagify-' + dt.valueOf();
    },
  },
});
