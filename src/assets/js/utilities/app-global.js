const draggable = window['vuedraggable'];

const { Editor } = toastui;
const { chart, codeSyntaxHighlight, colorSyntax, uml, tableMergedCell } = Editor.plugin;
const chartOptions = {
  minWidth: 100,
  maxWidth: 600,
  minHeight: 100,
  maxHeight: 300,
};

const videoPlugin = function () {
  Editor.codeBlockManager.setReplacer('video', (url) => {
    // Indentify multiple code blocks
    const wrapperId = `yt${Math.random().toString(36).substr(2, 10)}`;

    var renderVideo = function (wrapperId, url) {
      const el = document.querySelector(`#${wrapperId}`);

      el.innerHTML = `<video class="video-player" width="420" height="315" src="${url}" controls playsinline><p>動画を再生するにはvideoタグをサポートしたブラウザが必要です。</p></video>`;
    };
    // Avoid sanitizing iframe tag
    setTimeout(renderVideo.bind(null, wrapperId, url), 0);

    return `<div id="${wrapperId}" class="plugin-video"></div>`;
  });
};
const youtubePlugin = function () {
  Editor.codeBlockManager.setReplacer('youtube', (youtubeId) => {
    // Indentify multiple code blocks
    const wrapperId = `yt${Math.random().toString(36).substr(2, 10)}`;

    var renderYoutube = function (wrapperId, youtubeId) {
      const el = document.querySelector(`#${wrapperId}`);

      el.innerHTML = `<iframe width="420" height="315" src="https://www.youtube.com/embed/${youtubeId}"></iframe>`;
    };
    // Avoid sanitizing iframe tag
    setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);

    return `<div id="${wrapperId}" class="plugin-youtube"></div>`;
  });
};
const soundcloudPlugin = function () {
  Editor.codeBlockManager.setReplacer('soundcloud', (innerHTML) => {
    var iframe = $(innerHTML)[0];
    if (!iframe) {
      return '';
    }
    if (!iframe.src.startsWith('https://w.soundcloud.com/player/')) {
      return '';
    }

    // Indentify multiple code blocks
    const wrapperId = `sc${Math.random().toString(36).substr(2, 10)}`;

    var renderSoundcloud = function (wrapperId, innerHTML) {
      const el = document.querySelector(`#${wrapperId}`);
      el.innerHTML = innerHTML;
    };
    // Avoid sanitizing iframe tag
    setTimeout(renderSoundcloud.bind(null, wrapperId, innerHTML), 0);

    return `<div id="${wrapperId}" class="plugin-soundcloud"></div>`;
  });
};
const googleMapPlugin = function () {
  Editor.codeBlockManager.setReplacer('googlemap', (innerHTML) => {
    var iframe = $(innerHTML)[0];
    if (!iframe) {
      return '';
    }
    if (!iframe.src.startsWith('https://www.google.com/maps/')) {
      return '';
    }

    // Indentify multiple code blocks
    const wrapperId = `gm${Math.random().toString(36).substr(2, 10)}`;

    var renderGoogleMap = function (wrapperId, innerHTML) {
      const el = document.querySelector(`#${wrapperId}`);
      el.innerHTML = innerHTML;
    };
    // Avoid sanitizing iframe tag
    setTimeout(renderGoogleMap.bind(null, wrapperId, innerHTML), 0);

    return `<div id="${wrapperId}" class="plugin-googlemap"></div>`;
  });
};
const twitterPlugin = function () {
  Editor.codeBlockManager.setReplacer('twitter', (innerHTML) => {
    // Indentify multiple code blocks
    const wrapperId = `tw${Math.random().toString(36).substr(2, 10)}`;

    var renderTwitter = function (wrapperId, innerHTML) {
      const el = document.querySelector(`#${wrapperId}`);
      el.innerHTML = innerHTML;
    };
    // Avoid sanitizing iframe tag
    setTimeout(renderTwitter.bind(null, wrapperId, innerHTML), 0);

    return `<div id="${wrapperId}" class="plugin-twitter"></div>`;
  });
};

