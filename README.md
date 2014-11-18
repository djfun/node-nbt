node-nbt [![Build Status](https://travis-ci.org/djfun/node-nbt.png?branch=master)](https://travis-ci.org/djfun/node-nbt)
=============

[nodejs](http://nodejs.org) library for reading and writing [NBT files for Minecraft](http://minecraft.gamepedia.com/NBT_Format)

How to install
---------
Easy via npm: `npm install node-nbt`.

How to use
---------
Here is a simple example how you can read a gzipped NBT file into a Javascript object.

    var NbtReader = require('node-nbt').NbtReader;

    var fs = require('fs');
    fs.readFile('a_nbt_file.dat', function(err, data) {
      zlib.gunzip(data, function(err, buffer) {
        if (!err) {
          var d = NbtReader.readTag(buffer);
          d = NbtReader.removeBufferKey(d);
        } else {
          console.log(err);
        }
      });
    });

If you want to print that Javascript object to the console you can use the `NbtReader.printAscii(d);` function.

Available methods
-----------------

### NbtReader
* readTag: reads a tag of any type from a raw buffer
* readTagName: determines the type of the buffer by reading the tag name
* readString
* readShort
* readInt
* readLong
* readFloat
* readDouble
* readByte
* readByteArray
* readIntArray
* removeBufferKey: removes the raw buffer with nbt data from the javascript object
* printAscii: prints the analyzed nbt javascript object to the console

### NbtWriter
* writeTag: writes a tag of any type to a buffer
* writeTagName
* writeString
* writeShort
* writeInt
* writeLong
* writeFloat
* writeDouble
* writeByte
* writeByteArray
* writeIntArray

If you are writing user input to NBT consider using try-catch to catch TypeErrors.

Available Types
---------------
* TAG.END
* TAG.BYTE
* TAG.SHORT
* TAG.INT
* TAG.LONG
* TAG.FLOAT
* TAG.DOUBLE
* TAG.BYTEARRAY
* TAG.STRING
* TAG.LIST
* TAG.COMPOUND
* TAG.INTARRAY

Example
-------
node-nbt is used in production by [mc-map-item-tool](https://github.com/djfun/mc-map-item-tool)

Tests
-----
In the `test` folder there are some unit tests that can be run with [nodeunit](https://github.com/caolan/nodeunit).

License
-------
node-nbt is licensed under the MIT License