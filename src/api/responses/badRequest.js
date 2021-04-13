module.exports = function badRequest(data) {
  var req = this.req;
  var res = this.res;

  sails.log.error(data);

  if (req.wantsJSON) {
    return res.status(400).send('E_MISSING_OR_INVALID_PARAMS');
  } else {
    return res.status(400).view('404');
  }
};