const formatter = new Intl.NumberFormat('ja-JP');
const percentFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const floatFormatter = new Intl.NumberFormat('ja-JP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const markdownIt = window.markdownit();

const linkify = markdownIt.linkify;
linkify.add('#', {
  validate: function (text, pos, self) {
    if (!SAILS_LOCALS.me || !SAILS_LOCALS.me.organization) {
      return 0;
    }

    var tail = text.slice(pos);

    if (!self.re.thread) {
      self.re.thread = new RegExp('^([0-9]){1,8}(?=$|' + self.re.src_ZPCc + ')');
    }
    if (self.re.thread.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `#` ("##threadid" is invalid)
      if (pos >= 2 && tail[pos - 2] === '#') {
        return false;
      }
      return tail.match(self.re.thread)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url = `/${SAILS_LOCALS.me.organization.handleId}/thread/` + match.text.trim().replace(/^#/, '');
    match.text = match.text.trim() + ' ';
  },
});
linkify.add('wiki', {
  validate: function (text, pos, self) {
    if (!SAILS_LOCALS.me || !SAILS_LOCALS.me.organization) {
      return 0;
    }

    var tail = text.slice(pos);

    if (!self.re.wiki) {
      self.re.wiki = new RegExp('^([0-9]){1,8}(?=$|' + self.re.src_ZPCc + ')');
    }
    if (self.re.wiki.test(tail)) {
      return tail.match(self.re.wiki)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url = `/${SAILS_LOCALS.me.organization.handleId}/wiki/` + match.text.trim().replace(/^wiki/, '');
    match.text = match.text.trim() + ' ';
  },
});
linkify.add('git/', {
  validate: function (text, pos, self) {
    if (!SAILS_LOCALS.me || !SAILS_LOCALS.me.organization || !SAILS_LOCALS.team) {
      return 0;
    }
    if (!SAILS_LOCALS.team.useGit) {
      return 0;
    }

    var tail = text.slice(pos);

    if (!self.re.gitsha) {
      self.re.gitsha = new RegExp('^([a-z0-9]){40}(?=$|' + self.re.src_ZPCc + ')');
    }
    if (self.re.gitsha.test(tail)) {
      return tail.match(self.re.gitsha)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url =
      `/${SAILS_LOCALS.me.organization.handleId}/team/${SAILS_LOCALS.team.id}/git/` +
      match.text.trim().replace(/^git\//, '');
    match.text = match.text.trim() + ' ';
  },
});
linkify.add('コミット:', {
  validate: function (text, pos, self) {
    if (!SAILS_LOCALS.me || !SAILS_LOCALS.me.organization || !SAILS_LOCALS.team) {
      return 0;
    }
    if (!SAILS_LOCALS.team.useGit) {
      return 0;
    }

    var tail = text.slice(pos);

    if (!self.re.gitsha2) {
      self.re.gitsha2 = new RegExp('^[ ]{0,}([a-z0-9]){40}(?=$|' + self.re.src_ZPCc + ')');
    }
    if (self.re.gitsha2.test(tail)) {
      return tail.match(self.re.gitsha2)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url =
      `/${SAILS_LOCALS.me.organization.handleId}/team/${SAILS_LOCALS.team.id}/git/` +
      match.text.replace(/^コミット\:/, '').trim();
    match.text = match.text.trim() + ' ';
  },
});
linkify.add('commit:', {
  validate: function (text, pos, self) {
    if (!SAILS_LOCALS.me || !SAILS_LOCALS.me.organization || !SAILS_LOCALS.team) {
      return 0;
    }
    if (!SAILS_LOCALS.team.useGit) {
      return 0;
    }

    var tail = text.slice(pos);

    if (!self.re.gitsha2) {
      self.re.gitsha2 = new RegExp('^[ ]{0,}([a-z0-9]){40}(?=$|' + self.re.src_ZPCc + ')');
    }
    if (self.re.gitsha2.test(tail)) {
      return tail.match(self.re.gitsha2)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url =
      `/${SAILS_LOCALS.me.organization.handleId}/team/${SAILS_LOCALS.team.id}/git/` +
      match.text.replace(/^commit\:/, '').trim();
    match.text = match.text.trim() + ' ';
  },
});
linkify.add('@', {
  validate: function (text, pos, self) {
    var tail = text.slice(pos);

    if (!self.re.twitter) {
      self.re.twitter = new RegExp('^([a-zA-Z0-9_]){1,15}(?!_)(?=$|' + self.re.src_ZPCc + ')');
    }
    if (self.re.twitter.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === '@') {
        return false;
      }
      return tail.match(self.re.twitter)[0].length;
    }
    return 0;
  },
  normalize: function (match) {
    match.url = 'https://twitter.com/' + match.text.trim().replace(/^@/, '');
    match.text = match.text.trim() + ' ';
  },
});

class ExpiringStorage {
  get(key) {
    const cached = JSON.parse(localStorage.getItem(key));

    if (!cached) {
      return null;
    }

    const expires = new Date(cached.expires);

    if (expires < new Date()) {
      localStorage.removeItem(key);
      return null;
    }

    return cached.value;
  }

  set(key, value, lifeTimeInMinutes) {
    const currentTime = new Date().getTime();

    const expires = new Date(currentTime + lifeTimeInMinutes * 60000);

    localStorage.setItem(key, JSON.stringify({ value, expires }));
  }

  delete(key) {
    localStorage.removeItem(key);
  }
}
const expiringStorage = new ExpiringStorage();

_.mixin({ deepExtend: underscoreDeepExtend(_) });

// eslint-disable-next-line no-redeclare
const $lycaon = {
  formatter: {
    formatCalender: function (at, isShort) {
      if (!at || at === 0) {
        return '';
      }
      if (SAILS_LOCALS) {
        moment.locale(SAILS_LOCALS.language);
        var tz = moment.tz(Number(at), moment.tz.guess());

        if (isShort) {
          if (SAILS_LOCALS.language === 'ja') {
            return tz.format('LL');
          } else {
            return tz.format('ddd, L');
          }
        } else {
          if (SAILS_LOCALS.language === 'ja') {
            return tz.format('LLL');
          } else {
            return tz.format('LLLL');
          }
        }
      }

      if (isShort) {
        return moment(Number(at)).format('LL');
      }
      return moment(Number(at)).format('LLL');
    },
    formatTimeago: function (at, isShort) {
      if (!at || at === 0) {
        return '';
      }
      var now = new Date().getTime();
      var timeDifference = Math.abs(now - at);

      // If the timestamp is less than a day old, format as time ago.
      if (timeDifference < 1000 * 60 * 60 * 24) {
        if (SAILS_LOCALS) {
          moment.locale(SAILS_LOCALS.language);
        }
        return {
          value: moment(Number(at)).fromNow(),
          state: true,
        };
      } else {
        return {
          value: $lycaon.formatter.formatCalender(at, isShort),
        };
      }
    },
    dateAgo: function (val, isShort) {
      var results = $lycaon.formatter.formatTimeago(val, isShort);
      return results.value;
    },
    formatDate: function (val) {
      return $lycaon.formatter.formatCalender(val, true);
    },
    formatDatetime: function (val) {
      return $lycaon.formatter.formatCalender(val);
    },
  },
  showToast: function (key, parames) {
    var message = this.i18n(key, parames);
    if (!message) {
      return;
    }
    Vue.$toast.default(message);
  },
  infoToast: function (key, parames) {
    var message = this.i18n(key, parames);
    if (!message) {
      return;
    }
    Vue.$toast.info(message, { duration: 5000 });
  },
  infoKeepToast: function (key, parames) {
    var message = this.i18n(key, parames);
    if (!message) {
      return;
    }
    Vue.$toast.info(message, { duration: 50000 });
  },
  successToast: function (key, parames) {
    var message = this.i18n(key, parames);
    if (!message) {
      return;
    }
    Vue.$toast.success(message, { duration: 3000 });
  },
  warningToast: function (key, parames) {
    var message = this.i18n(key, parames);
    if (!message) {
      return;
    }
    Vue.$toast.warning(message, { duration: 4000 });
  },
  errorToast: function (key, parames) {
    var message = this.i18n(key, parames);
    if (!message) {
      return;
    }
    Vue.$toast.error(message, { duration: 50000 });
  },
  cloudSuccessToast: function (message) {
    //サーバー側でメッセージ構築
    if (!message) {
      return;
    }
    Vue.$toast.success(message, { duration: 2500 });
  },
  cloudErrorToast: function (message) {
    //サーバー側でメッセージ構築
    if (!message) {
      return;
    }
    Vue.$toast.error(message, { duration: 50000 });
  },
  socketToast: function (message) {
    if (!message || !message.key) {
      return;
    }

    Vue.$toast.default(this.i18n(message.key, message.params), {
      duration: 4000,
      position: 'bottom',
    });

    Push.create(this.i18n(message.key, message.params));
  },
  reloadRequestToast: function (message) {
    if (!message || !message.key) {
      return;
    }

    if (message.priority) {
      message.params.push(this.i18n(message.priority));
    }

    var token = this.i18n(message.key, message.params);
    token += ` <br><a href="" onclick="location.reload();">${this.i18n('Reload the page')}</a>`;
    Vue.$toast.default(token, {
      duration: 5000,
      position: 'bottom',
      queue: true,
    });

    Push.create(token);
  },
  clearToast: function () {
    Vue.$toast.clear();
  },
  jumpTo: function ($target) {
    if ($target.length < 1) {
      return false;
    }
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: $target.offset().top - 100,
        },
        500,
        'easeOutQuart'
      );
    return false;
  },
  scrollTop: function () {
    $('html, body').stop().animate(
      {
        scrollTop: 0,
      },
      500,
      'easeOutQuart'
    );
    return false;
  },
  createUuid: function (myStrong) {
    let strong = 1000;
    if (myStrong) {
      strong = myStrong;
    }
    return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16);
  },
  invalidEnterKey: function () {
    $(':checkbox, :text, :password, :radio').on('keydown', (e) => {
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        return false;
      } else {
        return true;
      }
    });
  },
  diff: function (oldVal, newVal, onlyDiffline = false) {
    var marks = [];
    var result = Diff.diffLines(oldVal, newVal);
    result.forEach((part) => {
      var prefix = part.added ? '+' : part.removed ? '-' : ' ';
      if (!onlyDiffline) {
        marks.push({ prefix: prefix, value: part.value });
      } else {
        if (part.added || part.removed) {
          marks.push({ prefix: prefix, value: part.value });
        }
      }
    });
    return marks;
  },
  regexEscape: function (str) {
    var reRegExp = /[\\^$.*+?()[\]{}|]/g;
    var reHasRegExp = new RegExp(reRegExp.source);

    return str && reHasRegExp.test(str) ? str.replace(reRegExp, '\\$&') : str;
  },
  passwordCheck: function (val) {
    var map = {
      'Straight rows of keys are easy to guess': '横並びのキー配列は簡単に推測できます',
      'Short keyboard patterns are easy to guess': '短いキーボードパターンは簡単に推測できます',
      'Repeats like "aaa" are easy to guess': '「aaa」のような繰り返しは簡単に推測できます',
      'Repeats like "abcabcabc" are only slightly harder to guess than "abc"':
        '「abcabcabc」のような繰り返しは、「abc」よりも推測が少しだけ難しいです。',
      'Sequences like abc or 6543 are easy to guess': 'abcや6543のようなシーケンスは簡単に推測できます',
      'Recent years are easy to guess': '年号は推測しやすいです',
      'Dates are often easy to guess': '多くの場合、日付は簡単に推測できます',
      'This is similar to a commonly used password': 'これはよくあるパスワードに似ています',
      'This is a top-10 common password': 'これはトップ10のよくあるパスワードです',
      'This is a top-100 common password': 'これはトップ100のよくあるパスワードです',
      'This is a very common password': 'これは非常によくあるパスワードです',
      // eslint-disable-next-line quotes
      "Capitalization doesn't help very much": '大文字はあまり役に立ちません',
      'All-uppercase is almost as easy to guess as all-lowercase':
        'すべて大文字は、すべて小文字と同じくらい簡単に推測できます',
      'A word by itself is easy to guess': '単語は簡単に推測できます',
    };

    var result = zxcvbn(val);
    var score = { score: result.score };

    var warning = result.feedback.warning;
    if (SAILS_LOCALS.language === 'ja') {
      if (result.feedback.warning && map[result.feedback.warning]) {
        warning = `${map[result.feedback.warning]}`;
      }
    }

    switch (result.score) {
      case 0:
        score.crackScore = this.i18n('Very weak password {0}').format(warning);
        score.scoreClass = 'score-color-0';
        break;
      case 1:
        score.crackScore = this.i18n('A slightly weak password {0}').format(warning);
        score.scoreClass = 'score-color-1';
        break;
      case 2:
        // eslint-disable-next-line quotes
        score.crackScore = this.i18n("It's a good password");
        score.scoreClass = 'score-color-2';
        break;
      case 3:
        score.crackScore = this.i18n('A slightly stronger password');
        score.scoreClass = 'score-color-3';
        break;
      case 4:
        score.crackScore = this.i18n('Very strong password');
        score.scoreClass = 'score-color-4';
        break;
      default:
        score.crackScore = '';
        score.scoreClass = '';
        break;
    }

    return score;
  },
  /* https://github.com/yairEO/tagify */
  tagifySettings: {
    //placeholder: '',
    whitelist: [],
    enforceWhitelist: true,
    editTags: 1,
    maxTags: 10,
    dropdown: {
      maxItems: 50,
      classname: 'tags-look',
      enabled: 0,
      closeOnSelect: false,
    },
  },
  rejectIgnoreExts: function (files, key, whitelist) {
    return _.filter(files, (entry) => {
      var exists = _.find(whitelist, (ext) => {
        return entry[key].endsWith(ext);
      });
      return exists;
    });
  },
  i18nInit: function () {
    var lang = i18next.language;
    if (SAILS_LOCALS) {
      lang = SAILS_LOCALS.language;
    }

    var resources = {};
    _.each(SAILS_LOCALS.i18nlocales, (entry) => {
      var suffix = entry.replace('-', '_');
      if (lang === suffix) {
        resources[entry] = {
          translation: eval('lycaon_lang_' + suffix),
        };
      }
    });

    i18next.init({
      lng: lang,
      debug: true,
      keySeparator: false,
      nsSeparator: false,
      pluralSeparator: false,
      contextSeparator: false,
      resources: resources,
    });
  },
  i18n: function (key, parames) {
    var message = i18next.t(key);
    if (!parames || parames.length < 1) {
      return message;
    }
    return message.replace(/{(\d+)}/g, (match, number) => {
      return typeof parames[number] !== undefined ? parames[number] : match;
    });
  },
  i18nformatN: function (singular, plural, count) {
    var message;
    if (count === 1) {
      message = i18next.t(singular);
    } else {
      message = i18next.t(plural);
    }
    var parames = [count];
    return message.replace(/{(\d+)}/g, (match, number) => {
      return typeof parames[number] !== undefined ? parames[number] : match;
    });
  },
  stackExchange: function (data, stack, handleId) {
    stack.push(data);
    if (stack.length > 30) {
      stack.shift();
    }

    $('#stack-exchange-list').empty();
    var self = this;
    var i = 0;
    _.each(stack, (entry) => {
      var ref = `/${handleId}/thread/${entry.thread.no}`;

      if (i > 0) {
        $('#stack-exchange-list').append('<div class="dropdown-divider"></div>');
      }
      $('#stack-exchange-list').append(
        `<a class="dropdown-item text-wrap waves-effect waves-light" href="${ref}">${self.i18n(
          entry.message.key,
          entry.message.params
        )} (${self.formatter.dateAgo(entry.timespan)})</a>`
      );
      i++;
    });

    if (stack.length > 0) {
      $('#stack-exchange').show();
    }
  },
  stackMessage: function (data, stack, handleId) {
    if (data && data.data) {
      stack.push(data);
      if (stack.length > 30) {
        stack.shift();
      }
    }

    $('#stack-message-list').empty();
    var self = this;
    var i = 0;
    _.each(stack, (entry) => {
      var ref = `/${handleId}/member/${entry.data.sendFrom.id}?tab=tab-message`;

      if (i > 0) {
        $('#stack-message-list').append('<div class="dropdown-divider"></div>');
      }
      $('#stack-message-list').append(
        `<a class="dropdown-item text-wrap waves-effect waves-light" href="${ref}">${self.i18n(
          entry.message.key,
          entry.message.params
        )} (${self.formatter.dateAgo(entry.data.createdAt)})</a>`
      );
      i++;
    });

    if (stack.length > 0) {
      $('#stack-message').show();
    } else {
      $('#stack-message').hide();
    }
  },
  axios: {
    get: async function (url, config, common) {
      var conf = _.extend({}, config || {});
      axios.defaults.headers.common = _.extend(
        {
          'x-csrf-token': SAILS_LOCALS._csrf,
        },
        common || {}
      );
      return await axios.get(url, conf);
    },
    getWith: async function (url, data, config, common) {
      var conf = _.extend({}, config || {});
      axios.defaults.headers.common = _.extend(
        {
          'x-csrf-token': SAILS_LOCALS._csrf,
        },
        common || {}
      );
      return await axios.get(
        url,
        {
          params: data,
        },
        conf
      );
    },
    post: async function (url, data, config, common) {
      var conf = _.extend({}, config || {});
      axios.defaults.headers.common = _.extend(
        {
          'x-csrf-token': SAILS_LOCALS._csrf,
        },
        common || {}
      );
      return await axios.post(url, data, conf);
    },
    put: async function (url, data, config, common) {
      var conf = _.extend({}, config || {});
      axios.defaults.headers.common = _.extend(
        {
          'x-csrf-token': SAILS_LOCALS._csrf,
        },
        common || {}
      );
      return await axios.put(url, data, conf);
    },
    delete: async function (url, data, config, common) {
      var conf = _.extend({}, config || {});
      axios.defaults.headers.common = _.extend(
        {
          'x-csrf-token': SAILS_LOCALS._csrf,
        },
        common || {}
      );
      return await axios.delete(url, data, conf);
    },
  },
  socket: {
    post: function (url, data, callback) {
      io.socket.request(
        {
          method: 'post',
          url: url,
          data: data,
          headers: {
            'x-csrf-token': SAILS_LOCALS._csrf,
          },
        },
        (res, jwres) => {
          console.log(jwres.statusCode);
          if (jwres.error) {
            console.log(jwres.error);
            return;
          }
          if (_.isFunction(callback)) {
            return callback(res);
          }
        }
      );
    },
  },
  markdown: {
    extendedAutolinks: function (content) {
      var matched = linkify.match(content);

      if (matched) {
        return matched.map((matches) => {
          var { text, url, index, lastIndex } = matches;
          var range = [index, lastIndex];

          return { text, url, range };
        });
      }

      return null;
    },
    defaultEditorPlugin: [
      [chart, chartOptions],
      codeSyntaxHighlight,
      colorSyntax,
      uml,
      tableMergedCell,
      youtubePlugin,
      soundcloudPlugin,
      videoPlugin,
      googleMapPlugin,
      twitterPlugin,
    ],
    /** https://nhn.github.io/tui.editor */
    createViewer: function (selector, initialValue = '', height = '100%') {
      return Editor.factory({
        el: document.querySelector(selector),
        initialEditType: 'markdown',
        viewer: true,
        height: height,
        initialValue: initialValue,
        plugins: this.defaultEditorPlugin,
        extendedAutolinks: this.extendedAutolinks,
      });
    },
    createEditor: function (
      selector,
      height = '300px',
      previewStyle = 'tab', //tab|vertical
      placeholder = '',
      addImageBlobHook
    ) {
      var editor = new Editor({
        el: document.querySelector(selector),
        language: SAILS_LOCALS.language,
        initialEditType: 'markdown',
        height: height,
        previewStyle: previewStyle,
        placeholder: placeholder,
        hooks: {
          addImageBlobHook: addImageBlobHook,
        },
        plugins: this.defaultEditorPlugin,
        extendedAutolinks: this.extendedAutolinks,
      });

      $(selector + ' button').prop('type', 'button');

      return editor;
    },
    createVoteSneezeEditor: function (
      selector,
      height = '300px',
      previewStyle = 'tab', //tab|vertical
      placeholder = ''
      //addImageBlobHook
    ) {
      var editor = new Editor({
        el: document.querySelector(selector),
        language: SAILS_LOCALS.language,
        initialEditType: 'markdown',
        height: height,
        previewStyle: previewStyle,
        placeholder: placeholder,
        hooks: {
          //addImageBlobHook: addImageBlobHook,
        },
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          'indent',
          'outdent',
          'divider',
          'table',
          'link',
          'divider',
          'code',
          'codeblock',
        ],
        plugins: this.defaultEditorPlugin,
        extendedAutolinks: this.extendedAutolinks,
      });

      $(selector + ' button').prop('type', 'button');

      return editor;
    },
    addToolberImageList: function (editor, done) {
      var toolbar = editor.getUI().getToolbar();
      editor.eventManager.addEventType('clickCustomButton');
      editor.eventManager.listen('clickCustomButton', done);

      var createButton = function () {
        var button = document.createElement('button');

        button.className = 'image-list';
        button.innerHTML = '<i class="far fa-images"></i>';

        return button;
      };

      toolbar.addItem({
        type: 'button',
        options: {
          el: createButton(),
          event: 'clickCustomButton',
          tooltip: i18next.t('View uploaded images in other threads and wikis'),
          style: 'color:black;background:none;',
        },
      });
    },
  },
};

$(() => {
  var $topBtn = $('.scrollTop-btn');
  $topBtn.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $topBtn.fadeIn();
    } else {
      $topBtn.fadeOut();
    }
  });
  $topBtn.on('click', $lycaon.scrollTop);

  $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover focus' });

  /* https://jdenticon.com/js-api/A_data-jdenticon-value.html */
  jdenticon.config = { replaceMode: 'observe' };

  new SmoothScroll('a[href*="#"]', {
    speed: 300,
    header: 'header',
  });

  $(document).bind('drop dragover', (e) => {
    e.preventDefault();
  });

  var lycaonLoad = function () {
    var url = $(location).attr('href');
    if (url.indexOf('#') !== -1) {
      var anchor = url.split('#');
      if (anchor.length > 1) {
        var ref = anchor[anchor.length - 1];
        if (ref) {
          var target = $('#' + decodeURI(ref));
          if (target.length) {
            var fixedHeader = document.querySelector('header');
            if (fixedHeader) {
              var height = parseInt(window.getComputedStyle(fixedHeader).height, 10);
              var pos = Math.floor(target.offset().top) - (height + fixedHeader.offsetTop);
              $('html, body').animate({ scrollTop: pos }, 500);
            }
          }
        }
      }
    }

    $('#new-notification').show();

    $('body').on('click', (e) => {
      $('.user-avater-icon, .hyper-link-icon').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
          $(this).popover('hide');
        }
      });
    });

    $(window).scroll(() => {
      $('.popover').popover('hide');
    });
  };

  $(document).ready(lycaonLoad);
  document.addEventListener('DOMContentLoaded', lycaonLoad, false);
  document.addEventListener('deviceready', lycaonLoad, false);

  window.cookieconsent.initialise({
    palette: {
      popup: {
        background: '#efefef',
        text: '#404040',
      },
      button: {
        background: '#8ec760',
        text: '#ffffff',
      },
    },
    theme: 'edgeless',
    content: {
      message: $lycaon.i18n('This website uses cookies to ensure you get the best experience on our website'),
      dismiss: $lycaon.i18n('Got it!'),
      link: $lycaon.i18n('Learn more'),
      href: '/doc/policy?tab=privacy',
    },
  });
});
