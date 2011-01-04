function ShoutboxClient() {
  var self = this;
  this.init = function(){
    this.setupBayeuxClient();
  };
  
  this.setupBayeuxClient = function() {
    self.client = new Faye.Client('http://localhost:3000/bayeux', { timeout: 180 });
    self.client.subscribe('/status', function(updateData) {
      $('#' + updateData.name).removeClass();
      $('#' + updateData.name).addClass(updateData.status);
    });
  };
  
  this.init();
}

var shoutboxClient;
jQuery(function() {
  shoutboxClient = new ShoutboxClient();
});
