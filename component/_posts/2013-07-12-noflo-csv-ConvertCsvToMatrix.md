---
  title: "ConvertCsvToMatrix"
  library: "noflo-csv"
  layout: "component"

---

```coffeescript

noflo = require "noflo"
csv = require "csv"

```
This component converts CSV text from the CSV port into an array of arrays on the OUT port.  Either the whole input
parses and will be sent on the out port or an error message will be sent.  1 message on the CSV port results in 1 message
on either the out or error ports.
<pre>
            +--------------------+
----CSV---->|                    |----OUT---->
            | ConvertCsvToMatrix |
--CONFIG--->|                    |---ERROR--->
            +--------------------+
</pre>

```coffeescript
class ConvertCsvToMatrix extends noflo.Component
  constructor: ->
```
Default parse options to be given to the CSV parser.  Can be overridden by sending a message to the OPTIONS in port.

```coffeescript
    @parseOptions = comment: '#', delimiter: ',', escape: '"'

    @inPorts =
```
CSV in port receives text data to be parsed.
Example data might look like this:
> &#35;This is a comment
> "1","2","3","4"
> "a","b","c","d"

```coffeescript
      csv: new noflo.Port()
```
CONFIG in port receives a JavaScript object which configures how to parse the text data received on the CSV port.
See the default parse options above for an example of what might be sent.  You don't need to send a config message
if the default options are acceptable.

```coffeescript
      config: new noflo.Port()
    @outPorts =
```
OUT out port sends an array of arrays representing the CSV data that was parsed.

```coffeescript
      out: new noflo.Port()
```
ERROR out port sends any error messages from parsing the text CSV data.

```coffeescript
      error: new noflo.Port()

    @inPorts.config.on "data", (newOptions) =>
      @parseOptions = newOptions

    @inPorts.csv.on "data", (csvText) =>
      csv().from.string(csvText, @parseOptions)
      .to.array (parsedRowArrays) =>
        @outPorts.out.send parsedRowArrays
      .on "error", (error) =>
        @outPorts.error.send { csvText: csvText, error: error.message }

exports.getComponent = -> new ConvertCsvToMatrix()
```