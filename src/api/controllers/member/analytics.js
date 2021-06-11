const moment = require('moment');

module.exports = {
  friendlyName: 'Get User Analytics',

  description: 'Get User Analytics.',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
    range: {
      type: 'string',
      isIn: ['month', 'day', 'week', 'hour'],
      defaultTo: 'month',
    },
  },

  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = { analytics: {}, labels: [], summary: {} };

    response.user = await User.findOne({ id: inputs.id, deleted: false });
    if (!response.user) {
      throw 'notFound';
    }

    const NATIVE_SQL = {
      monthly: `
select to_char(to_timestamp("createdAt"/1000), 'YYYY/MM') as dt, count(*) as qty 
  from "thread_activity" 
 where "user" = $1 and "type" = $2 and "createdAt" >= $3 and "createdAt" <= $4
 group by to_char(to_timestamp("createdAt"/1000), 'YYYY/MM');
    `,
      daily: `
select to_char(to_timestamp("createdAt"/1000), 'DD') as dt, count(*) as qty 
  from "thread_activity" 
 where "user" = $1 and "type" = $2 and "createdAt" >= $3 and "createdAt" <= $4
 group by to_char(to_timestamp("createdAt"/1000), 'DD');
    `,
      hourly: `
select to_char(to_timestamp("createdAt"/1000), 'HH24') as dt, count(*) as qty 
  from "thread_activity" 
  where "user" = $1 and "type" = $2 and "createdAt" >= $3 and "createdAt" <= $4
  group by to_char(to_timestamp("createdAt"/1000), 'HH24');
        `,
      weekly: `
select to_char(to_timestamp("createdAt"/1000), 'D') as dt, count(*) as qty 
  from "thread_activity" 
 where "user" = $1 and "type" = $2 and "createdAt" >= $3 and "createdAt" <= $4
 group by to_char(to_timestamp("createdAt"/1000), 'D');
    `,
    };

    const NATIVE_WIKI_SQL = {
      monthly: `
select to_char(to_timestamp("createdAt"/1000), 'YYYY/MM') as dt, count(*) as qty 
  from "wiki" 
 where "owner" = $1 and "createdAt" >= $2 and "createdAt" <= $3
 group by to_char(to_timestamp("createdAt"/1000), 'YYYY/MM');
    `,
      daily: `
select to_char(to_timestamp("createdAt"/1000), 'DD') as dt, count(*) as qty 
  from "wiki" 
 where "owner" = $1 and "createdAt" >= $2 and "createdAt" <= $3
 group by to_char(to_timestamp("createdAt"/1000), 'DD');
    `,
      hourly: `
select to_char(to_timestamp("createdAt"/1000), 'HH24') as dt, count(*) as qty 
  from "wiki" 
  where "owner" = $1 and "createdAt" >= $2 and "createdAt" <= $3
  group by to_char(to_timestamp("createdAt"/1000), 'HH24');
        `,
      weekly: `
select to_char(to_timestamp("createdAt"/1000), 'D') as dt, count(*) as qty 
  from "wiki" 
 where "owner" = $1 and "createdAt" >= $2 and "createdAt" <= $3
 group by to_char(to_timestamp("createdAt"/1000), 'D');
    `,
    };

    const NATIVE_GIT_SQL = {
      monthly: `
select to_char(to_timestamp("commitAt"/1000), 'YYYY/MM') as dt, count(*) as qty 
  from "git_log" 
 where "author_email" = $1 and "commitAt" >= $2 and "commitAt" <= $3
 group by to_char(to_timestamp("commitAt"/1000), 'YYYY/MM');
    `,
      daily: `
select to_char(to_timestamp("commitAt"/1000), 'DD') as dt, count(*) as qty 
  from "git_log" 
 where "author_email" = $1 and "commitAt" >= $2 and "commitAt" <= $3
 group by to_char(to_timestamp("commitAt"/1000), 'DD');
    `,
      hourly: `
select to_char(to_timestamp("commitAt"/1000), 'HH24') as dt, count(*) as qty 
  from "git_log" 
  where "author_email" = $1 and "commitAt" >= $2 and "commitAt" <= $3
  group by to_char(to_timestamp("commitAt"/1000), 'HH24');
        `,
      weekly: `
select to_char(to_timestamp("commitAt"/1000), 'D') as dt, count(*) as qty 
  from "git_log" 
 where "author_email" = $1 and "commitAt" >= $2 and "commitAt" <= $3
 group by to_char(to_timestamp("commitAt"/1000), 'D');
    `,
    };

    const types = [
      'create',
      'update',
      'local',
      'update-category',
      'update-concept',
      'update-status',
      'update-duedate',
      'update-vote',
      'update-lock',
      'update-working',
      'responsible',
      'create-sneeze',
      'update-sneeze',
      'delete-sneeze',
      'create-reply',
      'update-reply',
      'delete-reply',
      'attach-file',
      'delete-file',
      //'milestone',
      //'relationship',
      //'delete-relationship',
      //'fork',
    ];

    var dt = new Date();
    dt.setDate(1);
    dt.setHours(0, 0, 0, 0);

    //12ヶ月前の月初
    var from = moment(dt).add(-12, 'months');
    //今月末
    var to = moment(dt).add(1, 'months').add(-1, 'days');

    var sql = NATIVE_SQL.monthly;
    var wikisql = NATIVE_WIKI_SQL.monthly;
    var gitsql = NATIVE_GIT_SQL.monthly;
    switch (inputs.range) {
      case 'day':
        sql = NATIVE_SQL.daily;
        wikisql = NATIVE_WIKI_SQL.daily;
        gitsql = NATIVE_GIT_SQL.daily;
        for (let i = 1; i < 32; i++) {
          response.labels.push(i);
        }
        break;
      case 'hour':
        sql = NATIVE_SQL.hourly;
        wikisql = NATIVE_WIKI_SQL.hourly;
        gitsql = NATIVE_GIT_SQL.hourly;
        for (let i = 0; i < 24; i++) {
          response.labels.push(i);
        }
        break;
      case 'week':
        sql = NATIVE_SQL.weekly;
        wikisql = NATIVE_WIKI_SQL.weekly;
        gitsql = NATIVE_GIT_SQL.weekly;
        response.labels = [
          sails.__('Sunday'),
          sails.__('Monday'),
          sails.__('Tuesday'),
          sails.__('Wednesday'),
          sails.__('Thursday'),
          sails.__('Friday'),
          sails.__('Saturday'),
        ];
        break;
      case 'month':
      default:
        var m = moment(dt).add(-12, 'months');
        response.labels.push(`${m.format('YYYY/MM')}`);
        for (let i = 0; i < 12; i++) {
          m.add(1, 'months');
          response.labels.push(`${m.format('YYYY/MM')}`);
        }
        break;
    }

    try {
      for (let type of types) {
        let result = await sails.sendNativeQuery(sql, [
          response.user.id,
          type,
          from.valueOf(),
          to.valueOf(),
        ]);
        response.analytics[type] = result.rows;
      }

      var result = await sails.sendNativeQuery(wikisql, [
        response.user.id,
        from.valueOf(),
        to.valueOf(),
      ]);
      response.analytics.wiki = result.rows;

      result = await sails.sendNativeQuery(gitsql, [
        response.user.emailAddress,
        from.valueOf(),
        to.valueOf(),
      ]);
      response.analytics.git = result.rows;
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    var summary = {
      create: [],
      effects: [],
      responsible: [],
      working: [],
      sneeze: [],
      reply: [],
      file: [],
      wiki: [],
      git: [],
    };

    _.forEach(response.analytics, function (values, key) {
      if (key.endsWith('-sneeze')) {
        _.merge(summary.sneeze, values);
      } else if (key.endsWith('-reply')) {
        _.merge(summary.reply, values);
      } else if (key.endsWith('-file')) {
        _.merge(summary.file, values);
      } else if (key === 'update-working') {
        _.merge(summary.working, values);
      } else if (key === 'responsible') {
        _.merge(summary.responsible, values);
      } else if (key === 'create') {
        _.merge(summary.create, values);
      } else if (key === 'wiki') {
        _.merge(summary.wiki, values);
      } else if (key === 'git') {
        _.merge(summary.git, values);
      } else {
        _.merge(summary.effects, values);
      }
    });

    _.forEach(summary, function (values, prop) {
      response.summary[prop] = _(values)
        .groupBy((x) => x.dt)
        .map((value, key) => ({ dt: key, qty: _.sum(value, 'qty') }))
        .value();
    });

    return response;
  },
};
