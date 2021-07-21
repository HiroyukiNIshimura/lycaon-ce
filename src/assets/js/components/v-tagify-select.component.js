/**
 * <v-tagify-select>
 * -----------------------------------------------------------------------------
 * tab component
 *
 * @type {Component}
 *
 * <v-tagify-select id="test-tagify" :values="values" :settings="settings" v-on:add="onAdd" v-on:remove="onRemove" v-on:change="onChange"></v-tagify-select>
 *
 * -----------------------------------------------------------------------------
 */

/* https://github.com/yairEO/tagify */

parasails.registerComponent('vTagifySelect', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['id', 'settings', 'values'], //values [ { value: 'dilply', you need properties },  ]
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      defaultSettings: {
        placeholder: '',
        whitelist: [],
        enforceWhitelist: false,
        editTags: 1,
        maxTags: 10,
        dropdown: {
          maxItems: 50,
          classname: 'tags-look',
          enabled: 0,
          closeOnSelect: false,
        },
      },
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<input :id="computedId">
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    if (this.settings) {
      this.defaultSettings = _.deepExtend({}, this.defaultSettings, this.settings);
    } else {
      this.defaultSettings = _.deepExtend({}, this.defaultSettings);
    }
  },
  mounted: async function () {
    this.tagify = new Tagify(this.$el, this.defaultSettings);

    this.tagify.on('add', this.onAddTag);
    this.tagify.on('remove', this.onRemoveTag);
    //this.tagify.on('input', this.onInput);
    //this.tagify.on('edit', this.onTagEdit);
    //this.tagify.on('invalid', this.onInvalidTag);
  },

  beforeDestroy: function () {
    //…
    this.tagify.destroy();
  },
  watch: {
    values: {
      handler: function (val) {
        var inputs = val.map((o) => {
          return o.value;
        });

        this.tagify.loadOriginalValues(inputs);
        this.$emit('change', val);
      },
      deep: true,
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onAddTag: function (e) {
      var current = this.values.map((o) => {
        return o.value;
      });

      if (current.indexOf(e.detail.data.value) < 0) {
        var data = _.extend({ isManual: true }, e.detail.data);
        this.values.push(data);
        this.$emit('add', e.detail.data);
      }
    },
    onRemoveTag: function (e) {
      var idx = _.findIndex(this.values, (entry) => {
        return entry.value === e.detail.data.value;
      });
      if (idx > -1) {
        this.values.splice(idx, 1);
        this.$emit('remove', e.detail.data);
      }
    },
  },
  computed: {
    computedId: function () {
      if (this.id) {
        return this.id;
      }
      var dt = new Date();
      return 'tagify-' + dt.valueOf();
    },
  },
});
