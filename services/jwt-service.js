/**
 * Token validation service
 *
 * @description :: JSON Webtoken Service for token validation
 */
var jwt = require('jsonwebtoken');

var config = require('../bin/config');

// Verifies token on a request
module.exports.verify = function(token, callback) {
  return jwt.verify(
    token, // The token to be verified
    config.secretKey, // Same token we used to sign
    {}, // No option
    callback //Pass errors or decoded token to callback
  );
};