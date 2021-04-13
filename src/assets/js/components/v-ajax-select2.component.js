/**
 * <v-ajax-select2>
 * -----------------------------------------------------------------------------
 * v-ajax-select2-component.
 * <v-ajax-select2 v-model="myValue"
 *  :url="api url"
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

parasails.registerComponent('vAjaxSelect2', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['id', 'name', 'disabled', 'required', 'placeholder', 'url', 'settings', 'value'],

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
      minimumInputLength: 1,
      maximumInputLength: 10,
      ajax: {
        url: this.url,
        data: function (params) {
          var query = {
            search: params.term,
            page: params.page || 1,
          };

          // Query parameters will be ?search=[term]&page=[page]
          return query;
        },
      },
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
    value: function (val) {
      this.setValue(val);
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    setValue(val) {
      if (val instanceof Array) {
        this.select2.val(val);
      } else {
        this.select2.val([val]);
      }
      this.select2.trigger('change');
    },
  },
});
