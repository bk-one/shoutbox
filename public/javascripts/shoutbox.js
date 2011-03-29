function ShoutboxClient() {
  var self = this;

  this.init = function(){
    this.loadEntries();
  };

	this.ShoutboxAuth = {
	  outgoing: function(message, callback) {
		  if (message.channel == "/meta/subscribe") {
			  if (!message.ext) message.ext = {};
			  message.ext.authToken = self.authToken;
			}
	    callback(message);
	  }
	};

  this.setupBayeuxClient = function() {
    var that = this;
    self.client = new Faye.Client(location.protocol + '//' + location.host + '/bayeux', { timeout: 180 });
		self.client.addExtension(that.ShoutboxAuth);
    self.client.subscribe('/status/' + that.accountName, function(updateData) {
      console.log(updateData);
      var el = that.findEntry(updateData);
      el.removeClass();
      el.attr('data-updated-at', updateData.updated_at);
      el.attr('data-expires-at', updateData.expires_at);
      el.addClass(updateData.status);
      el.addClass('fresh')
      that.colorizesNav();
    });
  };

  this.loadEntries = function() {
    var that = this;
    $.getJSON('/data', function(data, status, req) {
	    that.authToken   = req.getResponseHeader('X-Shoutbox-Auth-Token');
	 		that.accountName = req.getResponseHeader('X-Shoutbox-Account-Name');
      _(data).forEach(function(entries, group) {
        _(entries).forEach(function(entry, name) {
          that.addEntry(_(entry).extend({ name: name, group: group }));
        });
      });
      that.colorizesNav();
	    that.setupBayeuxClient(); // we need authToken and accountName
    });
  };

  this.addGroup = function(data) {
    $('#groups').append($.mustache($('#group-template').html(), data));
    $('#group-titles').append($.mustache($('#group-title-template').html(), data));
    return $('#groups [data-group-id="' + data.group + '"]');
  };

  this.findGroup = function(data) {
    var el = $('#groups [data-group-id="' + data.group + '"]');
    if (el.length == 0) {
      el = this.addGroup(data);
    }
    return el;
  };

  this.addEntry = function(data) {
    this.findGroup(data).find('ul').append($.mustache($('#entry-template').html(), data));
    return $('[data-entry-id="' + data.slug + '"]');
  };

  this.findEntry = function(data) {
    var el = $('[data-entry-id="' + data.slug + '"]');
    if (el.length == 0) {
      el = this.addEntry(data);
    }
    return el;
  };

  this.colorizesNav = function() {
    _($('#group-titles > a')).each(function(el) {
      var el = $(el),
          groupEl = $('#groups > li[data-group-id="' + el.attr('data-group-id') + '"]');
      if (groupEl.find('.red').length) {
        el.removeClass('green yellow').addClass('red');
      }
      else if (groupEl.find('.yellow').length) {
        el.removeClass('green red').addClass('yellow');
      }
      else {
        el.removeClass('yellow red').addClass('green');
      }
    });
  }

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
    });
  }

  function markOffline() {
    $('li[data-expires-at]').each(function(){
	    expiresAt = $(this).attr('data-expires-at');
      if ((parseInt(expiresAt) * 1000) < (new Date().getTime()) ) {
        $(this).addClass('offline');
      }
	  });
  }

  setInterval(function () {
    checkStatus();
    markOffline();
  }, 10 * 1000);

  $('[data-action="activate-info"]').click(function() {
    $(this).parents('li').toggleClass('info-activated');
  });

  $('body').append($.mustache($('#config-template').html(), {
    host: location.hostname,
    port: location.port,
    auth_token: shoutboxClient.authToken
  }));
  $('[data-action="close-config"]').click(function() {
    $('#config').fadeOut();
  });
  $('[data-action="config"]').click(function() {
    $('#config').fadeIn();
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
      marginTop: 80,
      showCallback: function(index) {
        $('#group-titles > a').removeClass('selected').eq(index).addClass('selected');
      }
    }).data('layout');
    layout.setLayout('spaces');
  });

  $('#group-titles').delegate('a', 'click', function() {
    var index = _($('#groups > li')).chain().map(function(group) {
      return $(group).attr('data-group-id');
    }).indexOf($(this).attr('data-group-id')).value();
    layout.show(index);
    return false;
  });
});


