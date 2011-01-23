require.paths.unshift(__dirname + '/lib');

var express         = require('express'),
    sys             = require('sys'),
    Shoutbox        = require('shoutbox').Shoutbox,
    ShoutboxBayeux  = require('shoutbox_bayeux').ShoutboxBayeux,
    ShoutboxFilter  = require('controller/shoutbox_filter').ShoutboxFilter,
    DataValidator   = require('controller/data_validator').DataValidator;

var app             = module.exports = express.createServer();


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
  req.shoutboxId = dbname;
  shoutbox.findOrCreateByName( req.shoutboxId, function(err, doc) {
    req.shoutbox = doc;
    next();
  });
}


// Routes
app.get('/', initializeShoutbox, function(req, res){
  res.render('index', {
    locals: {
      statusData: req.shoutbox.groups,
      title: 'Express'
    }
  });
});


app.put('/status', 
        DataValidator.validateGroup, DataValidator.validateStatusId, DataValidator.validateStatus, DataValidator.validateMessage, initializeShoutbox, 
        function(req, res){
  shoutbox.updateStatusOnShoutbox( req.shoutboxId, req.shoutbox, req.shoutboxStatusData );
  bayeux.publishUpdate( req.shoutboxStatusData );
  res.send('OK');
});

app.delete('/status', 
            DataValidator.validateGroup, DataValidator.validateStatusId, initializeShoutbox, 
            function(req, res){
  shoutbox.deleteStatusOnShoutbox( req.shoutboxStatusData.statusId, req.shoutbox, req.shoutboxStatusData.group, req.shoutboxStatusData.statusId );
  res.send('OK');
});

// Only listen on $ node app.js

if (!module.parent) {
  dbname = 'test-shoutbox';
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}

