'use strict';

const fs = require('fs');
const path = require('path');
const O = require('../deps/framework');
const functional = require('../src');
const cmdArgsParser = require('./cmd-args-parser');

const args = cmdArgsParser.parse();

setTimeout(main);

function main(){
  var src = fs.readFileSync(args.src, 'ascii');
  var input = fs.readFileSync(args.input);

  var machine = new functional.Machine(src);
  var io = new functional.IO(machine, input);

  var tick = machine.start();
  while(!tick.next().done);

  var output = io.getOutput();
  fs.writeFileSync(args.output, output);
}