const canadianness = require('../index.js');
const chai = require('chai');

describe('Javascript API', () =>

  describe('calling with sad content', () => {
    const content = 'life is hard and then you die, ...eh';
    it('should return emotion=sadness', done =>
      canadianness(content, {}, (err, result) => {
        if (err) {
          done(err);
          return;
        }
        chai.expect(result).to.include.keys(['emotion', 'score']);
        chai.expect(result.emotion).to.equal('sadness');
        chai.expect(result.score).to.be.above(5);
        done();
      })
    );
  })
);
