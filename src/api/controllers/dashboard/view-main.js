module.exports = {
  friendlyName: 'View main page',
  description: 'Display the dashboard "main" page.',
  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
  },
  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/main',
      description: 'Display the main page for users.',
    },
  },
  fn: async function (inputs) {
    var response = {
      categories: [],
      tags: [],
    };

    var NATIVE_COUNT_SQL = `
select count("team__teams"."id") as qty
  from "public"."team_users__user_teams" as "team_users__user_teams__teams" 
  left outer join "team" as "team__teams" on "team_users__user_teams__teams"."team_users" = "team__teams"."id" 
 where "team__teams"."deleted" = false
   and "team_users__user_teams__teams"."user_teams" = $1
`;

    try {
      var rawResult = await sails.sendNativeQuery(NATIVE_COUNT_SQL, [this.req.me.id]);
      response.records = rawResult.rows[0].qty;

      response.categories = await Category.find()
        .where({ organization: this.req.organization.id, deleted: false })
        .sort('displayOrder ASC');
      response.tags = await Tag.find({ organization: this.req.organization.id }).sort('name ASC');

      response.messageStack = await sails.helpers.findMessage.with({ me: this.req.me });
    } catch (err) {
      sails.log.error(err);
      throw err;
    }

    this.req.session.ReferencePoint = [];
    this.req.session.ReferencePoint.push(this.req.originalUrl);

    return response;
  },
};
