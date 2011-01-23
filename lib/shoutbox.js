var Db        = require('mongodb/db').Db,
    sys       = require('sys'),
    ObjectID  = require('mongodb/bson/bson').ObjectID,
    DataValidator   = require('controller/data_validator').DataValidator,
    Server    = require('mongodb/connection').Server;

Shoutbox = function(host, port) {
  this.db     = new Db('shoutbox', new Server(host, port, { auto_reconnect: true }, { strict:true }));
  this.db.open(function(){});
};

Shoutbox.prototype.getCollection = function(callback) {
  this.db.collection('shoutboxes', function(err, collection) {
    if(err instanceof Error) {
      console.log('error: ' + sys.inspect(err))
      console.log('db: ' + sys.inspect(this.db))
      this.db.createCollection('shoutboxes', function(err, collection) {
        callback( null, collection );
      });
    } else {
      callback( null, collection );
    }
  });
};


Shoutbox.prototype.findOrCreateByName = function(shoutboxId, callback) {
    this.getCollection(function(error, collection) {
      if( error ) {
        callback(error)
      } else {
        collection.findOne({ 'name': shoutboxId }, function(error, result) {
          if( error ) {
            console.log('not found' + error);
            callback(error)
          } else {
            if (result) {
              callback(null, result);
            } else {
              collection.insert({
                'name'   : shoutboxId,
                'groups' :{ 'default' : {} } }, function(err, docs) {
                });
              this.findOrCreateByName(shoutboxId);
            }
          }
        });
      }
  });
};

Shoutbox.prototype.updateStatusOnShoutbox = function( shoutboxId, shoutbox, updateData, status ) {
  this.db.collection('shoutboxes', function(err, collection) {
    if (!shoutbox.groups[updateData.group]) {
      shoutbox.groups[updateData.group] = {}
    }
    shoutbox.groups[updateData.group][updateData.statusId] = { status: updateData.status, updatedAt : new Date().getTime(), message: updateData.message }
    
    collection.update({ _id: shoutbox._id }, shoutbox, { safe: true, upsert: true }, function(error, document){
      // TODO: add error handling
    });
  });
}

Shoutbox.prototype.deleteStatusOnShoutbox = function( shoutboxId, shoutbox, group, statusId ) {
  this.db.collection('shoutboxes', function(err, collection) {
    if(shoutbox.groups[group]) {
      delete shoutbox.groups[group][statusId];
      if (DataValidator.emptyGroup(shoutbox.groups[group])) {
        delete shoutbox.groups[group];
      }
      collection.update({ _id: shoutbox._id }, shoutbox, { safe: true, upsert: true }, function(error, document){
        // TODO: add error handling
      });
    }
  });
}

exports.Shoutbox = Shoutbox;