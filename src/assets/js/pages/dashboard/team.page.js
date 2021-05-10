parasails.registerPage('team', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formatter: formatter,
    dateAgo: $lycaon.formatter.dateAgo,
    formatDate: $lycaon.formatter.formatDate,
    formatDatetime: $lycaon.formatter.formatDatetime,
    query: {
      category: '',
      responsible: '',
      milestone: '',
      concept: '',
      status: 0,
      owner: '',
      locked: '',
      priority: '',
      working: false,
      flag: false,
      tags: [],
      sustain: false,
      sort: 0,
      word: '',
    },
    queryPatern: 0,
    currentPage: 1,
    queryResults: [],
    queryCount: 0,
    selectedTags: [],
    selectedWikiTags: [],
    tagifySettings: {},
    selectedCategory: '',
    selectedStatus: '0',
    openActive: 'active',
    closeActive: '',
    newVoteActive: 'active',
    openVoteActive: '',
    closeVoteActive: '',
    myVoteActive: '',
    panelId: 'team-tab-panel',
    wikiflags: false,
    nonmyown: false,
    filtered: false,
    counter: {
      working: 0,
      myThread: 0,
      votes: 0,
      flag: 0,
      local: 0,
    },
    voteState: '0',
    membersPage: 1,
    allMembers: [],
    selectedTab: {},
    notifyStack: [],
    revisionGraph: undefined,
    //dialogs
    showMemberModal: false,
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
  beforeMount: function () {
    this.tagifySettings = _.deepExtend({}, $lycaon.tagifySettings, {
      placeholder: i18next.t('You can add up to {0} tags to a condition').format(10),
      enforceWhitelist: true,
      maxTags: 10,
      dropdown: {
        maxItems: undefined,
        closeOnSelect: true,
      },
    });

    var self = this;
    _.each(this.tags, (entry) => {
      self.tagifySettings.whitelist.push({
        value: entry.name,
        id: entry.id,
      });
    });

    if (this.query.resultTarget === 'thread') {
      expiringStorage.set(
        `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`,
        '#tab-team',
        5
      );
    }
    if (this.wikiQuery) {
      expiringStorage.set(
        `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`,
        '#tab-wiki',
        5
      );
    }

    if (!this.query && !this.wikiQuery) {
      var query = expiringStorage.get(this.queryStorageKey);
      this.query = query;
      this.filtered = true;
    }
  },
  mounted: async function () {
    var self = this;
    window.onbeforeunload = function () {
      $lycaon.socket.post('/ws/v1/team-out', { id: self.team.id });
    };

    io.socket.on('thread-notify', function (data) {
      if (data.user.id !== self.me.id) {
        $lycaon.stackExchange(data, self.notifyStack, self.me.organization.handleId);
        if (!self.me.noRaiseThreadNotify) {
          $lycaon.reloadRequestToast(data.message);
        }
        self.submitForm('#query-counter-form');
      }
    });
    io.socket.on('message-notify', function (response) {
      if (response.data.sendTo === self.me.id) {
        $lycaon.stackMessage(response, self.messageStack, self.me.organization.handleId);
        $lycaon.socketToast(response.message);
      }
    });
    $lycaon.stackMessage(false, this.messageStack, this.me.organization.handleId);

    $lycaon.socket.post('/ws/v1/team-in', { id: this.team.id }, (res) => {
      io.socket.on('team-in', function (data) {
        var id = self.parseUserId(data.user);
        if (!$('#' + id).hasClass('blink')) {
          $('#' + id).addClass('blink');
        }
        if (data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
        }
        $lycaon.socket.post('/ws/v1/team-pon', { id: self.team.id, user: self.me });
      });
      io.socket.on('team-out', function (data) {
        var id = self.parseUserId(data.user);
        $('#' + id).removeClass('blink');
        if (data.user.id !== self.me.id) {
          $lycaon.socketToast(data.message);
        }
      });
      io.socket.on('team-pon', function (data) {
        if (data.user.id !== self.me.id) {
          var id = self.parseUserId(data.user);
          $('#' + id).addClass('blink');
        }
      });
    });

    this.$nextTick(() => {
      if (this.query && this.$refs.tagify) {
        if (this.query.tagQuery) {
          this.$refs.tagify.addTags([
            {
              value: this.query.tagQuery.name,
              id: this.query.tagQuery.id,
            },
          ]);
        } else {
          this.$refs.tagify.addTags(this.query.tags);
        }
      }

      if (this.wikiQuery && this.$refs.wikitagify) {
        this.$refs.wikitagify.addTags([
          {
            value: this.wikiQuery.tagQuery.name,
            id: this.wikiQuery.tagQuery.id,
          },
        ]);
      }

      this.renderCharts(this.team);
    });
  },
  watch: {
    'query.local': function (val) {
      if (val === true) {
        this.query.owner = this.me.id;
      } else {
        this.query.owner = '';
      }
    },
    'query.sort': function (val) {
      this.clearData();
      this.submitForm('#query-team-form');
    },
    selectedCategory: function (val) {
      this.clearData();
      this.submitForm('#query-thread-form');
    },
    selectedStatus: function (val) {
      if (val == 0) {
        this.openActive = 'active';
        this.closeActive = '';
      } else {
        this.openActive = '';
        this.closeActive = 'active';
      }
      this.clearData();
      this.submitForm('#query-thread-form');
    },
    voteState: function (val) {
      if (val == '0') {
        this.newVoteActive = 'active';
        this.openVoteActive = '';
        this.closeVoteActive = '';
        this.myVoteActive = '';
      } else if (val == '1') {
        this.newVoteActive = '';
        this.openVoteActive = 'active';
        this.closeVoteActive = '';
        this.myVoteActive = '';
      } else if (val == '2') {
        this.newVoteActive = '';
        this.openVoteActive = '';
        this.closeVoteActive = 'active';
        this.myVoteActive = '';
      } else {
        this.newVoteActive = '';
        this.openVoteActive = '';
        this.closeVoteActive = '';
        this.myVoteActive = 'active';
      }
      this.clearData();
      this.submitForm('#query-vote-form');
    },
    wikiflags: function (val) {
      this.clearData();
      this.submitForm('#query-wiki-form');
    },
    nonmyown: function (val) {
      this.clearData();
      this.submitForm('#query-activity-form');
    },
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    renderCharts: function (team) {
      var c1 = document.getElementById('summary-chart');
      var c2 = document.getElementById('summary-chart-sub');

      if (c1 && c2) {
        var open = team.summary.open;
        var close = team.summary.total - open;
        new Chart(c1, {
          type: 'pie',
          data: {
            datasets: [
              {
                data: [open, close],
                fill: false,
                borderWidth: 1,
              },
            ],
            labels: [
              `${i18next.t('open')}: ${formatter.format(open)}`,
              `${i18next.t('close')}: ${formatter.format(close)}`,
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
              legend: {
                position: 'left',
              },
              colorschemes: {
                scheme: 'brewer.PastelOne9',
              },
            },
          },
        });

        new Chart(c2, {
          type: 'pie',
          data: {
            datasets: [
              {
                data: [team.summary.working, team.summary.expired, team.summary.notAssignment],
                fill: false,
                borderWidth: 1,
              },
            ],
            labels: [
              `${i18next.t('Working')}: ${formatter.format(team.summary.working)}`,
              `${i18next.t('Expired')}: ${formatter.format(team.summary.expired)}`,
              `${i18next.t('Not in charge_2')}: ${formatter.format(team.summary.notAssignment)}`,
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
              legend: {
                position: 'left',
              },
              colorschemes: {
                scheme: 'brewer.SetThree9',
              },
            },
          },
        });
      }
    },
    clearData: function () {
      this.queryResults = [];
      this.queryCount = 0;
      this.currentPage = 1;
    },
    tabChanged: function (selectedTab) {
      this.clearData();
      this.selectedTab = selectedTab;

      if (selectedTab.tab.id === 'tab-team') {
        this.queryPatern = 0;
        this.submitForm('#query-team-form');
      }
      if (selectedTab.tab.id === 'tab-thread') {
        this.submitForm('#query-thread-form');
      }
      if (selectedTab.tab.id === 'tab-activity') {
        this.submitForm('#query-activity-form');
      }
      if (selectedTab.tab.id === 'tab-flag') {
        this.submitForm('#query-flag-form');
      }
      if (selectedTab.tab.id === 'tab-working') {
        this.submitForm('#query-working-form');
      }
      if (selectedTab.tab.id === 'tab-private') {
        this.submitForm('#query-private-form');
      }
      if (selectedTab.tab.id === 'tab-git') {
        this.submitForm('#query-git-form');
      }
      if (selectedTab.tab.id === 'tab-wiki') {
        this.submitForm('#query-wiki-form');
      }
      if (selectedTab.tab.id === 'tab-circular') {
        this.submitForm('#query-vote-form');
      }
    },
    onAddTagify: function (e) {
      this.selectedTags.push(e.detail.data);
    },
    onRemoveTagify: function (e) {
      this.selectedTags = _.reject(this.selectedTags, (entry) => {
        return entry.value === e.detail.data.value;
      });
    },
    onAddWikiTagify: function (e) {
      this.selectedWikiTags.push(e.detail.data);
      this.clearData();
      this.submitForm('#query-wiki-form');
    },
    onRemoveWikiTagify: function (e) {
      this.selectedWikiTags = _.reject(this.selectedWikiTags, (entry) => {
        return entry.value === e.detail.data.value;
      });
      this.clearData();
      this.submitForm('#query-wiki-form');
    },
    /* 検索ボタン */
    clickSubmit: function () {
      this.clearData();
      this.submitForm('#query-team-form');
    },
    queryAmbiguity: function () {
      this.clearData();
      if (this.query.word) {
        this.submitForm('#query-ambiguity-form');
      } else {
        this.submitForm('#query-team-form');
      }
    },
    clickClear: function () {
      this.query = {
        category: '',
        responsible: '',
        milestone: '',
        concept: '',
        status: 0,
        owner: '',
        locked: '',
        priority: '',
        working: false,
        flag: false,
        tags: [],
        sustain: false,
      };

      this.$refs.tagify.removeAllTags();
      this.selectedTags = [];
      this.clearData();
      this.submitForm('#query-team-form');
    },
    onNewThreadCkick: function () {
      location.href = `/${this.organization.handleId}/thread/create/${this.team.id}`;
    },
    onNewWikiCkick: function () {
      location.href = `/${this.organization.handleId}/wiki/create/${this.team.id}`;
    },
    onNewVoteCkick: function () {
      location.href = `/${this.organization.handleId}/vote/create?team=${this.team.id}`;
    },
    parseUserId: function (user) {
      return 'member-' + user.id;
    },
    submitForm: function (selector) {
      var form = _.find(this.$children, {
        $el: $(selector)[0],
      });
      form.submit();
    },
    threadHandler($state) {
      this.infiniteState = $state;
      if (this.queryPatern === 0) {
        this.submitForm('#query-team-form');
      } else {
        this.submitForm('#query-ambiguity-form');
      }
    },
    submittedQueryForm: function (response) {
      if (!response.data) {
        console.log('data not found!');
        return;
      }

      var page = this.currentPage;

      this.queryCount = response.records;
      if (response.data.length) {
        this.currentPage += 1;
        this.queryResults.push(...response.data);
        if (this.infiniteState) this.infiniteState.loaded();
      } else {
        if (this.infiniteState) this.infiniteState.complete();
      }
      this.cloudSuccess = true;

      if (this.queryPatern === 1) {
        this.$nextTick(() => {
          var word = $('#query-word').val();
          var re = new RegExp($lycaon.regexEscape(word), 'g');

          $.each($('.thread-subject'), function () {
            var text = $(this).text();
            var newtext = text.replace(re, `<span class="query-hits">${word}</span>`);
            $(this).text('');
            $(this).append(newtext);
          });

          $.each($('.card[title]'), function () {
            var text = $(this).prop('title');
            var newtext = text.replace(re, `<span class="query-hits">${word}</span>`);
            if (newtext) {
              newtext = `${i18next.t('Thread body')}<br>...${newtext}...`;
            } else {
              newtext = i18next.t('The comment or reply contains a word');
            }
            $(this).prop('title', newtext);
          });
          $('.card[data-toggle="tooltip"]').tooltip();
        });
      }

      if (bowser && (bowser.mobile || bowser.tablet) && page === 1) {
        $lycaon.jumpTo($('#team-tab-panel'));
      }

      this.$nextTick(() => {
        var option = { animate: 'slide' };
        if (bowser && bowser.mobile) {
          option = {};
        }
        $('#activity-timeline').verticalTimeline(option);

        if (this.selectedTab.tab.id === 'tab-git') {
          this.drawRevisionGraph();
        }

        this.submitForm('#query-counter-form');
      });
    },
    handleParsingQueryThreadForm: function () {
      this.queryPatern = 0;

      var argins = { id: this.team.id, page: this.currentPage };

      if (this.query.concept !== '') {
        argins.concept = Number(this.query.concept);
      }

      if (this.query.category !== '') {
        argins.category = Number(this.query.category);
      }

      if (this.query.status !== '') {
        argins.status = Number(this.query.status);
      }

      if (this.query.owner !== '') {
        argins.owner = Number(this.query.owner);
      }

      if (this.query.responsible !== '') {
        argins.responsible = Number(this.query.responsible);
      }

      if (this.query.milestone !== '') {
        argins.milestone = Number(this.query.milestone);
      }

      if (this.query.locked !== '') {
        argins.locked = this.query.locked;
      }

      if (this.query.priority !== '') {
        argins.priority = this.query.priority;
      }

      argins.local = this.query.local;
      argins.flag = this.query.flag;
      argins.working = this.query.working;
      argins.sort = this.query.sort;
      if (this.query.tagQuery) {
        argins.tags = [this.query.tagQuery];
      } else {
        argins.tags = this.selectedTags;
      }

      if (this.query.sustain) {
        expiringStorage.set(this.queryStorageKey, this.query, 30);
        this.filtered = true;
      } else {
        expiringStorage.delete(this.queryStorageKey);
        this.filtered = false;
      }

      return argins;
    },
    handleParsingAmbiguityForm: function () {
      if (!this.query.word) {
        return;
      }

      this.queryPatern = 1;
      var argins = { id: this.team.id, page: this.currentPage, word: this.query.word };
      return argins;
    },
    myThreadHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-thread-form');
    },
    handleParsingQueryMyThreadForm: function () {
      var argins = { id: this.team.id, page: this.currentPage };
      if (this.selectedCategory) {
        argins.category = this.selectedCategory;
      }
      argins.status = this.selectedStatus;
      return argins;
    },
    activityHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-activity-form');
    },
    handleParsingQueryActivityForm: function () {
      var argins = { id: this.team.id, page: this.currentPage, nonmyown: this.nonmyown };
      return argins;
    },
    flagHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-flag-form');
    },
    handleParsingQueryFlagForm: function () {
      var argins = { id: this.team.id, page: this.currentPage };
      return argins;
    },
    workingHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-working-form');
    },
    handleParsingQueryWorkingForm: function () {
      var argins = { id: this.team.id, page: this.currentPage };
      return argins;
    },
    localHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-private-form');
    },
    handleParsingQueryLocalForm: function () {
      var argins = { id: this.team.id, page: this.currentPage };
      return argins;
    },
    gitHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-git-form');
    },
    handleParsingQueryGitForm: function () {
      var argins = { id: this.team.id, page: this.currentPage };
      return argins;
    },
    wikiHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-wiki-form');
    },
    circularHandler($state) {
      this.infiniteState = $state;
      this.submitForm('#query-wiki-form');
    },
    handleParsingQueryWikiForm: function () {
      var argins = {
        team: this.team.id,
        tags: this.selectedWikiTags,
        isFlags: this.wikiflags,
        page: this.currentPage,
      };
      return argins;
    },
    handleParsingQueryVoteForm: function () {
      var argins = {
        page: this.currentPage,
        voteState: Number(this.voteState),
      };
      return argins;
    },
    showAllMember: function () {
      this.allMembers = [];
      this.membersPage = 1;
      this.submitForm('#query-member-form');
      this.showMemberModal = true;
    },
    hideMembers: function () {
      this.allMembers = [];
      this.membersPage = 1;
      this.showMemberModal = false;
    },
    submittedMemberForm: function (response) {
      if (!response.members) {
        console.log('data not found!');
        return;
      }

      if (response.members.length) {
        this.membersPage += 1;
        this.allMembers.push(...response.members);
        if (this.memberInfiniteState) this.memberInfiniteState.loaded();
      } else {
        if (this.memberInfiniteState) this.memberInfiniteState.complete();
      }
      this.cloudSuccess = true;
    },
    handleParsingMemberForm: function () {
      var argins = { id: this.team.id, page: this.membersPage };
      return argins;
    },
    allMemberHandler($state) {
      this.memberInfiniteState = $state;
      this.submitForm('#query-member-form');
    },
    threadLink: function (thread) {
      return `/${this.organization.handleId}/thread/${thread.id}`;
    },
    gitLink: function (id) {
      return `/${this.organization.handleId}/team/git/${id}`;
    },
    chooseMe: function (id) {
      if (id === 0) {
        this.$set(this.query, 'responsible', this.me.id);
      } else {
        this.$set(this.query, 'owner', this.me.id);
      }
    },
    submittedCounterForm: function (response) {
      this.cloudSuccess = true;
      if (!response.counter) {
        console.log('data not found!');
        return;
      }
      if (response.counter) {
        this.counter = Object.assign({}, this.counter, {
          working: response.counter.working,
          myThread: response.counter.myThread,
          votes: response.counter.votes,
          //flag: data.counter.flag,
          //local: data.counter.local,
        });
      }
    },
    handleParsingCounterForm: function () {
      return { id: this.team.id };
    },
    drawRevisionGraph: function () {
      if (this.queryResults.length < 1) {
        this.revisionGraph = null;
        return;
      }

      var self = this;
      var graph_space = 0;

      var setNode = function (parent, node) {
        //
        if (parent.space == undefined) {
          parent.space = node;
        } else {
          node = parent.space;
        }
        if (parent.space > graph_space) {
          graph_space = parent.space;
        }

        if (parent.refs) {
          var refs = parent.refs.trim().split(',');
          var i = 0;
          for (let hash of refs) {
            var target = _.find(self.queryResults, (o) => {
              return o.hash === hash.trim();
            });
            if (target) {
              setNode(target, node + i);
            }
            i++;
          }
        }
      };
      setNode(this.queryResults[0], 0);

      var changesets = [];
      var i = 0;
      _.forEachRight(this.queryResults, function (commit) {
        var clone = _.extend({}, commit);
        clone.rdmid = i;
        changesets.push(clone);
        i++;
      });

      var max_rdmid = changesets.length - 1;
      var XSTEP = 30;
      var commit_table_rows = $('.changeset-container');
      var holder = document.getElementById('holder');

      if (this.revisionGraph != null) {
        this.revisionGraph.set().clear();
      } else {
        this.revisionGraph = Raphael(holder);
      }

      var top = this.revisionGraph.set();
      var graph_x_offset =
        commit_table_rows.first().find('.card').first().position().left - $(holder).position().left;
      var graph_y_offset = $(holder).position().top;
      var graph_right_side = graph_x_offset + (graph_space + 1) * XSTEP;
      var graph_bottom =
        commit_table_rows.last().position().top +
        commit_table_rows.last().height() -
        graph_y_offset;

      this.revisionGraph.setSize(graph_right_side, graph_bottom);
      $('.git-card').css({ 'margin-left': `${graph_right_side}px` });

      var colorSchemes = Chart.colorschemes;
      var colors = colorSchemes.tableau.Classic10;
      Raphael.getColor.reset();
      for (var k = 10; k <= graph_space; k++) {
        colors.push(Raphael.getColor());
      }

      var yForRow = function (index) {
        var row = commit_table_rows.eq(index);
        return row.position().top + row.height() / 2 - graph_y_offset;
      };

      var parent_commit;
      var x, y, parent_x, parent_y;
      var path;

      _.forEach(changesets, function (commit) {
        if (!commit.space) {
          commit.space = 0;
        }
        y = yForRow(max_rdmid - commit.rdmid);
        x = graph_x_offset + XSTEP / 2 + XSTEP * commit.space;
        self.revisionGraph
          .circle(x, y, 5)
          .attr({ fill: colors[commit.space], stroke: 'none' })
          .toFront();

        if (commit.refs) {
          var refs = commit.refs.trim().split(',');
          _.forEach(refs, function (parent_scmid) {
            parent_commit = _.find(changesets, (o) => {
              return o.hash === parent_scmid.trim();
            });
            if (parent_commit) {
              parent_y = yForRow(max_rdmid - parent_commit.rdmid);
              parent_x = graph_x_offset + XSTEP / 2 + XSTEP * parent_commit.space;
              if (parent_commit.space == commit.space) {
                // vertical path
                path = self.revisionGraph.path(['M', x, y, 'V', parent_y]);
                path.attr({ stroke: colors[commit.space], 'stroke-width': 1.5 }).toBack();
              } else {
                // path to a commit in a different branch (Bezier curve)
                path = self.revisionGraph.path([
                  'M',
                  x,
                  y,
                  'C',
                  x + (parent_x - x) / 2,
                  y + (parent_y - y) / 2,
                  parent_x,
                  parent_y - (parent_y - y) / 2,
                  parent_x,
                  parent_y,
                ]);
                if (parent_commit.space > commit.space) {
                  path.attr({ stroke: colors[parent_commit.space], 'stroke-width': 1.5 }).toBack();
                } else {
                  path.attr({ stroke: colors[commit.space], 'stroke-width': 1.5 }).toBack();
                }
              }
            } else {
              // vertical path ending at the bottom of the revisionGraph
              path = self.revisionGraph.path(['M', x, y, 'V', graph_bottom]);
              path.attr({ stroke: colors[commit.space], 'stroke-width': 1.5 }).toBack();
            }
          });
        }
      });

      top.toFront();
    },
  },
  computed: {
    showGit: function () {
      return this.team.useGit;
    },
    queryStorageKey() {
      return `lycaon-team-query.cache.${window.location.host}${window.location.pathname}`;
    },
    infiniteId() {
      return new Date();
    },
  },
});
