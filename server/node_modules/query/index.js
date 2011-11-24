#!/usr/bin/env node

/**
 * Module dependencies.
 */

var jsdom = require('jsdom')
  , jquery = require('./jquery');

/**
 * jsdom options.
 */

var jsdomOptions = {
  features: {
      FetchExternalResources: false
    , ProcessExternalResources: false
  }
};

/**
 * Buffer stdin.
 */

var stdin = process.openStdin()
  , buf = '';

stdin.setEncoding('utf8');
stdin
  .on('data', function(chunk){ buf += chunk; })
  .on('end', parseArguments);

/**
 * Supported "commands".
 */

var commands = {
    length:   { type: 'property' }
  , val:      { type: 'method', arity: 0 }
  , text:     { type: 'method', arity: 0 }
  , width:    { type: 'method', arity: 0 }
  , height:   { type: 'method', arity: 0 }
  , first:    { type: 'method traverse', arity: 0 }
  , last:     { type: 'method traverse', arity: 0 }
  , parent:   { type: 'method traverse', arity: 0 }
  , next:     { type: 'method traverse', arity: 0 }
  , prev:     { type: 'method traverse', arity: 0 }
  , eq:       { type: 'method traverse', arity: 1 }
  , is:       { type: 'method bool', arity: 1 }
  , attr:     { type: 'method bool', arity: 1 }
  , hasClass: { type: 'method bool', arity: 1 }
};

/**
 * Command aliases.
 */

var aliases = {
    len: 'length'
  , count: 'length'
  , get: 'eq'
  , 'has-class': 'hasClass'
};

/**
 * Parse argv.
 */

function parseArguments() {
  var args = process.argv.slice(2)
    , calls = []
    , alias
    , arg
    , cmd;

  function required() {
    if (args.length) return args.shift();
    console.error(arg + ' requires ' + cmd.arity + ' argument(s)');
    process.exit(1);
  }

  while (args.length) {
    arg = args.shift();
    alias = aliases[arg];
    // command
    if (cmd = commands[arg] || commands[alias]) {
      cmd = clone(cmd);
      cmd.name = alias || arg;
      cmd.args = [];
      // arguments required
      if (cmd.arity) {
        for (var i = 0; i < cmd.arity; ++i) {
          cmd.args.push(required());
        }
      }
      calls.push(cmd);
    // selector
    } else {
      calls.push({ type: 'selector', val: arg });
    }
  }

  parse(buf, calls);
}

/**
 * Parse and apply jQuery.
 */

function parse(html, calls) {
  var normalized = wrap(html)
    , wrapped = html != normalized
    , window = jsdom.jsdom(normalized, null, jsdomOptions).createWindow()
    , $ = jquery.create(window)
    , ctx = $(wrapped ? 'body' : '*')
    , call;

  while (call = calls.shift()) {
    switch (call.type) {
      case 'selector':
        ctx = ctx.find(call.val);
        break;
      case 'property':
        console.log(ctx[call.name]);
        process.exit();
      case 'method':
        console.log(ctx[call.name].apply(ctx, call.args));
        process.exit();
      case 'method traverse':
        ctx = ctx[call.name].apply(ctx, call.args);
        break;
      case 'method bool':
        var ret = ctx[call.name].apply(ctx, call.args);
        console.log(ret);
        process.exit(ret ? 0 : 1);
    }
  }

  ctx.each(function(i, el){
    console.log($(el).html());
  });
}

/**
 * Clone `obj`.
 */

function clone(obj) {
  var clone = {};
  for (var key in obj) clone[key] = obj[key];
  return clone;
}

/**
 * Wrap to prevent breakage for frags.
 */

function wrap(html) {
  if (!~html.indexOf('<body')) html = '<body>' + html + '</body>';
  if (!~html.indexOf('<html')) html = '<html>' + html + '</html>';
  return html;
}
