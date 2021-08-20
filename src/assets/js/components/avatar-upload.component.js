/**
 * <avatar-upload>
 * -----------------------------------------------------------------------------
 * Avatar fileupload component.
 *
 * @type {Component}
 *
 * @event Drop   [emitted when clicked]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('avatarUpload', {
  components: {
    VueUploadComponent,
  },
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['hasAvatar', 'avatarUrl'],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data() {
    return {
      files: [],
      edit: false,
      cropper: false,
    };
  },
  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div class="user-avatar">
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>
    <div class="avatar-upload" v-show="!edit">
      <div class="text-center p-2">
        <label for="avatar">
          <img :src="files.length ? files[0].url : avatarUrl" class="rounded-circle" v-if="hasAvatar" />
          <img :src="files.length ? files[0].url : 'https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm'"
            class="rounded-circle" v-else />
          <p class="pt-2">{{ i18n('Drop the file on the icon or select the avatar image with the button below')}}</p>
        </label>
      </div>
      <div class="text-center p-2">
        <file-upload extensions="gif,jpg,jpeg,png" accept="image/png,image/gif,image/jpeg" name="avatar"
          class="btn btn-primary btn-sm" :custom-action="uploadAction" :drop="!edit" v-model="files"
          @input-filter="inputFilter" @input-file="inputFile" ref="upload">
          アバターを選択する
        </file-upload>
      </div>
    </div>

    <div class="avatar-edit" v-show="files.length && edit">
      <div class="avatar-edit-image" v-if="files.length">
        <img ref="editImage" :src="files[0].url" />
      </div>
      <div class="text-center p-4">
        <button type="button" class="btn btn-light btn-sm"
          @click.prevent="$refs.upload.clear">{{ i18n('Cancel') }}</button>
        <button type="submit" class="btn btn-primary btn-sm" @click.prevent="editSave">{{ i18n('Upload') }}</button>
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
    //…
  },
  beforeDestroy: function () {
    //…
  },
  watch: {
    edit(value) {
      if (value) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return;
          }
          let cropper = new Cropper(this.$refs.editImage, {
            aspectRatio: 1 / 1,
            viewMode: 1,
          });
          this.cropper = cropper;
        });
      } else {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = false;
        }
      }
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    editSave() {
      this.edit = false;
      let oldFile = this.files[0];
      let binStr = atob(this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1]);
      let arr = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      let file = new File([arr], oldFile.name, { type: oldFile.type });
      this.$refs.upload.update(oldFile.id, {
        file,
        type: file.type,
        size: file.size,
        active: true,
      });
    },
    alert(message) {
      alert(message);
    },
    inputFile(newFile, oldFile /*prevent*/) {
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true;
        });
      }
      if (!newFile && oldFile) {
        this.edit = false;
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.alert('Your choice is not a picture');
          return prevent();
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = '';
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file);
        }
      }
    },
    uploadAction: async function (blob /*component*/) {
      var data = new FormData();
      data.append('avatar', blob.file);

      try {
        var response = await $lycaon.axios.post('/api/v1/account/avatar-upload', data, {
          header: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
