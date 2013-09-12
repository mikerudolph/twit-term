var Twitter = require('twitter');
var async = require('async');
var _ = require('lodash');

var config = require('../config/config');

var twitter = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

var Twit = function() {
  this.openStream;
  this._directApi = twitter;
};

Twit.prototype.search = function(type, query, cb) {
  switch(type) {

    case 'users':

      this._findUsers(query, cb);

      break;

    default:
      console.log('nothing');

      return cb(null);

      break;

  }
};

Twit.prototype.startUserStream = function(cb) {
  var self = this;

  twitter.stream('user', function(stream) {
    self.openStream = stream;
    
    return cb(stream);
  });
};

Twit.prototype.stopStream = function(cb) {
  if (this.openStream) {
    this.openStream.destroy();

    this.openStream = null;

    return cb(null, 'Stream has been closed');

  } else {
    return cb(null, 'No Stream is open');
  }
};

Twit.prototype._findUsers = function(query, cb) {
  var screenNames = _.compact(query.split(','));

  async.map(screenNames, this._findSingleUser, function(err, users) {
    if (err) {
      return cb(err);
    }

    return cb(null, users);
  });
};

Twit.prototype._findSingleUser = function(name, cb) {
  twitter.searchUser(name, function(results) {
    if (results.length > 0) {
      if (results[0].id) {
        return cb(null, results[0]);
      }
    }
  });
};

module.exports = Twit;
