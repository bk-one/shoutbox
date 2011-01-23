var sys       = require('sys');

DataValidator = {
  validateGroup : function(req, res, next) {
    req.shoutboxStatusData        = req.shoutboxStatusData || {}
    req.shoutboxStatusData.group  = req.body.group;
    
    if (!req.shoutboxStatusData.group) {
      res.send({message: 'GROUP IS MISSING'}, 409);
    } else {
      next();
    }
  },
  
  validateStatusId : function(req, res, next) {
    req.shoutboxStatusData.statusId  = req.body.statusId;
    if (!req.shoutboxStatusData.group) {
      res.send({message: 'STATUS-ID IS MISSING'}, 409);
    } else {
      next();
    }
  },
  
  validateStatus : function(req, res, next) {
    req.shoutboxStatusData.status  = req.body.status;
    
    if (req.shoutboxStatusData.status != 'red' && req.shoutboxStatusData.status != 'green') {
      res.send({message: 'INVALID STATUS'}, 409);
    } else {
      next();
    }
  },
  
  validateMessage : function(req, res, next) {
    req.shoutboxStatusData.message = req.body.message;
    
    console.log("> " + sys.inspect(req.body));
    console.log("> " + sys.inspect(req.shoutboxStatusData));
    
    if (req.shoutboxStatusData.status == 'red' && req.body.message == undefined) {
      res.send({message: 'MISSING STATUS MESSAGE'}, 409);
    } else if (req.shoutboxStatusData.status == 'green') {
      delete( req.shoutboxStatusData.message );
    }
    next();
  },
  
  emptyGroup : function( group ) {
    for(var i in group){ return false;}
    return true;
  }

} 

exports.DataValidator = DataValidator;
