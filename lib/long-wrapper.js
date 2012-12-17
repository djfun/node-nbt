var Long = require('../goog/long.js').Long;

Long.fromBuffer = function(b) {
  return Long.fromBits(b.readInt32BE(4), b.readInt32BE(0));
};
Long.prototype.getBuffer = function() {
  var buf = new Buffer(8);
  buf.writeInt32BE(this.getHighBits(), 0);
  buf.writeInt32BE(this.getLowBits(), 4);
  return buf;
};


exports.Long = Long;