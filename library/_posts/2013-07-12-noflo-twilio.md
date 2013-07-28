---
  title: "noflo-twilio"
  description: "Wrapper around the twilio API"
  version: "0.1.0"
  author: 
    name: "Kenneth Kan"
    email: "kenhkan@gmail.com"
    avatar: "http://www.gravatar.com/avatar/3db61a4a42000b4ff62648c0979e8920?s=23"
  repository: 
    type: "git"
    url: "git://github.com/kenhkan/noflo-twilio.git"
  layout: "library"

---
# noflo-twilio [![Build Status](https://secure.travis-ci.org/kenhkan/noflo-twilio.png?branch=master)](http://travis-ci.org/kenhkan/noflo-twilio)

Wrapper around the twilio API

This package is incomplete. Please contribute new components and graphs.
I'll try to incorporate as soon as time allows.

## Usage

### Client

Create a twilio client object given the account ID and the auth token of
your twilio account.

#### In-ports

  * ACCOUNT: the account ID
  * TOKEN: the auth token

#### Out-ports

  * OUT: a twilio client object

### Sms

Send/Receive SMS messages. See the twilio doc on [receiving SMS
messages](http://www.twilio.com/docs/api/rest/sms) and [sending SMS
messages](http://www.twilio.com/docs/api/rest/sending-sms) for more
information.

#### In-ports

  * CLIENT: the twilio client created by `Client` component
  * SEND: the POST parameters as outlined in the doc; each packet is an
    object of parameters. Multiple packets send multiple SMS messages
  * RECEIVE: message SIDs; each packet is a string of an SID. An empty
    connection with no packets or no packets of SID strings which start
    with "SM" lists all messages

#### Out-ports

  * OUT: a message object for each incoming packet. See doc for what
    would be in a returned object

#### Examples

*(Adapted from the twilio doc)* Send an SMS from 415-814-1829 to
415-935-2345 begging Jenny for a second chance and print the returned
object to screen.

    ClientGen(twilio/Client) OUT -> CLIENT Sms(twilio/Sms)
    '{"body":"Jenny please?! I love you <3","to":"+14159352345","from":"+14158141829"}' OUT -> IN Message(string/ParseJson)
    Message() OUT -> SEND Sms() OUT -> IN Output(Output)

Getting two messages by their SIDs.

    ClientGen(twilio/Client) OUT -> CLIENT Sms(twilio/Sms)
    'SM800f449d0399ed014aae2bcc0cc2f2ec\nSM800f449d0399ed014aae2bcc0cc2f2ed' OUT -> IN Sids(SplitStr)
    Sids() OUT -> RECEIVE Sms() OUT -> IN Output(Output)

Listing all messages.

    ClientGen(twilio/Client) OUT -> CLIENT Sms(twilio/Sms)
    '' -> RECEIVE Sms() OUT -> IN Output(Output)
