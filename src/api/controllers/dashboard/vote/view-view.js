module.exports = {
  friendlyName: 'View view',

  description: 'Display "View" page.',

  inputs: {
    handleId: {
      type: 'string',
      required: true,
      maxLength: 10,
      regex: /^[a-zA-Z0-9]+$/,
      description: 'organization.handleId',
    },
    id: {
      type: 'number',
      required: true,
      description: 'vote.id',
    },
  },

  exits: {
    success: {
      viewTemplatePath: 'pages/dashboard/vote/view',
    },
    notFound: {
      responseType: 'notfound',
      description: 'The user has accessed a vote that has not joined.',
    },
  },

  fn: async function (inputs) {
    var response = {};

    response.vote = await Vote.findOne({ id: inputs.id, organization: this.req.organization.id })
      .populate('users', { sort: 'fullName ASC' })
      .populate('author')
      .populate('choices', { sort: 'id ASC' })
      .populate('answers', { sort: 'id ASC' });

    if (!response.vote) {
      throw 'notFound';
    }

    await User.setGravatarUrl(response.vote.author, 36);

    response.vote.items = await VoteItem.find({
      where: {
        vote: response.vote.id,
      },
      sort: 'createdAt ASC',
    }).populate('owner');

    for (let item of response.vote.items) {
      await User.setGravatarUrl(item.owner, 36);
    }

    for (let user of response.vote.users) {
      await User.setGravatarUrl(user, 36);

      let answers = _.filter(response.vote.answers, { user: user.id });
      if (answers.length > 0) {
        user.answered = true;
        user.answeredAt = answers[0].createdAt;
      }

      user.answers = [];
      for (let answer of answers) {
        let choice = _.find(response.vote.choices, { id: answer.voteChoices });
        if (choice && choice.isOther) {
          choice.otherToken = answer.otherToken;
        }
        user.answers.push(choice);
      }
    }

    response.vote.sneezes = await VoteSneeze.find({
      where: {
        vote: response.vote.id,
      },
      sort: 'id ASC',
    }).populate('owner');

    var i = 1;
    for (let entry of response.vote.sneezes) {
      await User.setGravatarUrl(entry.owner);
      entry.serialNumber = i;
      i++;
    }

    var dt = new Date();
    dt.setHours(0, 0, 0, 0);
    if (response.vote.circulationFrom > dt.valueOf()) {
      response.badState = 'notAnswerNotReleased';
    }
    if (response.vote.circulationTo < dt.valueOf()) {
      response.badState = 'notConfirmPassedDeadline';
    }

    response.messageStack = await sails.helpers.storage.findMessage.with({ me: this.req.me });

    if (this.req.session.effectMessage) {
      response.effectMessage = this.req.session.effectMessage;
      delete this.req.session.effectMessage;
    }

    if (this.req.session.ReferencePoint) {
      response.backToUrl = _.last(this.req.session.ReferencePoint);
    }

    return response;
  },
};
