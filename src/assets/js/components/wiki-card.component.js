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
<a class="card h-100" v-inview:animate="animate" :href="wikiLink" :target="target">
    <img :src="image"
        class="card-img-top" 
        v-if="showImage"
    />
    <div class="card-body d-flex flex-column">
        <p class="card-title" v-if="showTeam"><a :href="teamLink">{{ wiki.team.name }}</a></p>
        <h4 class="card-title">{{ truncate(wiki.subject, 50) }}</h4>
        <div class="card-subtitle"><small class="text-muted">wiki-no: {{ wiki.no }}</small></div>
        <div class="card-text">
          <span :href="tagLink(item)" class="badge badge-success mr-1" v-for="(item, index) in wiki.tags" :key="index" v-if="showTeam">{{ item.name }}</span>
          <a :href="tagLink(item)" class="badge badge-success mr-1 tag-item" data-toggle="tooltip" data-placement="top" :title="tagTooltip" v-for="(item, index) in wiki.tags" :key="index" v-if="!showTeam">{{ item.name }}</a>
        </div>
        <p class="card-text mt-1" v-html="wiki.sanitizeHtml"></p>
        <div class="card-text mt-3">
          <small>
            <user-identity :user="wiki.owner" :organization="organization" size="sm"></user-identity>
            <lycaon-timestamp :at="wiki.createdAt" format="timeago" :translator="translator" short="true"></lycaon-timestamp>
          </small>
        </div>
        <div class="card-text mt-3">
          <i class="far fa-thumbs-up"></i> {{ i18n('How nice!') }} × {{ formatter.format(niceCount) }}
          <span style="color: Tomato" class="ml-3" v-if="isFan">
            <i class="fas fa-flag"></i>
          </span>
        </div>
        <slot/>
    </div>
</a>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    $('.tag-item').tooltip();
  },
  beforeDestroy: function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    truncate: function (text, length) {
      if (text.length < length) {
        return text;
      }
      return text.substring(0, length) + '...';
    },
    tagLink: function (tag) {
      if (this.wiki.team) {
        return `/${this.organization.handleId}/team/${this.wiki.team.id}?target=wiki&tag=${tag.id}`;
      }
      return 'javascript:void(0)';
    },
    translator: function (val) {
      return this.i18n('{0} posted at {1}').format('', val);
    },
  },
  computed: {
    wikiLink: function () {
      if (this.isPublic) {
        return `/doc/${this.wiki.id}`;
      }
      return `/${this.organization.handleId}/wiki/${this.wiki.no}`;
    },
    teamLink: function () {
      if (this.wiki.team) {
        return `/${this.organization.handleId}/team/${this.wiki.team.id}`;
      }
      return '#';
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
      return this.wiki.fans.length > 0;
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
