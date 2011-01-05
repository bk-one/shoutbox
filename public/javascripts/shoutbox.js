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
  
  $('#groups h2').click(function() {
    var li = $(this).parent();
    li.toggleClass('opened');
    if (li.hasClass('opened')) {
      li.css({ height: 50 + li.children('ul').height() + 'px' });
    }
    else {
      li.css({ height: '30px' });
    }
  })
});
