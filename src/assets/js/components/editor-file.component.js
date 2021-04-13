/**
 * <editor-file>
 * -----------------------------------------------------------------------------
 * tab component
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('editorFile', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'appendix',
    'organization',
    'mode',
    'deleteAppendix',
    'downloadAppendix',
    'whitelist',
    'addImage',
    'isUploading',
    'planlimitation',
    'title',
    'isDemosite',
    'hiddenUpload',
    'closed',
  ],
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      formatter: formatter,
      dateAgo: $lycaon.formatter.dateAgo,
      formatDate: $lycaon.formatter.formatDate,
      showDeleteModal: false,
      selectedItem: {},
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div class="container mt-4">
 <modal v-if="showDeleteModal">
    <div class="card">
      <div class="card-header">{{ i18n("Confirmation dialog") }}</div>
      <div class="card-body">
        <h5 class="card-title">{{ i18n("Confirmation of file deletion") }}</h5>
        <p class="card-text">{{ i18n("Delete the attachment. Is it OK?") }}</p>
        <div class="text-right">
          <button type="button" class="btn btn-danger btn-sm" @click="onDelete">
            <i class="far fa-trash-alt"></i> {{ i18n("Delete") }}
          </button>
          <button type="button" class="btn btn-light btn-sm" @click="showDeleteModal = false">
            <i class="fas fa-window-close"></i> {{ i18n("Cancel") }}
          </button>
        </div>
      </div>
    </div>
  </modal>
  <div class="row align-items-center">
    <div class="col-md-auto">
      <button type="button" class="btn btn-default btn-sm btn-block" data-toggle="collapse" data-target="#wrapper-appendix" aria-expand="true" aria-controls="wrapper-appendix">
      <i class="fas fa-cloud-upload-alt"></i> {{ i18n("List of attached files") }}<span class="badge badge-light ml-2"
          v-if="appendix.length > 0">{{ appendix.length }}</span>
      </button>
    </div>
    <div class="col-md-2 mt-2 mt-md-0" v-if="showFileUsage">
      <small class="text-muted">{{ i18n('number of files')}}</small>
      <div class="progress" style="height: 2px;">
        <div class="progress-bar bg-success" role="progressbar" :style="fileUsageStyle" :aria-valuenow="fileUsage" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div class="col-md-2 mt-2 mt-md-0" v-if="showFileSizeUsage">
      <small class="text-muted">{{ i18n('size')}}</small>
      <div class="progress" style="height: 2px;">
        <div class="progress-bar" role="progressbar" :style="fileSizeUsageStyle" :aria-valuenow="fileSizeUsage" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
  <div class="collapse mt-4" :class="isShow" id="wrapper-appendix">
        <div class="row">
            <div class="col">
            <ul class="file-list">
                <li v-for="(item, index) in appendix">
                    <small v-if="mode === 'update'">
                        <i class="fas fa-paperclip"></i>
                        <a class="mr-2" :href="downloadAppendix(item, index)" rel="noopener">{{ item.name }} <i class="fas fa-cloud-download-alt fa-lg"></i></a> <lycaon-timestamp :at="item.createdAt" format="timeago" :translator="translator"></lycaon-timestamp>
                        <user-identity :user="item.owner" :organization="organization" size="sm"></user-identity>
                        {{ i18n("Attached file") }}
                        <a href="javascript:void(0)" @click="showDeleteDialog(item, index)"><i class="far fa-trash-alt"></i></a>
                    </small>
                    <small v-else>
                    <i class="fas fa-paperclip"></i>
                    {{ item.name }} / {{ formatter.format(item.size) }}{{ i18n("byte") }}
                        <a href="javascript:void(0)" @click="showDeleteDialog(item, index)"><i class="far fa-trash-alt"></i></a>
                    </small>
                </li>
            </ul>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col"><small class="text-muted">{{ limitation }}</small></div>
        </div>
        <div class="row mt-3" v-if="!hiddenUpload">
            <drop-fileupload :whitelist="whitelist" :callback="addImage" :is-uploading="isUploading"></drop-fileupload>
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
    showDeleteDialog: function (item, index) {
      this.selectedItem = { item: item, index: index };
      this.showDeleteModal = true;
    },
    onDelete: function () {
      this.showDeleteModal = false;
      if (this.selectedItem.item && _.isFunction(this.deleteAppendix)) {
        this.deleteAppendix(this.selectedItem.item, this.selectedItem.index);
      }
    },
    translator: function (val) {
      return this.i18n('At {0},', [val]);
    },
  },
  computed: {
    isShow: function () {
      if (this.closed) {
        return '';
      }
      if (this.mode === 'update') {
        return '';
      }
      return 'show';
    },
    showFileUsage: function () {
      if (this.title === 'thread') {
        if (this.planlimitation.maxFilePerThread) {
          return true;
        }
      }
      if (this.title === 'wiki') {
        if (this.planlimitation.maxFilePerWiki) {
          return true;
        }
      }
      if (this.title === 'vote') {
        if (this.planlimitation.maxFilePerVote) {
          return true;
        }
      }
      return false;
    },
    fileUsage: function () {
      if (this.title === 'thread') {
        if (this.planlimitation.maxFilePerThread) {
          return (this.appendix.length / this.planlimitation.maxFilePerThread) * 100;
        }
      }
      if (this.title === 'wiki') {
        if (this.planlimitation.maxFilePerWiki) {
          return (this.appendix.length / this.planlimitation.maxFilePerWiki) * 100;
        }
      }
      if (this.title === 'vote') {
        if (this.planlimitation.maxFilePerVote) {
          return (this.appendix.length / this.planlimitation.maxFilePerVote) * 100;
        }
      }
      return 0;
    },
    fileUsageStyle: function () {
      return `width: ${this.fileUsage}%`;
    },
    showFileSizeUsage: function () {
      if (this.title === 'thread') {
        if (this.planlimitation.maxSizePerThread) {
          return true;
        }
      }
      if (this.title === 'wiki') {
        if (this.planlimitation.maxSizePerWiki) {
          return true;
        }
      }
      if (this.title === 'vote') {
        if (this.planlimitation.maxSizePerVote) {
          return true;
        }
      }
      return false;
    },
    fileSizeUsage: function () {
      var total = 0;
      for (let entry of this.appendix) {
        total += entry.size;
      }
      if (this.title === 'thread') {
        if (this.planlimitation.maxSizePerThread) {
          return (total / this.planlimitation.maxSizePerThread) * 100;
        }
      }
      if (this.title === 'wiki') {
        if (this.planlimitation.maxSizePerWiki) {
          return (total / this.planlimitation.maxSizePerWiki) * 100;
        }
      }
      if (this.title === 'vote') {
        if (this.planlimitation.maxSizePerVote) {
          return (total / this.planlimitation.maxSizePerVote) * 100;
        }
      }
      return 0;
    },
    fileSizeUsageStyle: function () {
      return `width: ${this.fileSizeUsage}%`;
    },
    limitation: function () {
      if (this.isDemosite) {
        return '';
      }

      var mainKey =
        "With the contract plan, you can upload attachments of '{1} to one {0}' and '{2} for the entire organization'";

      var docName = '';
      var firstKey = '';
      var allKey = '';

      if (!this.title) {
        return '';
      }

      if (this.title === 'thread') {
        docName = 'Thread';
        if (this.planlimitation.maxSizePerThread) {
          firstKey = i18next
            .t('Up to {0} bytes in total file size')
            .format(this.formatter.format(this.planlimitation.maxSizePerThread));
        }

        if (this.planlimitation.maxFilePerThread) {
          firstKey += i18next
            .t('Up to {0} files in the number of files')
            .format(this.formatter.format(this.planlimitation.maxFilePerThread));
        }
      } else if (this.title === 'wiki') {
        docName = 'Wiki';
        if (this.planlimitation.maxSizePerWiki) {
          firstKey = i18next
            .t('Up to {0} bytes in total file size')
            .format(this.formatter.format(this.planlimitation.maxSizePerWiki));
        }

        if (this.planlimitation.maxFilePerWiki) {
          firstKey += i18next
            .t('Up to {0} files in the number of files')
            .format(this.formatter.format(this.planlimitation.maxFilePerWiki));
        }
      } else if (this.title === 'vote') {
        docName = 'Circular notice';
        if (this.planlimitation.maxSizePerVote) {
          firstKey = i18next
            .t('Up to {0} bytes in total file size')
            .format(this.formatter.format(this.planlimitation.maxSizePerVote));
        }

        if (this.planlimitation.maxFilePerVote) {
          firstKey += i18next
            .t('Up to {0} files in the number of files')
            .format(this.formatter.format(this.planlimitation.maxFilePerVote));
        }
      } else {
        //
      }

      if (this.planlimitation.maxQuota) {
        allKey = i18next
          .t('Up to {0} bytes for the entire organization')
          .format(this.formatter.format(this.planlimitation.maxQuota));
      } else {
        allKey = i18next.t('Unlimited');
      }

      if (!firstKey) {
        firstKey = i18next.t('Unlimited');
      }

      return i18next.t(mainKey).format(i18next.t(docName), firstKey, allKey);
    },
  },
});
