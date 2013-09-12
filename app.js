#!/usr/local/bin/node

'use strict';

var CommandLineTools = require('./lib/command-tools');

var readline = require('readline');
var _ = require('lodash');

var rl = readline.createInterface(process.stdin, process.stdout);
var cmd = new CommandLineTools(rl);

console.log('Twit Term');
console.log('Node.js terminal Twitter client');
console.log('type "help" to see usage options.');
console.log('\n');

rl.setPrompt('Twitter> ');
rl.prompt();

rl.on('line', function(line) {
  var command = line.match(/^([a-z])+/g);

  if (command) {
    command = command[0];
  } else {
    console.log('Sorry, I need a supported command');
    return;
  }

  var body = line.replace(/^([a-z])+/, '').trim();

  switch(command) {

    case 'findusers':

      cmd.findUsers(body, function(err) {
        if (err) {
          throw err;
        }

        return rl.prompt();
      });

      break;

    case 'sendtweet':

      cmd.sendTweet(body.trim(), function(err) {
        if (err) {
          throw err;
        }

        return rl.prompt();
      });

      break;

    case 'readtweets':

      cmd.getHomeTimeline(body.trim(), function(err) {
        if (err) {
          throw err;
        }

        return rl.prompt();
      });

      break;

    case 'startstream':

      cmd.startStream(body);

      break;

    case 'endstream':

      cmd.endStream();

      break;

    case 'help':

      cmd.printHelp();

      rl.prompt();

      break;

    case 'exit':

      return rl.close();

      break;

    default:

      console.log('Sorry, the command "'+ command +'" doesn\'t exist.');

      rl.prompt();

      break;
  }
});

rl.on('close', function() {
  console.log('Okay bai');
});
