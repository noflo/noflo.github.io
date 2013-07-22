---
  title: "Products"
  library: "noflo-semanticsthree"
  layout: "component"

---

    noflo = require "noflo"
    _ = require "underscore"
    
    class Products extends noflo.Component
      constructor: ->
    
        @inPorts =
          in: new noflo.Port
          client: new noflo.Port
        @outPorts =
          out: new noflo.Port
          error: new noflo.Port
    
        @inPorts.client.on "data", (@client) =>
    
        @inPorts.in.on "connect", (fields) =>
          @groups = []
        @inPorts.in.on "begingroup", (group) =>
          @groups.push group
    
        @inPorts.in.on "data", (fields) =>
          groups = @groups
    
          for key, value of fields
            if _.isArray value
              field = value
              field.unshift key
            else
              field = [key]
              field.push value
    
            @client.products.products_field.apply @client.products, field
    
          @client.products.get_products (err, products) =>
            if err?
              @send "error", groups, err
            else
              @send "out", groups, JSON.parse products
    
      send: (portName, groups, stuff) ->
        port = @outPorts[portName]
        return unless port?
    
        for group in groups
          port.beginGroup group
    
        port.send stuff
    
        for group in groups
          port.endGroup group
    
        port.disconnect()
    
    exports.getComponent = -> new Products
    
