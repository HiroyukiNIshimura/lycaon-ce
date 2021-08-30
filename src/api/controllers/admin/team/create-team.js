module.exports = {
  friendlyName: 'Create team',

  description: 'Create team api.',

  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    selectedUsers: {
      type: 'ref',
    },
    selectedCategories: {
      type: 'ref',
    },
    useGit: {
      type: 'boolean',
    },
    gitOrigin: {
      type: 'string',
      defaultsTo: 'master',
    },
    connectType: {
      type: 'number',
      defaultsTo: 0,
      isIn: [0, 1],
      description: '0:github、1:gitlab',
    },
    gitRepository: {
      type: 'string',
    },
    gitUser: {
      type: 'string',
    },
    gitPassword: {
      type: 'string',
    },
    gitlabApi: {
      type: 'string',
      isURL: true,
    },
    gitlabToken: {
      type: 'string',
    },
    gitlabProjectId: {
      type: 'string',
    },
    defaultConcept: {
      type: 'number',
      defaultsTo: 0,
      isIn: [0, 1],
    },
  },
  exits: {
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a thread that has not joined.',
    },
    nameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided name is already in use.',
    },
    repositoryNotfound: {
      statusCode: 405,
      description: 'repository not founded',
    },
    unplanned: {
      statusCode: 405,
      description: 'Out of range of plan.',
    },
    badRequest: {
      description: 'BadRequest.',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs) {
    if (!(await sails.helpers.planingTeam.with({ organization: this.req.organization.id }))) {
      throw 'unplanned';
    }

    var sames = await Team.count({ name: inputs.name, organization: this.req.organization.id });
    if (sames > 0) {
      throw 'nameAlreadyInUse';
    }

    var plan = sails.config.custom.plans[this.req.organization.plan];
    if (!plan.allowUseGit) {
      inputs.useGit = false;
    }

    if (inputs.useGit) {
      var res = await sails.helpers.gitRepositoryCheck.with({
        connectType: inputs.connectType,
        gitRepository: inputs.gitRepository,
        gitUser: inputs.gitUser,
        gitPassword: inputs.gitPassword,
        gitlabApi: inputs.gitlabApi,
        gitlabToken: inputs.gitlabToken,
        gitlabProjectId: inputs.gitlabProjectId,
      });
      if (res) {
        throw res;
      }
    }

    var created = {};

    var valuesToSet = {
      name: inputs.name,
      description: inputs.description,
      useGit: inputs.useGit,
      gitOrigin: inputs.gitOrigin,
      connectType: inputs.connectType,
      defaultConcept: inputs.defaultConcept,
      gitRepository: '',
      gitUser: '',
      gitPassword: '',
      gitlabApi: '',
      gitlabToken: '',
      gitlabProjectId: '',
      organization: this.req.organization.id,
    };

    try {
      if (valuesToSet.connectType === 0) {
        valuesToSet.gitRepository = inputs.gitRepository;
        valuesToSet.gitUser = inputs.gitUser;
        valuesToSet.gitPassword = inputs.gitPassword;
      } else {
        valuesToSet.gitlabApi = inputs.gitlabApi;
        valuesToSet.gitlabToken = inputs.gitlabToken;
        valuesToSet.gitlabProjectId = inputs.gitlabProjectId;
      }

      if (inputs.selectedUsers) {
        valuesToSet.users = inputs.selectedUsers.map((o) => o.id);
      }

      if (inputs.selectedCategories) {
        valuesToSet.categories = inputs.selectedCategories.map((o) => o.id);
      }

      var bot = await sails.helpers.getBot();

      await sails.getDatastore().transaction(async (db) => {
        created = await Team.create(valuesToSet).fetch().usingConnection(db);

        await Thread.create({
          no: await sails.helpers.getNextval.with({
            target: 'thread',
            handleId: this.req.organization.handleId,
          }),
          handleId: this.req.organization.handleId,
          subject: 'First thread',
          body: `


Team Project D has been created. Create threads as you come up with and communicate within the team!
Threads can be written in Markdown. Please refer to the [help](https://lycaon.bright-l.0am.jp/doc)  for the contents unique to Lycaon.
Close this thread at any time if you don't need it.

チーム Project D が作成されました。思いつくままスレッドを作成してチーム内でのコミュニケーションを進めていきましょう！
スレッドはMarkdownで記述できます。Lycaon独自の記述内容については[ヘルプ](https://lycaon.bright-l.0am.jp/doc)を参考にしてください。
このスレッドが必要なければいつでもクローズしてください。

## Markdown Samples

$$chart
,category1,category2
Jan,21,23
Feb,31,17

type: column
title: Monthly Revenue
x.title: Amount
y.title: Month
y.min: 1
y.max: 40
y.suffix: $
$$

\`\`\`js
console.log('foo')
\`\`\`

\`\`\`javascript
console.log('bar')
\`\`\`

\`\`\`html
<div id="editor"><span>baz</span></div>
\`\`\`

\`\`\`wrong
[1 2 3]
\`\`\`

\`\`\`clojure
[1 2 3]
\`\`\`

$$uml
partition Conductor {
  (*) --> "Climbs on Platform"
  --> === S1 ===
  --> Bows
}

partition Audience #LightSkyBlue {
  === S1 === --> Applauds
}

partition Conductor {
  Bows --> === S2 ===
  --> WavesArmes
  Applauds --> === S2 ===
}

partition Orchestra #CCCCEE {
  WavesArmes --> Introduction
  --> "Play music"
}
$$
`,
          concept: 0,
          status: 0,
          category: inputs.selectedCategories.map((o) => o.id)[0],
          team: created.id,
          owner: bot.id,
        }).usingConnection(db);
        //

        await sails.helpers.sendTeamMail.with({ id: created.id, action: 'create', db: db });
      });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.effectMessage = sails.__('You have created a team {0}').format(valuesToSet.name);

    return {
      id: created.id,
      name: created.name,
    };
  },
};
