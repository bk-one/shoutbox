function ShoutboxClient() {
  var self = this;
  this.init = function(){
    this.setupBayeuxClient();
  };
  
  this.setupBayeuxClient = function() {
    self.client = new Faye.Client('http://localhost:3000/bayeux', { timeout: 180 });
    self.client.subscribe('/status', function(updateData) {
      console.log(updateData);
      var el = $('#' + updateData.slug);
      el.removeClass();
      el.attr('data-updated-at', updateData.updatedAt);
      el.addClass(updateData.status);
      el.addClass('fresh')
      var ol = el.parent(), group = ol.parent();
      if (ol.find('.red').length) {
        group.removeClass('green');
        group.addClass('red');
      }
      else {
        group.removeClass('red');
        group.addClass('green');
      }
    });
  };
  
  this.init();
}

var shoutboxClient;
jQuery(function() {
  shoutboxClient = new ShoutboxClient();
});


$(function() {
  function checkStatus() {
    $('li[data-updated-at]').each(function(){
      lastUpdate = $(this).attr('data-updated-at');
      
      if ((parseInt(lastUpdate) + 1 * 60 * 1000) < (new Date().getTime()) ) {
        $(this).removeClass('fresh');
      }
      if ((parseInt(lastUpdate) + 30 * 60 * 60 * 1000) < (new Date().getTime()) ) {
        $(this).addClass('offline');
      }
    });
  }

  setInterval(function () {
    checkStatus();
  }, 10 * 1000);
  
  $('[data-action="activate-info"]').click(function() {
    $(this).parents('li').toggleClass('info-activated');
  });
  
  var layout;
  $('[data-action="list"]').click(function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    layout.setLayout('list');
  });
  $('[data-action="spaces"]').click(function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    layout.setLayout('spaces');
  });
  
  $(window).load(function() {
    layout = $('#groups').layout({
      marginTop: 80
    }).data('layout');
    layout.setLayout('spaces');
  });
});


