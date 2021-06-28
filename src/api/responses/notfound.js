/**
 * notfound.js
 *
 * A custom response that content-negotiates the current request to either:
 *  • serve an HTML error page about the specified token being invalid or expired
 *  • or send back 404 (Token NotFound) with no response body.
 *
 * Example usage:
 * ```
 *     return res.notfound();
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       badToken: {
 *         description: 'Provided token was notfound, invalid, or already used up.',
 *         responseType: 'notfound'
 *       }
 *     }
 * ```
 */
module.exports = function notfound() {
  var req = this.req;
  var res = this.res;

  sails.log.verbose('Ran custom response: res.notfound()');

  if (req.wantsJSON) {
    return res.status(404).send('Token NotFound');
  } else {
    return res.status(404).view('404');
  }
};
