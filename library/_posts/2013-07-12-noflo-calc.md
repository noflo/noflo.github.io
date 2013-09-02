---
  title: "noflo-calc"
  description: "Components for the NoFlo flow-based programming environment to evaluate mathematical expressions on JavaScript objects"
  author: 
    name: "Robin Galloway-Lunn"
    email: "robingl@aecher.com"
    avatar: "http://www.gravatar.com/avatar/7b948233cb56059ff1e0b2ba6b66e1e9?s=23"
  version: "0.0.1"
  repository: 
    type: "git"
    url: "https://github.com/robingl/noflo-calc.git"
  layout: "library"

---
noflo-calc
==========

Mathematical expression evaluation components for [NoFlo](http://noflojs.org).  These components are essentially NoFlo wrappers around
the superb [MathJS library](http://mathjs.org/).  You can ask these components to evaluate arbitrarily complex mathematical expressions.

Components
----------
1. [SimpleExpressionCalculator](http://noflojs.org/component/noflo-calc-SimpleExpressionCalculator/) has an IN in port that accepts text data and an OUT port that sends a JavaScript object with the answer.  This might be a simple number or an array of numbers, depending on the expression you give.  Read the [MathJS](http://mathjs.org/) documentation for more information.
2. [ObjectVariablesExpressionCalculator](http://noflojs.org/component/noflo-calc-ObjectVariablesExpressionCalculator/) is intended to be used for complex calculations using object values in the calculation.  You configure this object with a mathematical expression and a list of variables that can be looked up from data messages.  When a message arrives on this component's data port, the variables are looked up and substituted into the calculation.  You can configure this object to either send on calculation answers or to enrich the data message with the calculation answer and send it on to the out port.

Examples
--------
Please take a look at the examples for these components on [Github](https://github.com/robingl/noflo-calc/tree/master/examples).  If you would like to run these examples, please be sure to install the dev dependencies for this NPM package after you download it.  The examples require access to the [strings](http://noflojs.org/library/noflo-strings/), [core](http://noflojs.org/library/noflo-core/) and [filesystem](http://noflojs.org/library/noflo-filesystem/) components which I have listed as dev dependencies, since they are only required for the examples.


Message Enrichment
------------------
Here is an example of enriching a data message with the result of a calculation.  In the diagram below, I have attempted to describe 1 message arriving on the config port and 1 on the data port, resulting in one message being sent on the out port.  I have colour coded the matching JSON entities in the input and output messages to show how they are related.

The CONFIG message sets the mathematical expression to be evaluated.  You can use variables in the expression whose values may change depending on the data message.  In this example, the variable named `a` is highlighted in red.  When a data message arrives, the value for `a` will be looked up in the data message at the `body.weight` location in the data message.  Just as the variable `b` highlighted in blue will be looked up in the data message at the `body.height` location.  You can use a broad range of JavaScript syntax to look up values in data messages, including array references.

The answer for each calculation in this example will be added to the data message by 
**assign**ing the answer to the `body.bmi` location and then sending the data message to the OUT port.  The calculation will be performed for each message that arrives on the DATA port allowing you to enrich each message and send it on.

If you prefer not to enrich a message but only to receive the answer of a calculation, set the CONFIG message's `output.action` value to **answer only**.  You can also ask for the answer to be put at the start or end of an array in the data message by setting the `output.action` value to one of **add to array start** or **add to array end**.

![diagram](https://raw.github.com/robingl/noflo-calc/master/ObjectVariablesExpressionCalculator_Diagram.png)

Group Behaviour Cascade
-----------------------
When either component in this library receives a BEGINGROUP or ENDGROUP event, it will pass those group messages on to the OUT and ERROR ports.  This should support you processing data groups through your entire flow when you use these components.
