var Shoutbox        = require('shoutbox').Shoutbox;

ShoutboxFilter = function(){
  
}

ShoutboxFilter.prototype.initializeShoutbox = function(req, res, next) {
  shoutbox.findOrCreateByName('test-shoutbox6', function(err, doc) {
    console.log('middle ' + sys.inspect(doc));
    req.shoutbox = doc;
    next();
  });
}


ShoutboxFilter.prototype.errorHandler = function(err, req, res, next) {
  console.log('error ' + sys.inspect(err));
  next();
}


exports.ShoutboxFilter = ShoutboxFilter;
