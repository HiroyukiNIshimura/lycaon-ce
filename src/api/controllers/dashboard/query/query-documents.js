module.exports = {
  friendlyName: 'Query attachments',
  description: 'Query attachments.',
  inputs: {
    word: {
      type: 'string',
      description: 'query word',
      maxLength: 50,
      required: true,
    },
    id: {
      type: 'number',
      description: 'thread.id',
      required: true,
    },
  },
  exits: {
    success: {
      description: 'Query attachments successfully.',
    },
    notFound: {
      description: 'The user has accessed a thread that has not joined.',
      responseType: 'notfound',
    },
  },

  fn: async function (inputs) {
    var thread = await Thread.findOne({ id: inputs.id });
    if (!thread) {
      throw 'notFound';
    }
    var team = await sails.helpers.validateMembership.with({
      id: thread.team,
      user: this.req.me,
    });
    if (!team) {
      throw 'notFound';
    }

    if (!inputs.word) {
      throw 'notFound';
    }

    var NATIVE_SQL = `
 SELECT "id", "createdAt", "updatedAt", "name", "virtualPath", "virtualPathMid", "virtualPathSmall", "virtualUrl", "virtualUrlMid", "virtualUrlSmall", "hashName", "size", "mimeType", "qWords", "thread", "owner"
   FROM "public"."thread_item"
  WHERE "thread" = $1
    AND "qWords" ilike $2
`;
    try {
      var rawResult = await sails.sendNativeQuery(NATIVE_SQL, [thread.id, `%${inputs.word}%`]);
      return rawResult.rows;
    } catch (err) {
      sails.log.error(err);
      throw err;
    }
  },
};
