var sys       = require('sys');

UpdateDataValidator = {
  updateDataValidator : function(req, res, next) {
    req.shoutboxUpdateData = {}
    req.shoutboxUpdateData.group  = req.body.group || 'default';
    req.shoutboxUpdateData.name   = req.body.name;
    req.shoutboxUpdateData.status = req.body.status;
    
    if (req.shoutboxUpdateData.status != 'red' && req.shoutboxUpdateData.status != 'green') {
      // TODO - proper error handling
      res.send({message: 'INVALID UPDATE DATA'}, 409);
    } else {
      next();
    }
  }
} 

exports.UpdateDataValidator = UpdateDataValidator;
