
// Run $ expresso

/**
 * Module dependencies.
 */

var assert = require('assert'),
    sys    = require('sys'),
    app    = require('../app');
    
module.exports = {
  'test welcome message': function(){
    
    assert.response(app,
      { url: '/', method: 'GET' },
      { body: /Welcome to your dashboard/ });
    },
  // 
  // 'test PUT request': function(){
  //   assert.response(app,
  //     { url: '/status/1/2', method: 'PUT' },
  //     { body: /FAILED/ }); 
  // }
};

