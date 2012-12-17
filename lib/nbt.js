var Long = require('./long-wrapper').Long;

var TAG = {};

TAG.END = 0;
TAG.BYTE = 1;
TAG.SHORT = 2;
TAG.INT = 3;
TAG.LONG = 4;
TAG.FLOAT = 5;
TAG.DOUBLE = 6;
TAG.BYTEARRAY = 7;
TAG.STRING = 8;
TAG.LIST = 9;
TAG.COMPOUND = 10;
TAG.INTARRAY = 11;

var NbtReader = {
  readString: function(buffer) {
    var d = NbtReader.readShort(buffer);
    buffer = d.buffer;
    var length = d.val;
    return {val: buffer.toString('utf8', 0, length), buffer: buffer.slice(length)};
  },
  readShort: function(buffer) {
    return {val: buffer.readInt16BE(0), buffer: buffer.slice(2)};
  },
  readInt: function(buffer) {
    return {val: buffer.readInt32BE(0), buffer: buffer.slice(4)};
  },
  readLong: function(buffer) {
    return {val: Long.fromBuffer(buffer), buffer: buffer.slice(8)};
  },
  readFloat: function(buffer) {
    return {val: buffer.readFloatBE(0), buffer: buffer.slice(4)};
  },
  readDouble: function(buffer) {
    return {val: buffer.readDoubleBE(0), buffer: buffer.slice(8)};
  },
  readByte: function(buffer) {
    return {val: buffer.readInt8(0), buffer: buffer.slice(1)};
  },
  readTagName: function(buffer) {
    var d = NbtReader.readByte(buffer);
    buffer = d.buffer;
    var type = d.val;
    if (type === TAG.END) {
      return {val: {type: type, val: ''}, buffer: buffer};
    } else {
      d = NbtReader.readString(buffer);
      return {val: {type: type, val: d.val}, buffer: d.buffer};
    }
  },
  readByteArray: function(buffer) {
    var d = NbtReader.readInt(buffer);
    buffer = d.buffer;
    var length = d.val;
    var val = [];
    for (var i = 0; i<length; i++) {
      d = NbtReader.readByte(buffer);
      val.push(d.val);
      buffer = d.buffer;
    }
    return {val: val, buffer: buffer};
  },
  readIntArray: function(buffer) {
    var d = NbtReader.readInt(buffer);
    buffer = d.buffer;
    var length = d.val;
    var val = [];
    for (var i = 0; i<length; i++) {
      d = NbtReader.readInt(buffer);
      val.push(d.val);
      buffer = d.buffer;
    }
    return {val: val, buffer: buffer};
  },
  readTag: function(buffer, data) {
    var d, type, name;
    if (data) {
      d = data;
    } else {
      d = NbtReader.readTagName(buffer);
      buffer = d.buffer;
    }
    type = d.val.type;
    name = d.val.val;
    // console.log('Read Tag ' + name + ' of type ' + type);
    if (type === TAG.END) {
      return {type: TAG.END, name: '', buffer: buffer};
    } else if (type == TAG.BYTE) {
      d = NbtReader.readByte(buffer);
      buffer = d.buffer;
      return {type: TAG.BYTE, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.SHORT) {
      d = NbtReader.readShort(buffer);
      buffer = d.buffer;
      return {type: TAG.SHORT, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.INT) {
      d = NbtReader.readInt(buffer);
      buffer = d.buffer;
      return {type: TAG.INT, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.LONG) {
      d = NbtReader.readLong(buffer);
      buffer = d.buffer;
      return {type: TAG.LONG, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.FLOAT) {
      d = NbtReader.readFloat(buffer);
      buffer = d.buffer;
      return {type: TAG.FLOAT, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.DOUBLE) {
      d = NbtReader.readDouble(buffer);
      buffer = d.buffer;
      return {type: TAG.DOUBLE, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.BYTEARRAY) {
      d = NbtReader.readByteArray(buffer);
      buffer = d.buffer;
      return {type: TAG.BYTEARRAY, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.INTARRAY) {
      d = NbtReader.readIntArray(buffer);
      buffer = d.buffer;
      return {type: TAG.INTARRAY, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.STRING) {
      d = NbtReader.readString(buffer);
      buffer = d.buffer;
      return {type: TAG.STRING, name: name, val: d.val, buffer: buffer};
    } else if (type == TAG.LIST) {
      d = NbtReader.readByte(buffer);
      buffer = d.buffer;
      type = d.val;
      d = NbtReader.readInt(buffer);
      buffer = d.buffer;
      var size = d.val;
      var list = [];
      for (var i = 0; i < size; i++) {
        d = NbtReader.readTag(buffer, {val: {type: type}});
        buffer = d.buffer;
        list.push(d);
      }
      return {type: TAG.LIST, name: name, val: {type: type, list: list}, buffer: buffer};
    } else if (type == TAG.COMPOUND) {
      var c = [];
      while (true) {
        d = NbtReader.readTag(buffer);
        buffer = d.buffer;
        if (d.type === TAG.END) {
          break;
        } else {
          c.push(d);
        }
      }
      return {type: TAG.COMPOUND, name: name, val: c, buffer: buffer};
    }
  },
  removeBufferKey: function(d) {
    delete d.buffer;
    if (d.type === TAG.LIST || d.type === TAG.COMPOUND) {
      for (var i = 0; i < d.val.length; i++) {
        d.val[i] = NbtReader.removeBufferKey(d.val[i]);
      }
    }
    return d;
  },
  printAscii: function(d, col) {
    var string = '';
    var i;
    if (!col) {
      col = 0;
    }
    for (var j = 0; j < col; j++) {
      string+= '  ';
    }
    string+= d.type + ' ' + d.name;
    if (d.type !== TAG.LIST && d.type !== TAG.COMPOUND) {
      string+= ' ' + d.val;
    }
    console.log(string);
    if (d.type === TAG.LIST) {
      for (i = 0; i < d.val.list.length; i++) {
        NbtReader.printAscii(d.val.list[i], col + 1);
      }
    } else if(d.type === TAG.COMPOUND) {
      for (i = 0; i < d.val.length; i++) {
        NbtReader.printAscii(d.val[i], col + 1);
      }
    }
  }
};

var NbtWriter = {
  writeString: function(val) {
    var bufs = [];
    bufs.push(NbtWriter.writeShort(val.length));
    bufs.push(new Buffer(val, 'utf8'));
    return Buffer.concat(bufs);
  },
  writeShort: function(val) {
    var buf = new Buffer(2);
    buf.writeInt16BE(val, 0);
    return buf;
  },
  writeInt: function(val) {
    var buf = new Buffer(4);
    buf.writeInt32BE(val, 0);
    return buf;
  },
  writeLong: function(val) {
    var buf = new Buffer(8);
    if (typeof val == 'number') {
      val = Long.fromNumber(val);
    }
    val.getBuffer().copy(buf);
    return buf;
  },
  writeFloat: function(val) {
    var buf = new Buffer(4);
    buf.writeFloatBE(val, 0);
    return buf;
  },
  writeDouble: function(val) {
    var buf = new Buffer(8);
    buf.writeDoubleBE(val, 0);
    return buf;
  },
  writeByte: function(val) {
    var buf = new Buffer(1);
    buf.writeInt8(val, 0);
    return buf;
  },
  writeTagName: function(d) {
    var bufs = [];
    bufs.push(NbtWriter.writeByte(d.type));
    if (d.type !== TAG.END) {
      bufs.push(NbtWriter.writeString(d.name));
    }
    return Buffer.concat(bufs);
  },
  writeByteArray: function(val) {
    var bufs = [];
     bufs.push(NbtWriter.writeInt(val.length));
    for (var i = 0; i<val.length; i++) {
      bufs.push(NbtWriter.writeByte(val[i]));
    }
    return Buffer.concat(bufs);
  },
  writeIntArray: function(val) {
    var bufs = [];
     bufs.push(NbtWriter.writeInt(val.length));
    for (var i = 0; i<val.length; i++) {
      bufs.push(NbtWriter.writeInt(val[i]));
    }
    return Buffer.concat(bufs);
  },
  writeTag: function(d, withoutHeader) {
    var bufs = [];
    var i;
    if (!withoutHeader) {
      bufs.push(NbtWriter.writeTagName(d));
    }
    if (d.type === TAG.BYTE) {
      bufs.push(NbtWriter.writeByte(d.val));
    } else if (d.type === TAG.SHORT) {
      bufs.push(NbtWriter.writeShort(d.val));
    } else if (d.type === TAG.INT) {
      bufs.push(NbtWriter.writeInt(d.val));
    } else if (d.type === TAG.LONG) {
      bufs.push(NbtWriter.writeLong(d.val));
    } else if (d.type === TAG.FLOAT) {
      bufs.push(NbtWriter.writeFloat(d.val));
    } else if (d.type === TAG.DOUBLE) {
      bufs.push(NbtWriter.writeDouble(d.val));
    } else if (d.type === TAG.STRING) {
      bufs.push(NbtWriter.writeString(d.val));
    } else if (d.type === TAG.BYTEARRAY) {
      bufs.push(NbtWriter.writeByteArray(d.val));
    } else if (d.type === TAG.INTARRAY) {
      bufs.push(NbtWriter.writeIntArray(d.val));
    } else if (d.type === TAG.LIST) {
      bufs.push(NbtWriter.writeByte(d.val.type));
      bufs.push(NbtWriter.writeInt(d.val.list.length));
      for (i = 0; i < d.val.list.length; i++) {
        bufs.push(NbtWriter.writeTag(d.val.list[i], true));
      }
    } else if (d.type === TAG.COMPOUND) {
      for (i = 0; i < d.val.length; i++) {
        bufs.push(NbtWriter.writeTag(d.val[i]));
      }
      bufs.push(NbtWriter.writeTag({type: TAG.END}));
    }
    return Buffer.concat(bufs);
  }
};

exports.NbtReader = NbtReader;
exports.NbtWriter = NbtWriter;
exports.TAG = TAG;