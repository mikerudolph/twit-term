'use strict';

var _ = require('lodash');
var Twitter = require('./twitter');
var twt = new Twitter();


var clc = require('cli-color');
var error = clc.red.bold;
var info = clc.cyanBright;
var title = clc.cyanBright.underline;
var alert = clc.yellowBright;

var CmdTools = function(rl) {
  this.rl = rl;
};

CmdTools.prototype.printHelp = function() {
  console.log('\n');
  console.log(clc.red.bold.underline('Usage:'));
  console.log('\n');

  console.log(title('findusers'));
  console.log('Used to start for users via screennames. Multiple can be separated with a comma');
  console.log(clc.underline('eg.') + ' "findusers itsmikerudolph, google"');
  console.log('\n');

  console.log(title('sendtweet'));
  console.log('Used to post a tweet with the current authenticated users profile');
  console.log(clc.underline('eg.') + ' "sendtweet Hello World, this was posted from terminal!"');
  console.log('\n');

  console.log(title('readtweets'));
  console.log('Grab the most recent tweets from the authenticated users timeline, takes an optional argument to limit the returned tweets; default is 20');
  console.log(clc.underline('eg.') + ' "readtweets", "readtweets 10"');
  console.log('\n');

  console.log(title('startstream'));
  console.log('Open a realtime stream for the authenticated users timeline, Tweets will populate as they roll in.');
  console.log(clc.underline('eg.') + ' "startstream"');
  console.log('\n');

  console.log(title('endstream'));
  console.log('End the currently open realtime timeline stream');
  console.log(clc.underline('eg.') + ' "endstream"');
  console.log('\n');

  console.log(title('exit'));
  console.log('Close the Twitter client');
  console.log(clc.underline('eg.') + ' "exit"');
  console.log('\n');
};

CmdTools.prototype.findUsers = function(query, cb) {
  twt.search('users', query, function(err, users) {
    if (err) {
      return cb(err);
    }

    _.each(users, function(user) {
      console.log('UID: ' + info(user.id));
      console.log('Name: ' + info(user.name));
      console.log('Username: ' + info(user.screen_name));
      console.log('Location: ' + info(user.location));
      console.log('Website: ' + info(user.url));
      console.log('Followers: ' + info(user.followers_count));
      console.log('Following: ' + info(user.friends_count));
      console.log('Tweets: ' + info(user.statuses_count));
      console.log(clc.underline('Last Tweet:'));
      console.log(user.status.text);
      console.log('\n');
    });

    return cb(null);
  });
};

CmdTools.prototype.startStream = function(type) {
  var self = this;

  switch(type) {
    default:

      twt.startUserStream(function(stream) {
        console.log(alert('Stream has been opened'));

        stream.on('data', function(tweet) {
          if (tweet.user) {
            console.log(alert('New Tweet!'));
            console.log(info('@' + tweet.user.screen_name));
            console.log(tweet.text);
            console.log(clc.underline('On:') + ' ' + tweet.created_at);
            console.log('\n');
          }

          self.rl.prompt();
        });
      });

      break;
  }
};

CmdTools.prototype.sendTweet = function(msg, cb) {
  if (!msg) {
    console.log(error('Missing tweet text'));

    return cb(null);
  }

  twt._directApi.updateStatus(msg, function() {

    console.log(alert('Tweet has been sent!'));
    return cb(null);
  });
};

CmdTools.prototype.getHomeTimeline = function(count, cb) {
  if (count && ! /^([0-9])+$/.test(count)) {
    return cb('Error: Supplied value for max tweet count is not numeric.');
  }

  var params = {};

  if (count) {
    params.count = count;
  }

  twt._directApi.getHomeTimeline(params, function(tweets) {
    _.each(tweets, function(tweet) {
      if (tweet.user) {
        console.log(alert('New Tweet!'));
        console.log(info('@' + tweet.user.screen_name));
        console.log(tweet.text);
        console.log(clc.underline('On:') + ' ' + tweet.created_at);
        console.log('\n');
      }
    });

    return cb(null);
  });
};

CmdTools.prototype.endStream = function() {
  var self = this;

  twt.stopStream(function(err, msg) {
    console.log(alert(msg));

    self.rl.prompt();
  });
};

module.exports = CmdTools;
