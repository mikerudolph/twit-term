# Twit Term

Twit Term was a simple hack to allow you some basic functionality of the Twitter API from a node.js program.

![] (http://f.cl.ly/items/3Q3T1Z1o0Y0C0D2B2O2x/Screen%20Shot%202013-09-11%20at%2011.07.23%20PM.png)

## Setup

* Copy `config/config.json.example` to `config/config.json` and update the values inside with your Twitter App info and your accounts access tokens.
* Run `node app.js`

## Commands

### findusers

- Used to search for Twitter accounts via their screennames, multiple screennames can be separated by commas.

`findusers itsmikerudolph, google`

### sendtweet

- Post a tweet directly from the app!

`sendtweet Hello World!`

### readtweets

- Grab the most recent x tweets from the authenticated accounts timeline, an optional number to limit for tweets returned can be passed. Default is 20.

`readtweets` || `readtweets 15`

### startstream

- Open a realtime stream for your timeline, as tweets come in they will be logged in the program promptly.

`startstream`

### endstream

- Close a open realtime stream of your timeline.

`endstream`

### exit

- Close the client.

`exit`

