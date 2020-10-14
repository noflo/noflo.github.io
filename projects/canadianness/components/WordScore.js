// ## Import libraries
const noflo = require('noflo');
const natural = require('natural');

const tokenizer = new natural.WordTokenizer();

// ## Component declaration
exports.getComponent = () => {
  const c = new noflo.Component({
    description: 'Find how the input words compare against the list of weighted words',
    inPorts: {
      list: {
        datatype: 'array',
        description: 'list of words we will use with the list of content',
        control: true,
        required: true,
      },
      content: {
        datatype: 'string',
        description: 'the content which we will determine the score of',
        required: true,
      },
    },
    outPorts: {
      score: {
        datatype: 'number',
        description: 'the resulting number of comparing the content with the list',
        required: true,
      },
    },
  });

  // ## Processing function
  //
  // To preserve streams, forward brackets from the primary inport to the output.
  c.forwardBrackets = {};

  c.process((input, output) => {
    // ### Receive input
    let scoringFunction;
    if (!input.hasStream('content')) { return; }
    if (!input.hasData('list')) { return; }
    let content = input.getStream('content').filter((ip) => ip.type === 'data').map((ip) => ip.data);
    const list = input.getData('list');

    // there can be multiple pieces of content
    content = content.join('\n');

    // ### Component business logic
    // our base score we will send out
    let score = 0;

    // splits content into an array of words
    const tokens = tokenizer.tokenize(content);

    // if the list has the word in it, return the score
    // otherwise, 0 points
    const wordScore = (word) => {
      if (list[word] != null) {
        return list[word];
      }
      return 0;
    };

    // go through each of the comparisons in the list
    // if it is Canadian: 1, American: -1, British: .5, None: 0
    const spellingScore = (word) => {
      let value = 0;
      list.forEach((comparison) => {
        if (comparison.American.indexOf(word) !== -1) {
          value = -1;
          return;
        }
        if (comparison.Canadian.indexOf(word) !== -1) {
          value = 1;
          return;
        }
        if (comparison.British.indexOf(word) !== -1) {
          value = 0.5;
        }
      });
      return value;
    };

    // if it has this, it is a spelling list
    if ((list[0] != null ? list[0].Canadian : undefined) != null) {
      scoringFunction = spellingScore;
    // otherwise it is an object list of words with scores
    } else {
      scoringFunction = wordScore;
    }

    // use this to singularize and pluralize each word
    const nounInflector = new natural.NounInflector();

    // go through each item in contents
    tokens.forEach((data) => {
      const plural = nounInflector.pluralize(data);
      const singular = nounInflector.singularize(data);

      // if it is already plural or singular do not use it
      if (plural !== data) {
        score += scoringFunction(plural);
      }
      if (singular !== data) {
        score += scoringFunction(singular);
      }

      score += scoringFunction(data);
    });

    // ### Send output
    output.sendDone({
      score,
    });
  });

  return c;
};
