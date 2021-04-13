parasails.registerPage('backoffice-backup-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    formatDatetime: $lycaon.formatter.formatDatetime,
    recoveryTarget: {},
    //…
    showBackupModal: false,
    showRecoveryModal: false,
    isUploading: false,
    whitelist: ['zip'],
    // Main syncing/loading state for this page.
    syncing: false,
    // Form data
    formData: {
      /* … */
    },
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: {
      /* … */
    },
    // Server error state for the form
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {},
  mounted: async function () {
    //…
    if (this.effectMessage) {
      $lycaon.cloudSuccessToast(this.effectMessage);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    clickBackup: function () {
      this.showBackupModal = true;
    },
    clickRecovery: function (item) {
      this.recoveryTarget = item;
      this.showRecoveryModal = true;
    },
    doBackup: function () {
      this.showBackupModal = false;
      var form = _.find(this.$children, {
        $el: $('#backup-form')[0],
      });
      form.submit();
    },
    doRecovery: function () {
      this.showRecoveryModal = false;
      var form = _.find(this.$children, {
        $el: $('#recovery-form')[0],
      });
      form.submit();
    },
    submittedBackupForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/admin/backups`;
    },
    handleParsingBackupForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      return {};
    },
    submittedRecoveryForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.href = `/admin/backups`;
    },
    handleParsingRecoveryForm: function () {
      this.formErrors = {};
      $lycaon.clearToast();

      var argins = { filename: this.recoveryTarget.filename };
      return argins;
    },
    downloadLink: function (item) {
      return `/admin/backups/download?filename=${item.filename}`;
    },
    upload: async function (blob) {
      var data = new FormData();
      data.append('backup', blob);

      this.isUploading = true;

      var self = this;
      try {
        var response = await $lycaon.axios.post('/api/v1/admin/database/backup/upload', data, {
          header: {
            'Content-Type': 'multipart/form-data',
          },
        });

        self.isUploading = false;

        if (response.data.status === 'error') {
          console.log(response.data);
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
