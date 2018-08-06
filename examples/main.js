'use strict';

const fs = require('fs');
const path = require('path');
const O = require('../deps/framework');
const functional = require('../src');
const cmdArgsParser = require('./cmd-args-parser');

const examplesDir = cwd('examples');

const args = cmdArgsParser.parse();

setTimeout(main);

function main(){
  var header = O.buff2ascii(fs.readFileSync(cwd(args.header)));

  var srcFile = path.join(examplesDir, args.src);
  var src = O.buff2ascii(fs.readFileSync(srcFile));

  var input = fs.readFileSync(args.input);

  var machine = new functional.Machine([header, src]);
  var io = new functional.io.IO(machine, input);

  var tick = machine.start();
  while(!tick.next().done);

  if(machine.error){
    console.log('ERROR: Out of memory');
    return;
  }

  var output = io.getOutput();
  fs.writeFileSync(args.output, output);
}

function cwd(file){
  return path.join(__dirname, file);
}