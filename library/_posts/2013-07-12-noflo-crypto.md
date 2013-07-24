---
  title: "noflo-crypto"
  description: "Wrapper around googlecode's crypto-js"
  version: "0.2.1"
  author: 
    name: "Kenneth Kan"
    email: "kenhkan@gmail.com"
  repository: 
    type: "git"
    url: "git://github.com/kenhkan/noflo-crypto.git"
  layout: "library"

---
# crypto [![Build Status](https://secure.travis-ci.org/kenhkan/noflo-crypto.png?branch=master)](http://travis-ci.org/kenhkan/noflo-crypto)

Wrapper around googlecode's crypto-js

## Usage

### Parse

Parse a string in a particular encoding into a CryptoJS object.

#### In-ports

  * ENCODING: the encoding, which could be 'Hex', 'Latin1', or 'Utf8'.
    Default is 'Utf8'.
  * IN: the incoming string to parse

#### Out-ports

  * OUT: a CryptoJS object

### Stringify

Stringify a CryptoJS object into a string in the desired encoding.

#### In-ports

  * ENCODING: the encoding, which could be 'Hex', 'Latin1', or 'Utf8'
    Default is 'Utf8'.
  * IN: A CryptoJS object returned by 'Parse'

#### Out-ports

  * OUT: a string in the said encoding

#### Examples

Encode a string in English into Hex string.

    'Hex' -> ENCODING ToHex(crypto/Stringify)
    'I am so excited to be encoded.' -> IN ToCrypto(crypto/Parse) OUT -> IN ToHex() OUT -> IN Output(Output)
