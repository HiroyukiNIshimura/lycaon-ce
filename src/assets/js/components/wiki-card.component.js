/**
 * <wiki-card>
 * -----------------------------------------------------------------------------
 * wiki card.
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('wikiCard', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
    wiki: {},
    organization: {},
    isPublic: { type: [Boolean, String], default: false },
    showTeam: { type: [Boolean, String], default: false },
    isAnimate: { type: [Boolean, String], default: true },
    word: '',
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      formatter: formatter,
      dateAgo: $lycaon.formatter.dateAgo,
      formatDate: $lycaon.formatter.formatDate,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div class="card h-100 card-selectable" v-inview:animate="animate">
  <div @click="onCardClick">
    <img :src="image" class="card-img-top" v-if="showImage" />
    <div class="card-body d-flex flex-column">
      <p class="card-title" v-if="showTeam"><a :href="teamLink">{{ wiki.team.name }}</a></p>
      <a class="card-title h4 wiki-subject" :href="wikiLink" :target="target">{{ truncate(wiki.subject, 50) }}</a>
      <div class="card-subtitle"><small class="text-muted">wiki-no: {{ wiki.no }}</small></div>
      <div class="card-text">
        <span :href="tagLink(item)" class="badge badge-success mr-1" v-for="(item, index) in wiki.tags" :key="index"
          v-if="showTeam">{{ item.name }}</span>
        <a :href="tagLink(item)" class="badge badge-success mr-1" :aria-label="tagTooltip" data-microtip-position="top"
          data-microtip-size="medium" role="tooltip" v-for="(item, index) in wiki.tags" :key="index"
          v-if="!showTeam">{{ item.name }}</a>
      </div>
      <div class="card-section">
        <div class="mt-3">
          <span class="card-text wiki-card-content">{{ wiki.sanitizeHtml }}</span>
          <div class="card-section-overlay mt-3" v-if="hitContent" v-html="hitContent"></div>
        </div>
        <div class="card-text mt-3">
          <small>
            <user-identity :user="wiki.owner" :organization="organization" size="sm"></user-identity>
            <lycaon-timestamp :at="wiki.createdAt" format="timeago" :translator="translator" short="true">
            </lycaon-timestamp>
          </small>
        </div>
        <div class="card-text mt-3">
          <i class="far fa-thumbs-up"></i> {{ i18n('How nice!') }} × {{ formatter.format(niceCount) }}
          <span :style="flagColorStyle" class="ml-3" v-if="isFan">
            <i class="fas fa-flag"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
  <slot />
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
    truncate: function (text, length) {
      var chars = Array.from(text);
      if (chars.length < length) {
        return text;
      }
      return chars.slice(0, length).join('') + '...';
    },
    tagLink: function (tag) {
      if (this.wiki.team) {
        return `/${this.organization.handleId}/team/${this.wiki.team.id}/wiki/${tag.id}`;
      }
      return 'javascript:void(0)';
    },
    translator: function (val) {
      return this.i18n('{0} posted at {1}').format('', val);
    },
    onCardClick: function () {
      if (this.isPublic) {
        var url = `/doc/${this.wiki.no}`;
        window.open(url, '_blank');
      } else {
        location.href = `/${this.organization.handleId}/wiki/${this.wiki.no}`;
      }
    },
  },
  computed: {
    teamLink: function () {
      if (this.wiki.team) {
        return `/${this.organization.handleId}/team/${this.wiki.team.id}`;
      }
      return '#';
    },
    wikiLink: function () {
      return `/${this.organization.handleId}/wiki/${this.wiki.no}`;
    },
    target: function () {
      if (this.isPublic) {
        return '_blank';
      }
      return '';
    },
    image: function () {
      if (this.wiki.items && this.wiki.items.length > 0) {
        var mimes = ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
        if (_.indexOf(mimes, this.wiki.items[0].mimeType) > -1) {
          return this.wiki.items[0].virtualUrlSmall;
        }
      }
      return '';
    },
    showImage: function () {
      if (this.wiki.items && this.wiki.items.length > 0) {
        var mimes = ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
        if (_.indexOf(mimes, this.wiki.items[0].mimeType) > -1) {
          return true;
        }
      }
      return false;
    },
    niceCount: function () {
      return this.wiki.nice ? this.wiki.nice : 0;
    },
    isFan: function () {
      return this.wiki.flags.length > 0;
    },
    flagColorStyle: function () {
      if (this.wiki.flags.length > 0) {
        return `color: ${this.wiki.flags[0].color}`;
      } else {
        return '';
      }
    },
    tagTooltip: function () {
      return this.i18n('Search for the same tag');
    },
    animate: function () {
      if (String(this.isAnimate) === 'false') {
        return 'none';
      }

      var types = [
        'fadeInLeft',
        'fadeInRight',
        'fadeInUp',
        'fadeInDown',
        'fadeInRightBig',
        'fadeInUpBig',
        'fadeInLeftBig',
        'fadeInDownBig',
        'zoomInDown',
        'zoomInLeft',
        'zoomInRight',
        'zoomInUp',
      ];
      var index = Math.floor(Math.random() * Math.floor(types.length));
      return types[index];
    },
    hitContent: function () {
      if (!this.wiki.hits) {
        return '';
      }
      if (!this.word) {
        return '';
      }

      var content = '';
      var re = new RegExp($lycaon.regexEscape(this.word), 'ig');

      if (this.wiki.hitsBody) {
        let matches = this.wiki.hitsBody.matchAll(re);
        for (let match of matches) {
          let replaced = this.wiki.hitsBody.replaceAll(match[0], `<span class="query-hits">${match[0]}</span>`);
          content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
            'Wiki body'
          )}</span><br>...${replaced}...</div>`;
          break;
        }
      }

      var inner = this.wiki.itemHits.map((o) => {
        return '* ' + o.name;
      });

      if (inner.length > 0) {
        content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
          'attachment'
        )}</span></div>${inner.join('<br>')}`;
      }

      return content;
    },
  },
});
