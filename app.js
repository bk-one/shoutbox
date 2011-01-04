require.paths.unshift(__dirname + '/lib');

var express         = require('express'),
    sys             = require('sys'),
    Shoutbox        = require('shoutbox').Shoutbox,
    ShoutboxBayeux  = require('shoutbox_bayeux').ShoutboxBayeux,
    ShoutboxFilter  = require('controller/shoutbox_filter').ShoutboxFilter,
    UpdateDataValidator = require('controller/update_data_validator').UpdateDataValidator;

var app        = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
  app.use(express.bodyDecoder());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Initialize
var shoutbox  = new Shoutbox('localhost', 27017);
var bayeux    = new ShoutboxBayeux( app );


// Middleware
function initializeShoutbox(req, res, next) {
  req.shoutboxId = 'test-shoutbox8';
  shoutbox.findOrCreateByName( req.shoutboxId, function(err, doc) {
    console.log('middle ' + sys.inspect(doc));
    req.shoutbox = doc;
    next();
  });
}


// Routes
app.get('/', initializeShoutbox, function(req, res){
  console.log('DEBUG' + sys.inspect(req.shoutbox.groups));
  res.render('index', {
    locals: {
      statusData: req.shoutbox.groups,
      title: 'Express'
    }
  });
});

app.put('/status', UpdateDataValidator.updateDataValidator, initializeShoutbox, function(req, res){
  // debugger;
  shoutbox.updateStatusOnShoutbox( req.shoutboxId, req.shoutbox, req.shoutboxUpdateData );
  bayeux.publishUpdate( req.shoutboxUpdateData );
  res.send('OK');
});

app.delete('/status', UpdateDataValidator.updateStatusOnShoutbox, initializeShoutbox, function(req, res){
  shoutbox.deleteStatusOnShoutbox( req.shoutboxId, req.shoutbox, req.shoutboxUpdateData );
  res.send('OK');
})

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
