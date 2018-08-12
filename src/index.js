'use strict';

const O = require('../deps/framework');
const functional = require('./functional');

const {Machine} = functional;

module.exports = {
  ...functional,

  run,
  generate,
  compile,
  parse,
  normalize,
};

function run(src, input, IO=functional.io.IO){
  var machine = new Machine(src);
  var io = new IO(machine, input);
  var tick = machine.start();

  while(!tick.next().done);
  if(machine.error) return 'err';

  return io.getOutput();
}

function generate(){
  var header = '0,1,2,3,4,5,6,7,8';
  var src = '';

  src = `${header},\n\n${src}`;

  return src;
}

function compile(src){
  var machine = new Machine(src);
  return machine.compiled;
}

function parse(compiled){
  var machine = new Machine(compiled);
  var str = machine.parsed.toString();
  str = str.substring(1, str.length - 1);
  return str;
}

function normalize(src){
  return parse(compile(src));
}