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
      popStatus: {},
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div class="container mt-4">
  <div class="row">
    <div class="col-sm-auto">
      <button type="button" class="btn btn-default btn-sm btn-block" data-toggle="collapse"
        data-target="#wrapper-appendix" aria-expand="false" aria-controls="wrapper-appendix">
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
              <a class="mr-2" :href="downloadAppendix(item, index)" rel="noopener" :aria-label="item.name"
                data-microtip-position="top" data-microtip-size="medium" role="tooltip">{{ truncate(item.name, 24) }} <i
                  class="fas fa-cloud-download-alt fa-lg"></i></a>
              <lycaon-timestamp :at="item.createdAt" format="timeago" :translator="translator"></lycaon-timestamp>
              <user-identity :user="item.owner" :organization="organization" size="sm"  v-on:icon-click="onIdentityIconClick" :pop-status="popStatus"></user-identity>
              {{ i18n("Attached file") }}
            </small>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <span class="align-middle" :aria-label="item.name" data-microtip-position="top" data-microtip-size="medium"
        role="tooltip" v-for="(item, index) in appendix">
        <a href="javascript:void(0)" rel="noopener">
          <img class="img-fluid img-file-list" :src="item.virtualUrlSmall" :data-source-image="item.virtualUrl" v-if="item.mimeType.startsWith('image')">
          <i class="far fa-file-word fa-3x mr-1"
            v-else-if="item.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'"></i>
          <i class="far fa-file-excel fa-3x mr-1"
            v-else-if="item.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"></i>
          <i class="far fa-file-powerpoint fa-3x mr-1"
            v-else-if="item.mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'"></i>
          <i class="far fa-file-pdf fa-3x mr-1" v-else-if="item.mimeType === 'application/pdf'"></i>
          <i class="far fa-file-archive fa-3x mr-1" v-else-if="item.mimeType === 'application/zip'"></i>
          <i class="far fa-file-video fa-3x mr-1" v-else-if="item.mimeType.startsWith('video')"></i>
          <i class="far fa-file fa-3x mr-1" v-else></i>
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
    var self = this;
    $('body').on('click', (e) => {
      if ($('.user-avater-icon').has(e.target).length > 0) {
      } else {
        self.popStatus = '';
      }
    });
  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    translator: function (val) {
      return this.i18n('At {0},', [val]);
    },
    truncate: function (text, length) {
      var chars = Array.from(text);
      if (chars.length < length) {
        return text;
      }
      return chars.slice(0, length).join('') + '...';
    },
    onIdentityIconClick: function (popInfo) {
      this.popStatus = popInfo.id;
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
