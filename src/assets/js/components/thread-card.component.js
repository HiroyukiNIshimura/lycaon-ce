/**
 * <thread-card>
 * -----------------------------------------------------------------------------
 * thread card.
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('threadCard', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  // カードアイテムにteam の値が設定されているのはmainページの方
  props: ['thread', 'selectedTags', 'team', 'organization', 'word', 'showCounter', 'showFlagRemove'],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      formatter: formatter,
      dateAgo: $lycaon.formatter.dateAgo,
      formatDate: $lycaon.formatter.formatDate,
      popStatus: '',
      syncing: false,
      formErrors: {},
      cloudError: '',
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div class="card h-100 card-selectable" :style="flagColorStyle">
  <div class="thread-priority-bar" :aria-label="i18n('Importance: High')" data-microtip-position="bottom" role="tooltip"
    v-show="thread.priority === 2"></div>
  <div class="thread-urgency-bar" :aria-label="i18n('Urgency')" data-microtip-position="bottom" role="tooltip"
    :class="urgencyBarColor" v-show="thread.urgency > 0"></div>
  <div class="card-body">
    <div class="row mb-2">
      <div class="col h5 card-subtitle">
        <span class="badge badge-pill" :style="categoryStyle(thread.category.name)" v-if="team">{{ thread.category.name }}</span>

        <a :href="categoryLink(thread.category)" class="badge badge-pill" :style="categoryStyle(thread.category.name)" :aria-label="categoryTooltip" data-microtip-position="top" data-microtip-size="medium" role="tooltip" v-if="!team">
      {{ thread.category.name }}
        </a>

      </div>
      <div class="col text-right">
        <span class="fa-layers fa-fw" style="color: Dodgerblue;font-size: 1.6rem;" v-if="thread.sneezeQty > 0">
          <i class="far fa-comment"></i>
          <span class="fa-layers-counter" style="background:Tomato;font-size: 2.5rem;">{{thread.sneezeQty}}</span>
        </span>
        <span class="fa-layers fa-fw" style="color: Dodgerblue;font-size: 1.6rem;" v-if="thread.replyQty > 0">
          <i class="fas fa-reply"></i>
          <span class="fa-layers-counter" style="background:Tomato;font-size: 2.5rem;">{{thread.replyQty}}</span>
        </span>
      </div>
    </div>
    <p class="card-title" v-if="team"><a :href="teamLink">{{ team.name }}</a></p>
    <h5 class="card-title"><a class="thread-subject" :href="threadLink">[#{{ thread.no }}] {{ thread.subject }}</a></h5>
    <div class="card-subtitle mb-1" v-if="showCounter">
      <span class="text-success">{{ i18n('Views') }} : {{thread.accessCount}}</span>
    </div>
    <div class="card-subtitle mb-2">
      <span class="badge badge-light mr-1" v-if="thread.concept === 0">{{ i18n('draft') }}</span>
      <span class="badge badge-success mr-1" v-if="thread.concept === 1">{{ i18n('published') }}</span>
      <span :class="displayStatusClass"><i :class="displayStatusIcon" class="mr-1"></i>{{ displayStatus }}</span>
      <span class="badge badge-danger mr-1" v-if="thread.locked">{{ i18n('Archive') }}</span>
      <span class="badge badge-primary mr-1" v-if="thread.local">{{ i18n('Private') }}</span>
    </div>
    <div class="card-section">
      <div class="card-text">{{ i18n('Deadline') }}:
        <span v-if="thread.dueDateAt">{{ formatDate(thread.dueDateAt) }}</span>
        <span v-else>{{ i18n('unspecified') }}</span>
      </div>
      <div class="card-text mb-2">{{ i18n('Person in charge') }}:
        <span v-if="thread.responsible">
          <user-identity :user="thread.responsible" :organization="organization" size="sm"  v-on:icon-click="onIdentityIconClick" :pop-status="popStatus"></user-identity>
        </span>
        <span v-else>{{ i18n('unspecified') }}</span>
      </div>
      <div class="card-text mb-1">
        <small>
          <user-identity :user="thread.owner" :organization="organization" size="sm"  v-on:icon-click="onIdentityIconClick" :pop-status="popStatus"></user-identity>
          <lycaon-timestamp :at="thread.createdAt" format="timeago" :translator="createTranslator" short="true">
          </lycaon-timestamp>
        </small>
      </div>
      <div class="card-text mb-1" v-if="thread.lastUpdateUser">
        <small>
          <user-identity :user="thread.lastUpdateUser" :organization="organization" size="sm"  v-on:icon-click="onIdentityIconClick" :pop-status="popStatus"></user-identity>
          <lycaon-timestamp :at="thread.lastHumanUpdateAt" format="timeago" :translator="updateTranslator" short="true">
          </lycaon-timestamp>
        </small>
      </div>
      <div class="card-text mb-1" v-if="thread.working">
        <small>
          <user-identity :user="thread.workingUser" :organization="organization" size="sm"  v-on:icon-click="onIdentityIconClick" :pop-status="popStatus"></user-identity>
          {{ i18n('{0} is working').format('') }}
        </small>
      </div>
      <div class="card-section-overlay" v-if="hitContent" v-html="hitContent"></div>
      <div class="card-text text-right" v-if="showFlagRemove"><small><a href="javascript:void(0)" @click="removeFlagSubmit">{{ i18n('Remove the flag') }}</a></small></div>
    </div>
  </div>
  <div class="card-footer">
    <small class="mr-2">{{ i18n('Tags') }}</small>
    <span class="badge badge-success mr-1" v-for="(item, index) in thread.tags" :key="index" v-if="team">
      {{ item.name }}
    </span>
    <a :href="tagLink(item)" :class="tagStyle(item)" class="mr-1" :aria-label="tagTooltip" data-microtip-position="top"
      data-microtip-size="medium" role="tooltip" v-for="(item, index) in thread.tags" :key="index" v-if="!team">
      {{ item.name }}
    </a>
    <div v-if="thread.milestone">
      <small class="mr-2">{{ i18n('Milestone') }}</small>
      <small><a :href="milestoneLink">{{ thread.milestone.name }}</a></small>
    </div>
  </div>
  <ajax-form ref="flagRemoveAction" action="updateThreadFlag" :syncing.sync="syncing" :cloud-error.sync="cloudError" @submitted="submittedFlagForm" :handle-parsing="handleParsingFlagForm"></ajax-form>
</div>
`,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝beforeMount: function () {
  //…
  mounted: async function () {
    //…
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
    tagLink: function (tag) {
      return `/${this.organization.handleId}/team/${this.thread.team.id}/thread?tag=${tag.id}`;
    },
    categoryLink: function (category) {
      return `/${this.organization.handleId}/team/${this.thread.team.id}/thread?category=${category.id}`;
    },
    createTranslator: function (val) {
      return this.i18n('{0} opened at {1}').format('', val);
    },
    updateTranslator: function (val) {
      return this.i18n('{0} updated at {1}').format('', val);
    },
    hex2rgba: function (hex, alpha = 1) {
      let r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      let c = null;
      if (r) {
        c = r.slice(1, 4).map((x) => {
          return parseInt(x, 16);
        });
      }
      r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
      if (r) {
        c = r.slice(1, 4).map((x) => {
          return 0x11 * parseInt(x, 16);
        });
      }
      if (!c) {
        return null;
      }
      return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
    },
    getColor: function (str) {
      var view = new DataView(new ArrayBuffer(4));
      view.setUint32(0, CRC32.str(str), false);
      var buff = new Uint8Array(view.buffer);
      return {
        r: buff[0] & 0xff,
        g: buff[1] & 0xff,
        b: buff[2] & 0xff,
      };
    },
    categoryStyle: function (str) {
      var color = this.getColor(str);
      return `background:rgb(${color.r},${color.g},${color.b});`;
    },
    onIdentityIconClick: function (popInfo) {
      this.popStatus = popInfo.id;
    },
    tagStyle: function (item) {
      if (this.word) {
        if (item.name === this.word) {
          return 'badge badge-danger';
        }
      }

      if (this.selectedTags) {
        if (
          _.findIndex(this.selectedTags, (o) => {
            return o.id === item.id;
          }) > -1
        ) {
          return 'badge badge-danger';
        }
      }

      return 'badge badge-success';
    },
    removeFlagSubmit: function () {
      this.$refs.flagRemoveAction.submit();
    },
    handleParsingFlagForm: function () {
      this.formErrors = {};

      var argins = {
        id: this.thread.id,
        state: false,
      };
      return argins;
    },
    submittedFlagForm: async function () {
      this.cloudSuccess = true;
      this.syncing = true;
      location.reload();
    },
  },
  computed: {
    threadLink: function () {
      return `/${this.organization.handleId}/thread/${this.thread.no}`;
    },
    teamLink: function () {
      if (this.team) {
        return `/${this.organization.handleId}/team/${this.team.id}`;
      }
      return '#';
    },
    milestoneLink: function () {
      if (this.thread.milestone) {
        return `/${this.organization.handleId}/team/${this.thread.milestone.team}/milestone/${this.thread.milestone.id}`;
      }
      return '#';
    },
    displayStatus: function () {
      if (this.thread.status === 0) {
        return this.i18n('open');
      }
      return this.i18n('close');
    },
    displayStatusIcon: function () {
      if (this.status === 0) {
        return 'fas fa-exclamation-circle';
      }
      return 'fas fa-check-circle';
    },
    displayStatusClass: function () {
      if (this.thread.status === 0) {
        return 'badge badge-pill badge-warning';
      }
      return 'badge badge-pill badge-dark';
    },
    hitContent: function () {
      if (!this.thread.hits) {
        return '';
      }
      if (!this.word) {
        return '';
      }

      var content = '';
      var re = new RegExp($lycaon.regexEscape(this.word), 'ig');

      if (this.thread.hitsBody) {
        let matches = this.thread.hitsBody.matchAll(re);
        for (let match of matches) {
          let replaced = this.thread.hitsBody.replaceAll(match[0], `<span class="query-hits">${match[0]}</span>`);
          content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
            'Thread body'
          )}</span><br>...${replaced}...</div>`;
          break;
        }
      }

      var inner = [];

      _.each(this.thread.sneezeHits, (o) => {
        let matches = o.sentence.matchAll(re);
        for (let match of matches) {
          let replaced = o.sentence.replaceAll(match[0], `<span class="query-hits">${match[0]}</span>`);
          inner.push(replaced);
          break;
        }
      });

      if (inner.length > 0) {
        content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
          'comment'
        )}</span><br>...${inner.join('<br>')}...</div>`;
      }

      inner = [];

      _.each(this.thread.replyHits, (o) => {
        let matches = o.sentence.matchAll(re);
        for (let match of matches) {
          let replaced = o.sentence.replaceAll(match[0], `<span class="query-hits">${match[0]}</span>`);
          inner.push(replaced);
          break;
        }
      });

      if (inner.length > 0) {
        content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
          'reply'
        )}</span><br>...${inner.join('<br>')}...</div>`;
      }

      inner = this.thread.itemHits.map((o) => {
        return '* ' + o.name;
      });

      if (inner.length > 0) {
        content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
          'attachment'
        )}</span></div>${inner.join('<br>')}`;
      }

      return content;
    },
    urgencyBarColor: function () {
      return `thread-urgency-bar-color${this.thread.urgency}`;
    },
    tagTooltip: function () {
      return this.i18n('Search for the same tag');
    },
    categoryTooltip: function () {
      return this.i18n('Search for the same category');
    },
    flagColorStyle: function () {
      if (this.thread.flags && this.thread.flags.length > 0) {
        var color = this.thread.flags[0].color;
        return `border-color:${color}; border-bottom-width:5px`;
      } else {
        return '';
      }
    },
  },
});
