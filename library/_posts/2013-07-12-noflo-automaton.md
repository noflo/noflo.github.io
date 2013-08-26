---
  title: "noflo-automaton"
  description: "Automate navigation on the web based on Casper.js"
  version: "0.0.4"
  author: 
    name: "Kenneth Kan"
    email: "kenhkan@gmail.com"
    avatar: "http://www.gravatar.com/avatar/3db61a4a42000b4ff62648c0979e8920?s=23"
  repository: 
    type: "git"
    url: "https://github.com/kenhkan/noflo-automaton.git"
  layout: "library"

---
# Automate navigation on the web
[![Build Status](https://secure.travis-ci.org/kenhkan/noflo-automaton.png?branch=master)](http://travis-ci.org/kenhkan/noflo-automaton) [![Dependency Status](https://gemnasium.com/kenhkan/noflo-automaton.png)](https://gemnasium.com/kenhkan/noflo-automaton) [![NPM version](https://badge.fury.io/js/noflo-automaton.png)](http://badge.fury.io/js/noflo-automaton) [![Stories in Ready](https://badge.waffle.io/kenhkan/noflo-automaton.png)](http://waffle.io/kenhkan/noflo-automaton)

This component library is built for [NoFlo](http://noflojs.org/) using
[Casper.js](http://casperjs.org/) via
[SpookyJS](https://github.com/WaterfallEngineering/SpookyJS) as driver.

Given a URL and a rule object (structure described below), noflo-automaton
would go through the rule object and try to reach the end, at which point the
automaton would forward the accumulated output to its OUT port with the status
number of 'true'.

If at any point it fails, the automaton would still forward the accumulated
output but with the status number being the rule number in the provided rule
object.

Note that the output of this library is asynchronous.

## Installation

Casper.js and by extension, Phantom.js, are required. In other words, this
library runs only on a server and not the browser. Check out [Casper.js
documentation](http://docs.casperjs.org/en/latest/installation.html) for
installation instructions.

Once you have these installed, it's just a simple `npm install --save
noflo-automaton`!

## API

To use noflo-automaton, you only need to interface with the
`automaton/automaton` graph, which expects:

* Inport **url**: The URL to start the navigation with
* Inport **rules**: This is the rule obejct (see below)
* Inport **options**: *optional* A dictionary of options to be passed to
  [Casper.js](http://docs.casperjs.org/en/latest/modules/casper.html). If
  `verbose` set to true, all log from Casper.js will be printed to
  `console.log`.

Options must be passed in before URL and rules ports disconnect given that it
is optional.

Note that jQuery (v2.0.3) is always injected unless it is already included on
the page. Manual injection may result in conflict.

The graph outputs to the OUT port, with the **status** wrapping as group.
**status** is `null` if successful or the offset of the last executed rule if
failed.

* Outport **out**: The accumulated output from executing all the steps. This is
  a stack of all `console.log` output prefixd with `[output] ` from the remote
  *browser*. For instance, `[output] {"a":"b"}` would be saved while
  `{"a":"b"}` would not.
* Outport **error**: An error packet if the rule or the options object is not
  valid

## The Rule Object

To automate web navigation simply requires a list of rules to tell automaton
what to look for, what to do if it is found, and which rule to execute next.
The object is a simple JavaScript object containing an array of rules. It works
virtually the same way as an assembly language does.

### Rule Object API

#### NOTE: The follow API has not been completely implemented. See issues #2 - #5.

For each **rule**, the automaton expects:

* **selector**: The CSS3 selector to operate on
* **actions**: An array of actions to perform (see below)
* **conditions**: An array of conditions to test for success before moving on
  (see below)
* **name**: *optional* An identifier so other rules can refer to this rule
* **on-success**: *optional* The next rule to execute upon success. It refers
  to the rule by its name. Automaton scans forward for the name and does not go
  back in history. In other words, automaton will execute the first instance of
  the rules matching the name. If it's `false`, quit the program successfully.
  If it's `true`, the immediately next rule is executed. Default to `true`
* **on-failure**: *optional* The next rule to execute upon failure. The same
  properties of determining the next rule to execute as for `on-success` apply.
* **test-timeout**: *optional* Number of milliseconds to timeout before
  applying 'conditions'. Default to 0 miliseconds (i.e. immediately calling
  `setTimeout()` with `0` milliseconds)
* **retry-timeout**: *optional* Number of milliseconds to timeout before
  retrying upon failure. Default to `0` milliseconds
* **retry-count**: *optional* How many times to retry before giving up? Default
  to no retry (i.e. quit the program with a failure status number)

For each **action** in the actions array:

* **action**: One of [mouse and form
  events](http://www.w3schools.com/jsref/dom_obj_event.asp) without the 'on'
  prefix. It also accepts:
  * *value* which changes the value of an input and trigger the `change`
    event.
  * *form* which fills a form with the provided dictionary of form element name
    and its desired value
* **selector**: *optional* The element to perform the action on. Default to the
  element specified by the rule selector.

For each **condition** in the conditions array:

* **condition**: The value to match on the element. This is a RegExp string.
  For instance, when `class="page row item"` and `property` is `class`, the
  condition is not going to match with `^row$`. However, it would match with
  `row`.
* **name**: *optional* An identifier for other conditions to refer to this
* **property**: *optional* The attribute name (e.g. 'class') to test.  Default
  to the content of the HTML element
* **selector**: *optional* The selector to test the condition on. Default to
  the element specified by the rule selector.
* **on-success**: *optional* The next condition by its name to test on success.
  If it's `false`, stop testing and assume success. If it's `true`, move on to
  the next condition. Default to `true`
* **on-failure**: *optional* The next condition by its name to test on failure.
  If it's `false`, stop testing and assume failure. If it's `true`, move on to
  the next condition. Default to `false`

### Examples

Click on all the row items and test that all item has the content 'Item' except
the one marked with 'you' as ID.

    [
      {
        "selector": "body #page .row",
        "actions": [
          { "action": "click" },
          { "action": "click", "selector": "body #page .row .item" }
        ],
        "conditions": [
          { "condition": "Item" },
          { "condition": "You", "selector": "body #page .row .item#you" }
        ]
      }
    ]

## Data Structure

The automaton is essentially a looper that ends when there is a failure in
satisfying the provided conditions or when it completes successfully (i.e. no
more rules to apply). Along with the expectation that after each test and rule,
there is a timeout to allow DOM events to fire, the flow must be completely
stateless.

Therefore, each component in the automaton internal loop expects the same
inbound object, which follows the protocol of:

* **spooky**: This is the SppokyJS object to iterate on. It is created on
  demand.
* **rules**: This is the rule obejct.
* **offset**: This is the current rule's offset in the rule object.  This is
  used internally as a counter to refer to the the current rule to be applied
  as well as forwarded to OUT upon completion.
* **counts**: This is a hash of counters used by some components in order to
  track when to quit upon repeated failures.

## Action Runners

At the heart of automaton is the action runners. These are the actual
components applying the rules onto the page. An action runner is simply a
component of this repository that accepts a context object of the following
protocol:

* **spooky**: The SpookyJS object on which it applies the action
* **action**: The action extracted from the context object for the runner to
  apply

The runner checks rather it should act on it by examining `action.action`,
which is a string denoting the name of the action. If it is qualified to handle
it, it should act on it and not forward the context object.

On the other hand, if it does not know how to handle it, it should forward the
context object as-is to its OUT port. The runner should also check if the OUT
port is attached before sending.

Runners should attach themselves to either the `automaton/TestActions`
component or other runners. This cascading structure allows certain runners to
always take precedence over others.

Note that action runners do not need to be attached back to the system as the
SpookyJS object is passed by reference in the context object as action runners
apply the actions.
