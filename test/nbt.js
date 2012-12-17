function compareBuffers (b1, b2) {
  if (b1.length != b2.length) {
    return false;
  }
  for (var i = 0; i < b1.length; i++) {
    if (b1[i] !== b2[i]) {
      return false;
    }
  }
  return true;
}

var fs = require('fs');
var TAG = require('../lib/nbt').TAG;
var NbtReader = require('../lib/nbt').NbtReader;
var NbtWriter = require('../lib/nbt').NbtWriter;

exports.testReadAndWrite = function(test) {
  test.expect(1);
  fs.readFile('sampledata/sample2.nbt', function(err, buffer) {
    var d = NbtReader.readTag(buffer);
    d = NbtReader.removeBufferKey(d);
    var buffer2 = NbtWriter.writeTag(d);
    test.ok(compareBuffers(buffer, buffer2), 'Buffers should be identical');
    test.done();
  });
};

exports.testReadString = function(test) {
  var b = new Buffer([0x00, 0x0a, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41]);
  var d = NbtReader.readString(b);
  test.ok(d.val == 'AAAAAAAAAA');
  test.done();
};
exports.testReadShort = function(test) {
  var b = new Buffer([0xff, 0xff]);
  var d = NbtReader.readShort(b);
  test.ok(d.val == -1);
  b = new Buffer([0x7f, 0xff]);
  d = NbtReader.readShort(b);
  test.ok(d.val == Math.pow(2, 15) - 1);
  test.done();
};
exports.testReadInt = function(test) {
  var b = new Buffer([0xff, 0xff, 0xff, 0xff]);
  var d = NbtReader.readInt(b);
  test.ok(d.val == -1);
  b = new Buffer([0x7f, 0xff, 0xff, 0xff]);
  d = NbtReader.readInt(b);
  test.ok(d.val == Math.pow(2, 31) - 1);
  test.done();
};
exports.testReadLong = function(test) {
  var b = new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
  var d = NbtReader.readLong(b);
  test.ok(d.val == -1);
  b = new Buffer([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
  d = NbtReader.readLong(b);
  test.ok(d.val == Math.pow(2, 63) - 1);
  test.done();
};
exports.testReadFloat = function(test) {
  var b = new Buffer([0x46, 0xbd, 0x54, 0x80]);
  var d = NbtReader.readFloat(b);
  test.ok(d.val == 24234.25);
  test.done();
};
exports.testReadDouble = function(test) {
  var b = new Buffer([0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  var d = NbtReader.readDouble(b);
  test.ok(d.val == 2.2250738585072014e-308);
  test.done();
};
exports.testReadByte = function(test) {
  var b = new Buffer([0xff]);
  var d = NbtReader.readByte(b);
  test.ok(d.val == -1);
  b = new Buffer([0x7f]);
  d = NbtReader.readByte(b);
  test.ok(d.val == Math.pow(2, 7) - 1);
  test.done();
};
exports.testReadTagName = function(test) {
  var b = new Buffer([0x0a, 0x00, 0x09, 0x53, 0x63, 0x68, 0x65, 0x6d, 0x61, 0x74, 0x69, 0x63]);
  var d = NbtReader.readTagName(b);
  test.ok(d.val.val == 'Schematic' && d.val.type == TAG.COMPOUND);
  test.done();
};
exports.testReadByteArray = function(test) {
  var b = new Buffer([0x00, 0x00, 0x00, 0x0f, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
  var d = NbtReader.readByteArray(b);
  var comp = true;
  for (var i=1; i<16; i++) {
    comp = comp && d.val[i - 1] == i;
  }
  test.ok(comp);
  test.done();
};
exports.testReadIntArray = function(test) {
  var b = new Buffer([0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x7f, 0xff, 0xff, 0xff]);
  var d = NbtReader.readIntArray(b);
  var comp = true;
  var compare_values = [0, -1, Math.pow(2, 31) - 1];
  for (var i=0; i<2; i++) {
    comp = comp && d.val[i] == compare_values[i];
  }
  test.ok(comp);
  test.done();
};

exports.testWriteString = function(test) {
  var d = NbtWriter.writeString('AAAAAAAAAA');
  var b = new Buffer([0x00, 0x0a, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41, 0x41]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteShort = function(test) {
  var d = NbtWriter.writeShort(-1);
  var b = new Buffer([0xff, 0xff]);
  test.ok(compareBuffers(d, b));
  d = NbtWriter.writeShort(Math.pow(2, 15) - 1);
  b = new Buffer([0x7f, 0xff]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteInt = function(test) {
  var d = NbtWriter.writeInt(-1);
  var b = new Buffer([0xff, 0xff, 0xff, 0xff]);
  test.ok(compareBuffers(d, b));
  d = NbtWriter.writeInt(Math.pow(2, 31) - 1);
  b = new Buffer([0x7f, 0xff, 0xff, 0xff]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteLong = function(test) {
  var d = NbtWriter.writeLong(-1);
  var b = new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
  test.ok(compareBuffers(d, b));
  d = NbtWriter.writeLong(Math.pow(2, 63) - 1);
  b = new Buffer([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteFloat = function(test) {
  var d = NbtWriter.writeFloat(24234.25);
  var b = new Buffer([0x46, 0xbd, 0x54, 0x80]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteDouble = function(test) {
  var d = NbtWriter.writeDouble(2.2250738585072014e-308);
  var b = new Buffer([0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteByte = function(test) {
  var d = NbtWriter.writeByte(-1);
  var b = new Buffer([0xff]);
  test.ok(compareBuffers(d, b));
  d = NbtWriter.writeByte(Math.pow(2, 7) - 1);
  b = new Buffer([0x7f]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteTagName = function(test) {
  var d = NbtWriter.writeTagName({name: 'Schematic', type: TAG.COMPOUND});
  var b = new Buffer([0x0a, 0x00, 0x09, 0x53, 0x63, 0x68, 0x65, 0x6d, 0x61, 0x74, 0x69, 0x63]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteByteArray = function(test) {
  var d = NbtWriter.writeByteArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  var b = new Buffer([0x00, 0x00, 0x00, 0x0f, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
  test.ok(compareBuffers(d, b));
  test.done();
};
exports.testWriteIntArray = function(test) {
  var d = NbtWriter.writeIntArray([0, -1, Math.pow(2, 31) - 1]);
  var b = new Buffer([0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x7f, 0xff, 0xff, 0xff]);
  test.ok(compareBuffers(d, b));
  test.done();
};