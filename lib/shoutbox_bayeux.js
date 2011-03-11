var sys       = require('sys'),
    faye      = require('faye');
    
    
ShoutboxBayeux = function( app ) {
  this.bayeux = new faye.NodeAdapter({
    mount: '/bayeux',
    timeout: 45
  });
  
  this.publishUpdate = function( updateData ) {
    this.bayeux.getClient().publish('/status', updateData );
  };

  this.publishDelete = function( updateData ) {
    this.bayeux.getClient().publish('/status', { delete: updateData.slug } );
  };

  this.bayeux.attach( app );
};

exports.ShoutboxBayeux = ShoutboxBayeux;