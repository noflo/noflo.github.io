---
  title: "CreateCharge"
  library: "noflo-stripe"
  layout: "component"

---

```coffeescript
noflo = require 'noflo'
stripe = require 'stripe'

class CreateCharge extends noflo.AsyncComponent
  constructor: ->
    @client = null

    @inPorts =
      in: new noflo.Port
      apikey: new noflo.Port
    @outPorts =
      out: new noflo.Port
      error: new noflo.Port

    @inPorts.apikey.on 'data', (data) =>
      @client = stripe data

    super()
    
  checkRequired: (chargeData, callback) ->
    unless chargeData.amount
      return callback new Error "Missing amount"
    unless chargeData.currency
      return callback new Error "Missing currency"
    do callback

  doAsync: (chargeData, callback) ->
    unless @client
      callback new Error "Missing Stripe API key"
      return
    
```
Validate inputs

```coffeescript
    @checkRequired chargeData, (err) =>
      return callback err if err
      
```
Create Stripe charge

```coffeescript
      @client.charges.create chargeData, (err, charge) =>
        return callback err if err
        @outPorts.out.send charge
        @outPorts.out.disconnect()
        callback()

exports.getComponent = -> new CreateCharge

```