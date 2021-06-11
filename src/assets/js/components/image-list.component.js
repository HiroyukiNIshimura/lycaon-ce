/**
 * <image-list>
 * -----------------------------------------------------------------------------
 * image list.
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('imageList', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['onHide', 'show'],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      images: [],
      page: 1,
      records: 0,
      state: true,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div>
<modal class="image-list" v-if="show">
    <div class="modal-header">
        <h5 class="modal-title">
            {{ i18n('Image list') }}
        </h5>
        <button type="button" class="close" @click="onHide">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="text-center mb-3 d-block d-sm-none" v-if="state">
      <button class="btn btn-light btn-sm btn-block" type="button" @click="infineHandler">{{ i18n('See more') }}</button>
    </div>
    <div class="modal-body">
      <div class="card-columns" v-if="records > 0">
        <div class="card card-image card-selectable" v-for="item in images"  @click="selectImage(item)">
          <img :src="imageRef(item)" class="card-img-top" />
          <div class="card-img-overlay">
            <p class="text-white">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="text-center mt-1" v-if="state">
        <button class="btn btn-light btn-sm btn-block" type="button" @click="infineHandler">{{ i18n('See more') }}</button>
      </div>
    </div>
</modal>
</div>
`,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function () {
    //
  },
  mounted: async function () {
    //…
  },
  beforeDestroy: function () {
    //
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    load: async function () {
      try {
        this.page = 1;
        this.state = true;

        var response = await $lycaon.axios.get(`/appendixes/${this.page}`, {});
        this.page++;
        this.records = response.data.records;
        this.images = response.data.data;
      } catch (err) {
        console.log(err);
      }
    },
    infineHandler: async function () {
      try {
        var response = await $lycaon.axios.get(`/appendixes/${this.page}`, {});
        //"id", "virtualUrl", "virtualUrlMid", "virtualUrlSmall", "hashName", "size", "mimeType", 'thread' as parent
        if (response.data.data.length > 0) {
          this.page++;
          this.images.push(...response.data.data);
        } else {
          this.state = false;
        }
      } catch (err) {
        console.log(err);
      }
    },
    imageRef: function (item) {
      return item.virtualUrlSmall;
    },
    selectImage: function (item) {
      this.$emit('selected', item);
    },
  },
  computed: {
    //
  },
});
