/**
 * forbidden.js
 *
 */
module.exports = function forbidden() {
  var req = this.req;
  var res = this.res;

  sails.log.verbose('Ran custom response: res.forbidden()');

  if (req.wantsJSON) {
    return res.status(403).send('Token Forbidden');
  } else {
    return res.status(403).view('403');
  }
};
