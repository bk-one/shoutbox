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
      req.shoutboxStatusData.slug = DataValidator.createSlug(req.shoutboxStatusData.group + "-" + req.shoutboxStatusData.statusId);
      next();
    }
  },
  
  validateStatus : function(req, res, next) {
    req.shoutboxStatusData.status  = req.body.status;
    
    if (req.shoutboxStatusData.status != 'red' && req.shoutboxStatusData.status != 'green' && req.shoutboxStatusData.status != 'yellow') {
      res.send({message: 'INVALID STATUS'}, 409);
    } else {
      next();
    }
  },
  
  validateMessage : function(req, res, next) {
    if ((req.shoutboxStatusData.status == 'red' || req.shoutboxStatusData.status == 'yellow') && req.body.message == undefined) {
      res.send({message: 'MISSING STATUS MESSAGE'}, 409);
    } else {
      if (req.body.message) { req.shoutboxStatusData.message = req.body.message }
      next();
    }
  },
  
  emptyGroup : function( group ) {
    for(var i in group){ return false;}
    return true;
  },
  
  createSlug : function( slugcontent ) {
    slugcontent = slugcontent.toLowerCase();
    var   accents={a:/\u00e1/g,e:/u00e9/g,i:/\u00ed/g,o:/\u00f3/g,u:/\u00fa/g,n:/\u00f1/g}
    for (var i in accents) slugcontent = slugcontent.replace(accents[i],i);
    var slugcontent_hyphens = slugcontent.replace(/\s/g,'-');
    var finishedslug = slugcontent_hyphens.replace(/[^a-zA-Z0-9\-]/g,'')
                                          .replace(/-+/g,'-')
                                          .replace(/(^-)|(-$)/g,'');
    return finishedslug;
  }

} 

exports.DataValidator = DataValidator;
