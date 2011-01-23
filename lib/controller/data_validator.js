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
    req.shoutboxStatusData.name    = req.body.name;
    
    if (req.shoutboxStatusData.status != 'red' && req.shoutboxStatusData.status != 'green') {
      res.send({message: 'INVALID STATUS'}, 409);
    } else {
      next();
    }
  },
  
  emptyGroup : function( group ) {
    for(var i in group){ return false;}
    return true;
  }

} 

exports.DataValidator = DataValidator;
