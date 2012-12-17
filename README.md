node-nbt
=============

[nodejs](http://nodejs.org) library for reading and writing NBT files

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

TODO: More examples on how to write NBT files with `NbtWriter`.



Tests
-----
In the `test` folder there are some unit tests that can be run with [nodeunit](https://github.com/caolan/nodeunit).