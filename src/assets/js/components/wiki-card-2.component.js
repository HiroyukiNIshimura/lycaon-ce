/**
 * <wiki-card-2>
 * -----------------------------------------------------------------------------
 * wiki card.
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('wikiCard2', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: {
    data: {},
    organization: {},
    isPublic: { type: [Boolean, String], default: false },
    showTeam: { type: [Boolean, String], default: false },
    isAnimate: { type: [Boolean, String], default: true },
    word: '',
    adminPage: false,
  },
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      formatter: formatter,
      dateAgo: $lycaon.formatter.dateAgo,
      formatDate: $lycaon.formatter.formatDate,
      popStatus: {},
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div class="inner posts">
    <div class="post-feed">
      <article class="post-card post" :class="articleClass(index, item)" v-for="(item, index) in data" :key="index" @click="onCardClick(item)">
        <a class="post-card-image-link" v-if="showImage(item)"  v-inview:animate="animate">
          <img :src="image(item)" class="post-card-imag" />
        </a>
        <div class="post-card-content">
          <a class="post-card-content-link">
            <header class="post-card-header">
              <p class="" v-if="showTeam"><a :href="teamLink(item)">
                  {{ item.team.name }}</a></p>
              <a class="post-card-title" :href="wikiLink(item)" :target="target">
                {{ truncate(item.subject, 50) }}</a>
            </header>
            <div class=""><small class="text-muted">wiki-no:
                {{ item.no }}</small></div>
            <section class="post-card-excerpt">
              <div>
                <span :href="tagLink(tag, item)" class="badge badge-success mr-1" v-for="(tag, index) in item.tags" :key="index" v-if="showTeam">
                  {{ tag.name }}</span>
                <a :href="tagLink(item, item)" class="badge badge-success mr-1" :aria-label="tagTooltip" data-microtip-position="top" data-microtip-size="medium" role="tooltip" v-for="(tag, index) in item.tags" :key="index" v-if="!showTeam">
                  {{ tag.name }}</a>
              </div>
              <div class="card-section">
                <div class="mt-3">
                  <span class="">
                    {{ item.sanitizeHtml }}</span>
                  <div class="card-section-overlay mt-3" v-if="hitContent(item)" v-html="hitContent(item)"></div>
                </div>
                <div class="mt-3">
                  <small>
                    <user-identity :user="item.owner" :organization="organization" size="sm" v-on:icon-click="onIdentityIconClick" :pop-status="popStatus"></user-identity>
                    <lycaon-timestamp :at="item.createdAt" format="timeago" :translator="translator" short="true">
                    </lycaon-timestamp>
                  </small>
                </div>
              </div>
            </section>
          </a>

          <footer class="post-card-meta">
            <div class="mt-3">
              <i class="far fa-thumbs-up"></i>
              {{ i18n('How nice!') }} ×
              {{ formatter.format(niceCount(item)) }}
              <span :style="flagColorStyle(item)" class="ml-3" v-if="isFan(item)">
                <i class="fas fa-flag"></i>
              </span>
            </div>
          </footer>
        </div>
        <slot />
      </article>
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
    truncate: function (text, length) {
      var chars = Array.from(text);
      if (chars.length < length) {
        return text;
      }
      return chars.slice(0, length).join('') + '...';
    },
    tagLink: function (tag, wiki) {
      if (wiki.team) {
        return `/${this.organization.handleId}/team/${wiki.team.id}/wiki/${tag.id}`;
      }
      return 'javascript:void(0)';
    },
    translator: function (val) {
      return this.i18n('{0} posted at {1}').format('', val);
    },
    onCardClick: function (wiki) {
      if (this.isPublic) {
        var url = `/doc/${wiki.no}`;
        window.open(url, '_blank');
      } else {
        if (this.adminPage) {
          location.href = `/${this.organization.handleId}/admin/wiki/${wiki.no}`;
        } else {
          location.href = `/${this.organization.handleId}/wiki/${wiki.no}`;
        }
      }
    },
    onIdentityIconClick: function (popInfo) {
      this.popStatus = popInfo.id;
    },
    articleClass: function (index, wiki) {
      if (wiki.items && wiki.items.length > 0) {
        var mimes = ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
        if (_.indexOf(mimes, wiki.items[0].mimeType) > -1) {
          if (index === 0) {
            return 'post-card-large';
          }
          return '';
        } else {
          return 'no-image';
        }
      }

      return 'no-image';
    },
    image: function (wiki) {
      if (wiki.items && wiki.items.length > 0) {
        var mimes = ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
        if (_.indexOf(mimes, wiki.items[0].mimeType) > -1) {
          return wiki.items[0].virtualUrlSmall;
        }
      }
      return '';
    },
    wikiLink: function (wiki) {
      if (this.adminPage) {
        return `/${this.organization.handleId}/admin/wiki/${wiki.no}`;
      } else {
        return `/${this.organization.handleId}/wiki/${wiki.no}`;
      }
    },
    showImage: function (wiki) {
      if (wiki.items && wiki.items.length > 0) {
        var mimes = ['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff'];
        if (_.indexOf(mimes, wiki.items[0].mimeType) > -1) {
          return true;
        }
      }
      return false;
    },
    niceCount: function (wiki) {
      return wiki.nice ? wiki.nice : 0;
    },
    isFan: function (wiki) {
      return wiki.flags.length > 0;
    },
    flagColorStyle: function (wiki) {
      if (wiki.flags.length > 0) {
        return `color: ${wiki.flags[0].color}`;
      } else {
        return '';
      }
    },
    hitContent: function (wiki) {
      if (!wiki.hits) {
        return '';
      }
      if (!this.word) {
        return '';
      }

      var content = '';
      var re = new RegExp($lycaon.regexEscape(this.word), 'ig');

      if (wiki.hitsBody) {
        let matches = wiki.hitsBody.matchAll(re);
        for (let match of matches) {
          let replaced = wiki.hitsBody.replaceAll(match[0], `<span class="query-hits">${match[0]}</span>`);
          content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
            'Wiki body'
          )}</span><br>...${replaced}...</div>`;
          break;
        }
      }

      var inner = wiki.itemHits.map((o) => {
        return '* ' + o.name;
      });

      if (inner.length > 0) {
        content += `<div class="card-text"><span class="query-hits-title">${i18next.t(
          'attachment'
        )}</span></div>${inner.join('<br>')}`;
      }

      return content;
    },
    teamLink: function (wiki) {
      if (wiki.team) {
        return `/${this.organization.handleId}/team/${wiki.team.id}`;
      }
      return '#';
    },
  },
  computed: {
    target: function () {
      if (this.isPublic) {
        return '_blank';
      }
      return '';
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
  },
});
