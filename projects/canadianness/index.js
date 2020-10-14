const noflo = require('noflo');
const defaultSpellingData = require('./spellingdata.json');

const defaultWords = {
  eh: 11,
  'eh!': 11,
};

// Produce the JavaScript entry point
function canadianness(contentData, options, callback) {
  // Normalize options
  const spellingData = options.spelling || defaultSpellingData;
  const wordsData = options.words || defaultWords;

  // Convert options and input to a set of NoFlo packets to be sent
  const inputs = {
    words: wordsData,
    spelling: spellingData,
    content: contentData,
  };

  // Produce a NoFlo.asCallback wrapped function to execute our graph
  const componentName = 'canadianness/Canadianness';
  const wrapperFunction = noflo.asCallback(componentName, {
    baseDir: __dirname,
  });

  // Run the graph with inputs and call callback
  wrapperFunction(inputs, callback);
}

// Expose function as public API
module.exports = canadianness;
