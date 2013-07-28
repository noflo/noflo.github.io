---
  title: "noflo-twitter"
  description: "Twitter components for the NoFlo flow-based programming environment"
  author: 
    name: "henri.bergius+noflo@gmail.com"
    email: "henri.bergius+noflo@gmail.com"
    avatar: "http://www.gravatar.com/avatar/21ed02329e70781e3d8ce1c1bd23437c?s=23"
  version: "0.0.1"
  repository: 
    type: "git"
    url: "https://github.com/robingl/noflo-twitter.git"
  layout: "library"

---
noflo-twitter
=============

Twitter components for the NoFlo Flow Based Programming system in NodeJS.  Most of the Twitter API is accessed via the REST API as documented at https://dev.twitter.com/docs/api/1.1.  This package provides access to the REST API as well as to the public filtered stream and a user's own stream.

Getting Access to Twitter
-------------------------
To run this software you'll need your own twitter account.  When you have an account set up, you must create an app for this software to be able to use your account.  Log into [https://dev.twitter.com]() with your twitter credentials then click on the "My Applications" link in the menu under your profile in the top right of the page.  Be sure to set the application to read-write if you want to be able to post tweets from NoFlo, otherwise you will only be able to read from twitter.

Once you have created the application on [dev.twitter.com](https://dev.twitter.com) you will need to copy 4 pieces of information from that web site into your NoFlo messages in order to authenticate your application.  These OAuth authentication strings are:

1. Access token
2. Access token secret
3. Consumer key
4. Consumer secret

These 4 strings authenticate NoFlo to Twitter on your behalf and allow it to read from or to post to your twitter account without knowing your password.  You should protect this information and not publish it anywhere on the internet (like submitting it to github).  Use it only for application configuration.

Using the REST API
------------------
Most of twitter is accessed via the REST API documented [here](https://dev.twitter.com/docs/api/1.1).  You can perform all of the actions documented there with the twitter/RestApi component published in this package.  This includes actions like polling for tweets, sending new tweets or reading tweets from a list.  You can see 2 examples in the examples directory.  Edit the examples/*.json files to use your 4 OAuth authentication strings and then run one of the examples like this:

```
cd examples
./run_fbp.sh send_new_tweet.fbp

./run_fbp.sh read_list_tweets.fbp
```

These example graphs read their equivalent JSON file and send it to the twitter/RestApi component, logging the output from the RestApi to the console.  You'll have to edit the list name and your screen name in the `read_list_tweets.json` file in order for it to work.

Using the Public or User Streaming API
--------------------------------------
While the REST API allows you to read tweets by polling from time to time, you can also stream public tweets or a user's timeline using the twitter/PublicFilterStream and twitter/UserStream components.  The public stream parameters are documented [here](https://dev.twitter.com/docs/streaming-apis/streams/public) and the user stream parameters are documented [here](https://dev.twitter.com/docs/streaming-apis/streams/user).  Examples for how to use these components is included in the examples directory.
