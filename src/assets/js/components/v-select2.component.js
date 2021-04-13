/**
 * <v-select2>
 * -----------------------------------------------------------------------------
 * v-select2-component.
 * <v-select2 v-model="myValue"
 *  :options="myOptions"
 *  :settings="{ settingOption: value, settingOption: value }"
 *  @change="myChangeEvent(val)"
 *  @select="mySelectEvent($event)" />
 *
 * @type {Component}
 *
 * @event change   [emitted when changed]
 * @event select   [emitted when selected]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('vSelect2', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['id', 'name', 'disabled', 'required', 'placeholder', 'options', 'settings', 'value'],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      select2: null,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div>
    <select class="browser-default custom-select custom-select" :id="id" :name="name" :disabled="disabled" :required="required"></select>
  </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    var options = _.extend(this.settings, {
      placeholder: this.placeholder,
      data: this.options,
    });

    this.select2 = $(this.$el)
      .find('select')
      .select2(options)
      .on('select2:select select2:unselect', (ev) => {
        this.$emit('change', this.select2.val());
        this.$emit('select', ev['params']['data']);
      });
    this.setValue(this.value);
  },
  beforeDestroy: function () {
    this.select2.select2('destroy');
  },
  watch: {
    options: function (val) {
      this.setOption(val);
    },
    value: function (val) {
      this.setValue(val);
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    setOption(val = []) {
      var options = _.extend(this.settings, {
        placeholder: this.placeholder,
        data: val,
      });
      this.select2.empty();
      this.select2.select2(options);
      this.setValue(this.value);
    },
    setValue(val) {
      if (val instanceof Array) {
        this.select2.val([...val]);
      } else {
        this.select2.val([val]);
      }
      this.select2.trigger('change');
    },
  },
});
