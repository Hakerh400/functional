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
  var header = fs.readFileSync(cwd(args.header), 'ascii');

  var srcFile = path.join(examplesDir, args.src);
  var src = fs.readFileSync(srcFile, 'ascii');

  var input = fs.readFileSync(args.input);

  var machine = new functional.Machine([header, src]);
  var io = new functional.io.IO(machine, input);

  var tick = machine.start();
  while(!tick.next().done);

  if(machine.error){
    console.log('Max stack size exceeded');
    return;
  }

  var output = io.getOutput();
  fs.writeFileSync(args.output, output);
}

function cwd(file){
  return path.join(__dirname, file);
}