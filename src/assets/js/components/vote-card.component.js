/**
 * <vote-card>
 * -----------------------------------------------------------------------------
 * vote card.
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('voteCard', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['vote', 'organization', 'state', 'user'],

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
  <div class="card" v-inview:animate="'bounceIn'">
    <div class="card-body">
      <div class="card-subtitle mb-2">
        <span class="badge badge-success" v-if="state.answered">{{ i18n('Answered') }}</span>
        <span class="badge badge-warning" v-else>{{ i18n('Unanswered') }}</span>
      </div>
      <h5 class="card-title text-md-truncate"><a :href="voteLink">{{ vote.subject }}</a></h5>
      <div class="card-text mt-3">
        <span>{{ i18n('Release date') }}: {{ formatDate(vote.circulationFrom) }}</span>
      </div>
      <div class="card-text">
        <span class="mr-3">{{ i18n('End date') }}: {{ formatDate(vote.circulationTo) }}</span>
        <span class="badge badge-success" v-if="state.alive">{{ i18n('Now open') }}</span>
        <span class="badge badge-light" v-else-if="state.before">{{ i18n('Before release') }}</span>
        <span class="badge badge-dark" v-else-if="state.after">{{ i18n('Closed') }}</span>
      </div>
      <div class="card-text mt-3">
        <span>{{ i18n('Author') }}: </span>
        <user-identity :user="vote.author" :organization="organization" size="sm"></user-identity>
      </div>
      <div class="text-center mt-3">
        <span class="" v-if="!state.after && vote.author && vote.author.id === user.id"><a class="btn btn-info btn-sm" :href="editLink">{{ i18n('Edit') }}</a></span>
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

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {},
  computed: {
    voteLink: function () {
      return `/${this.organization.handleId}/vote/${this.vote.id}`;
    },
    editLink: function () {
      return `/${this.organization.handleId}/vote/edit/${this.vote.id}`;
    },
  },
});
