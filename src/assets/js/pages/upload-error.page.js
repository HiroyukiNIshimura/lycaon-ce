parasails.registerPage('upload-error', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {
    if (this.plan === 'invalid') {
      var type = 'Wiki';
      if (this.type === 'thread') {
        type = 'Thread';
      } else if (this.type === 'vote') {
        type = 'Circular notice';
      }

      $lycaon.infoKeepToast(
        'No more files can be attached to this {0} with the current plan. Please consider updating your usage plan',
        [i18next.t(type)]
      );
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
  },
  computed: {
    errorMessage: function () {
      var type = 'Wiki';
      if (this.type === 'thread') {
        type = 'Thread';
      } else if (this.type === 'vote') {
        type = 'Circular notice';
      }
      return i18next
        .t(
          '{0} was created, but the attachment was too large to upload. Check the upload error mentioned in the image notation during Markdown. The maximum size that can be uploaded at the same time is {1} bytes'
        )
        .format(i18next.t(type), [formatter.format(this.sysSettings.maxUploadFileSize)]);
    },
    buttonText: function () {
      if (this.type === 'thread') {
        return i18next.t('To the created thread');
      } else if (this.type === 'wiki') {
        return i18next.t('To the created Wiki');
      } else {
        return i18next.t('To the created Circular notice');
      }
    },
    backToLink: function () {
      if (this.type === 'thread') {
        return `/${this.organization.handleId}/thread/${this.model.no}`;
      } else if (this.type === 'wiki') {
        return `/${this.organization.handleId}/wiki/${this.model.no}`;
      } else {
        return `/${this.organization.handleId}/vote/${this.model.id}`;
      }
    },
  },
});
