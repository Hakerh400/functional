'use strict';

const fs = require('fs');
const O = require('../deps/framework');

const cmdArgs = [
  '-header/-h',
  '-src/-s',
  '-input/-i',
  '-output/-o',
].map(cmdArg => {
  cmdArg = cmdArg.split('/');
  cmdArg.name = cmdArg[0].substring(1);
  return cmdArg;
});

module.exports = {
  parse,
};

function parse(){
  var args = [...process.argv].slice(2);
  var obj = O.obj();

  obj.header = 'header.txt';
  obj.src = null;
  obj.input = 'input.txt';
  obj.output = 'output.txt';

  while(args.length !== 0){
    var arg = args.shift();

    var found = cmdArgs.some(cmdArg => {
      var cArg = cmdArg[0];
      var name = cmdArg.name;

      return cmdArg.some(cmdArg => {
        if(cmdArg !== arg) return 0;
        if(args.length === 0) err(`Incomplete ${esc(cArg)}`);
        
        obj[name] = args.shift();

        return 1;
      });
    });

    if(!found)
      err(`Unknown ${esc(arg)}`);
  }

  if(obj.src === null) err('Please specify source file');
  if(!obj.src.endsWith('.txt')) obj.src += '.txt';

  return obj;

  function esc(a){
    return `argument ${JSON.stringify(a)}`;
  }
}

function err(msg){
  msg = `ERROR: ${O.cap(msg)}\n`;
  fs.writeSync(process.stderr.fd, msg);
  process.exit();
}