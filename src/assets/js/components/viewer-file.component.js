/**
 * <viewer-file>
 * -----------------------------------------------------------------------------
 * tab component
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('viewerFile', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['appendix', 'organization', 'downloadAppendix'],
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      dateAgo: $lycaon.formatter.dateAgo,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div class="container mt-4">
  <div class="row">
    <div class="col-sm-auto">
      <button type="button" class="btn btn-default btn-sm btn-block" data-toggle="collapse" data-target="#wrapper-appendix" aria-expand="false"
        aria-controls="wrapper-appendix">
        <i class="fas fa-cloud-upload-alt"></i> {{ i18n("List of attached files") }}<span class="badge badge-light ml-2"
          v-if="appendix.length > 0">{{ appendix.length }}</span>
      </button>
    </div>
  </div>
  <div class="collapse mt-3" id="wrapper-appendix">
    <div class="row">
      <div class="col">
        <ul class="file-list">
          <li v-for="(item, index) in appendix">
            <small>
              <i class="fas fa-paperclip"></i>
              <a class="mr-2" :href="downloadAppendix(item, index)" rel="noopener">{{ item.name }} <i class="fas fa-cloud-download-alt fa-lg"></i></a> <lycaon-timestamp :at="item.createdAt" format="timeago" :translator="translator"></lycaon-timestamp>
              <user-identity :user="item.owner" :organization="organization" size="sm"></user-identity>
              {{ i18n("Attached file") }}
            </small>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <span class="align-middle" data-toggle="tooltip" data-placement="top" :title="item.name"v-for="(item, index) in appendix">
        <a :href="item.virtualUrl" rel="noopener" :target="fileLinksTarget(item)">
          <img class="img-fluid img-file-list" :src="item.virtualUrlSmall" v-if="item.mimeType.startsWith('image')">
          <i class="far fa-file-word fa-4x mr-1" v-else-if="item.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'"></i>
          <i class="far fa-file-excel fa-4x mr-1" v-else-if="item.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"></i>
          <i class="far fa-file-powerpoint fa-4x mr-1" v-else-if="item.mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'"></i>
          <i class="far fa-file-pdf fa-4x mr-1" v-else-if="item.mimeType === 'application/pdf'"></i>
          <i class="far fa-file-archive fa-4x mr-1" v-else-if="item.mimeType === 'application/zip'"></i>
          <i class="far fa-file-video fa-4x mr-1" v-else-if="item.mimeType.startsWith('video')"></i>
          <i class="far fa-file fa-4x mr-1" v-else></i>
        </a>
      </span>
    </div>
  </div>
</div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    //
  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    fileLinksTarget: function (item) {
      if (item.mimeType.startsWith('application')) {
        return '';
      }
      return '_blank';
    },
    translator: function (val) {
      return this.i18n('At {0},', [val]);
    },
  },
  computed: {
    images: function () {
      return _.filter(this.appendix, (o) => {
        return o.mimeType.startsWith('image');
      });
    },
  },
});
