/**
 * same-mind
 *
 * A simple policy that blocks requests from same-mind.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {
  // First, check whether the request comes from a logged-in user.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  if (!req.me || !req.organization) {
    return res.unauthorized();
  } //•

  if (req.params && req.params.handleId) {
    if (req.organization.handleId !== req.params.handleId) {
      return res.notfound();
    }
  }

  if (!req.params.id) {
    return res.badRequest();
  }

  var user = await User.findOne({ id: req.params.id, deleted: false }).populate('teams', {
    where: { deleted: false },
    sort: 'id ASC',
  });
  if (!user) {
    return res.notFound();
  }

  if (req.me.isSuperAdmin) {
    return proceed();
  } //•

  var me = await User.findOne({ id: req.me.id }).populate('teams', {
    where: { deleted: false },
    sort: 'id ASC',
  });

  var sameMind = false;
  for (let team of user.teams) {
    var exists = _.findIndex(me.teams, function (entry) {
      return entry.id === team.id;
    });
    if (exists > -1) {
      sameMind = true;
    }
  }
  if (!sameMind) {
    return res.forbidden();
  }

  return proceed();
};
