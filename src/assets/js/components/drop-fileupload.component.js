/**
 * <drop-fileupload>
 * -----------------------------------------------------------------------------
 * Drop fileupload component.
 *
 * @type {Component}
 *
 * @event Drop   [emitted when clicked]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('dropFileupload', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['whitelist', 'callback', 'isUploading'],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      isDragEnter: false,
      blocker: {},
      serial: {},
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div ref="dropArea" class="col drop-area" :class="{dragEnter: isDragEnter}" 
    @dragenter="dragEnter" @dragleave="dragLeave"
    @dragover.prevent="dragOver" @drop.prevent="dropFile($event)">
  <div class="row py-3">
      <div class="col">
        <small>{{ i18n('Choose or drop the file') }}</small>
        <div class="input-group">
          <div class="custom-file">
            <input type="file" class="custom-file-input" :id="inputId" @change="onFileChange($event)">
            <label class="custom-file-label text-truncate" :for="inputId"></label>
          </div>
        </div>
        <div class="text-center mt-3" :aria-label="i18n('Drag the upload file to this area')" data-microtip-position="bottom" data-microtip-size="medium" role="tooltip">
          <i class="fas fa-cloud-upload-alt fa-2x"></i> {{ i18n('File upload') }}
        </div>
        <div class="text-muted text-break">{{ i18n('Files with the extension ({0}) can be attached', [whitelistStr()]) }}</div>
      </div>
  </div>
</div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    this.serial = Date.now();
  },
  mounted: async function () {
    //…
  },
  beforeDestroy: function () {
    //…
  },
  watch: {
    isUploading: function (val) {
      if (val) {
        this.block(this.i18n('Uploading {0} ...').format(this.i18n('File')));
      } else {
        this.unBlock();
      }
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    block: function (label) {
      this.blocker = Vue.$loading.show(
        {
          container: this.$refs.dropArea,
          canCancel: false,
          color: '#000000',
          loader: 'dots',
          width: 64,
          height: 64,
          backgroundColor: '#ffffff',
          opacity: 0.5,
          zIndex: 999,
          isFullPage: false,
        },
        {
          before: this.$createElement('div', { class: 'loading-before' }, [label]),
        }
      );
    },
    unBlock: function () {
      if (this.blocker) {
        this.blocker.hide();
      }
    },
    dragEnter: function () {
      this.isDragEnter = true;
    },
    dragLeave: function () {
      this.isDragEnter = false;
    },
    dragOver: function () {
      this.isDragEnter = true;
    },
    dropFile: function (event) {
      this.upload(event.target.files || event.dataTransfer.files);
      this.isDragEnter = false;
    },
    onFileChange: function (event) {
      this.upload(event.target.files || event.dataTransfer.files);
    },
    upload: function (data) {
      var files = $lycaon.rejectIgnoreExts(_.toArray(data), 'name', this.whitelist);
      if (files.length > 5) {
        $lycaon.infoToast('You can only drag up to {0} files at a time', [5]);
      } else {
        var self = this;
        _.each(files, (file) => {
          self.callback(file);
        });
      }
      this.isDragEnter = false;
    },
    whitelistStr: function () {
      return this.whitelist.join(', ');
    },
  },
  computed: {
    inputId: function () {
      return 'inputGroupFile-' + this.serial;
    },
  },
});
