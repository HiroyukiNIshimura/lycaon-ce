/**
 * <activity-card>
 * -----------------------------------------------------------------------------
 * activity card.
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('activityCard', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: ['activity', 'query', 'finded', 'team', 'organization'],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function () {
    return {
      formatter: formatter,
      dateAgo: $lycaon.formatter.dateAgo,
      formatDate: $lycaon.formatter.formatDate,
      description: '',
      interval: undefined,
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
<div class="px-1 py-1" v-inview:animate="'zoomInDown'">
<p v-if="team"><a :href="teamLink">{{ team.name }}</a></p>
<h6><a :href="threadLink">[#{{ activity.thread.no }}] {{ activity.thread.subject }}</a></h6>
<div class="mb-2">
    <span class="badge badge-light mr-1" v-if="activity.thread.concept === 0">{{ i18n('draft') }}</span>
    <span class="badge badge-success mr-1" v-if="activity.thread.concept === 1">{{ i18n('published') }}</span>
    <span :class="displayStatusClass"><i :class="displayStatusIcon" class="mr-1"></i>{{ displayStatus }}</span>
    <span class="badge badge-danger mr-1" v-if="activity.thread.locked">{{ i18n('Archive') }}</span>
    <span class="badge badge-primary mr-1" v-if="activity.thread.local">{{ i18n('Private') }}</span>
</div>
<div class="mt-3">
  <small>
    {{ i18n('Changer') }}：<user-identity :user="activity.user" :organization="organization" size="sm"></user-identity>
  </small>
</div>
<div class="mt-3">
  <button type="button" class="btn btn-light btn-circle-timeline" :class="iconColor">
      <i class="fas" :class="iconName"></i>
  </button>
  <span class="text-break">{{ description }}</span>
</div>
</div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    this.description = this._description();

    this.interval = setInterval(async () => {
      try {
        this.description = this._description();
        await this.forceRender();
      } catch (err) {
        err.raw = err;
        throw new Error(
          'Encountered unexpected error while attempting to automatically re-render <activity-card> in the background, as the seconds tick by.  ' +
            err.message
        );
      }
    }, 60 * 1000);
  },
  mounted: async function () {
    //…
  },
  beforeDestroy: function () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    _description: function () {
      var at = this.dateAgo(this.activity.createdAt, true);
      switch (this.activity.type) {
        case 'create':
          return this.i18n('Created a thread at {0}', [at]);
        case 'update':
          return this.i18n('Updated the thread at {0}', [at]);
        case 'local':
          return this.i18n('Changed the thread to [ private ] at {0}', [at]);
        case 'update-reply':
          return this.i18n('Updated the reply at {0}', [at]);
        case 'delete-reply':
          return this.i18n('Deleted the reply at {0}', [at]);
        case 'update-sneeze':
          return this.i18n('Updated the comment at {0}', [at]);
        case 'delete-sneeze':
          return this.i18n('Deleted the comment at {0}', [at]);
        case 'update-category':
          return this.i18n('Changed the category to [ {0} ] at {1}', [
            this.i18n(this.activity.stateWord),
            at,
          ]);
        case 'update-concept':
          return this.i18n('Changed the concept to [ {0} ] at {1}', [
            this.i18n(this.activity.stateWord),
            at,
          ]);
        case 'update-status':
          return this.i18n('Changed the status to [ {0} ] at {1}', [
            this.i18n(this.activity.stateWord),
            at,
          ]);
        case 'update-duedate':
          return this.activity.targetDate
            ? this.i18n('Changed the deadline to [ {0} ] at {1}', [
                this.formatDate(this.activity.targetDate),
                at,
              ])
            : this.i18n('Changed the deadline to [ No setting ] at {0}', [at]);
        case 'update-priority':
          return this.i18n('Changed importance to [ {0} ] at {1}', [
            this.i18n(this.activity.stateWord),
            at,
          ]);
        case 'update-lock':
          return this.i18n('Changed the thread to [ {0} ] at {1}', [
            this.i18n(this.activity.stateWord),
            at,
          ]);
        case 'update-working':
          return this.i18n('Changed the thread to [ {0} ] at {1}', [
            this.i18n(this.activity.stateWord),
            at,
          ]);
        case 'responsible':
          return this.activity.userName
            ? this.i18n('Changed the person in charge to [ {0} ] at {1}', [
                this.activity.userName,
                at,
              ])
            : this.i18n('Changed the person in charge to [ No setting ] at {0}', [at]);
        case 'create-sneeze':
          return this.i18n('Created a comment at {0}', [at]);
        case 'create-reply':
          return this.i18n('Created a reply at {0}', [at]);
        case 'attach-file':
          return this.i18n('Attached file [{0}] at {1}', [this.activity.fileName, at]);
        case 'delete-file':
          return this.i18n('Deleted file [{0}] at {1}', [this.activity.fileName, at]);
        default:
          break;
      }
      return '';
    },
  },
  computed: {
    threadLink: function () {
      if (this.query && this.query.sustain && this.finded) {
        return (
          `/${this.organization.handleId}/thread/${this.activity.thread.no}?query=` +
          encodeURIComponent(JSON.stringify(this.query))
        );
      }
      return `/${this.organization.handleId}/thread/${this.activity.thread.no}`;
    },
    teamLink: function () {
      if (this.team) {
        return `/${this.organization.handleId}/team/${this.team.id}`;
      }
      return '#';
    },
    displayStatus: function () {
      if (this.activity.thread.status === 0) {
        return this.i18n('open');
      }
      return this.i18n('close');
    },
    displayStatusIcon: function () {
      if (this.activity.thread.status === 0) {
        return 'fas fa-exclamation-circle';
      }
      return 'fas fa-check-circle';
    },
    displayStatusClass: function () {
      if (this.activity.thread.status === 0) {
        return 'badge badge-pill badge-warning';
      }
      return 'badge badge-pill badge-dark';
    },
    iconColor: function () {
      if (this.activity.type === 'create') {
        return 'icon-yellow';
      }
      if (this.activity.type === 'update-status') {
        if (this.activity.stateWord === 'open') {
          return 'icon-yellow';
        }
        return 'icon-red';
      }
      return '';
    },
    iconName: function () {
      switch (this.activity.type) {
        case 'create':
          return 'fa-exclamation-circle';
        case 'update':
          return 'fa-edit';
        case 'local':
          return 'fa-eye-slash';
        case 'update-reply':
          return 'fa-reply';
        case 'update-sneeze':
          return 'fa-comment';
        case 'update-category':
          return 'fa-tasks';
        case 'update-concept':
          return 'fa-globe';
        case 'update-status':
          if (this.activity.stateWord === 'open') {
            return 'fa-exclamation-circle';
          }
          return 'fa-check-circle';
        case 'update-duedate':
          return 'fa-calendar-check';
        case 'update-priority':
          return 'fa-weight';
        case 'update-lock':
          return 'fa-lock';
        case 'update-working':
          return 'fa-code-branch';
        case 'responsible':
          return 'fa-user';
        case 'create-sneeze':
          return 'fa-comment';
        case 'create-reply':
          return 'fa-reply';
        case 'attach-file':
          return 'fa-folder-plus';
        case 'delete-file':
          return 'fa-folder-minus';
        case 'delete-sneeze':
          return '';
        case 'delete-reply':
          return '';
        default:
          break;
      }
    },
  },
});
