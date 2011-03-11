function ShoutboxClient() {
  var self = this;
  this.init = function(){
    this.setupBayeuxClient();
    this.loadEntries();
  };

  this.setupBayeuxClient = function() {
    var that = this;
    self.client = new Faye.Client(location.protocol + '//' + location.host + '/bayeux', { timeout: 180 });
    self.client.subscribe('/status', function(updateData) {
      console.log(updateData);
      var el = $('[data-entry-id="' + updateData.slug + '"]');
      if (el.length == 1) {
        el.removeClass();
        el.attr('data-updated-at', updateData.updatedAt);
        el.addClass(updateData.status);
        el.addClass('fresh')
      }
      else {

      }
      that.colorizesNav();
    });
  };

  this.loadEntries = function() {
    var that = this;
    $.getJSON('/data', function(data) {
      _(data).forEach(function(entries, group) {
        _(entries).forEach(function(entry, name) {
          that.addEntry(_(entry).extend({ statusId: name, group: group }));
        });
      });
      that.colorizesNav();
    });
  };

  this.addGroup = function(data) {
    $('#groups').append($.mustache($('#group-template').html(), data));
    $('#group-titles').append($.mustache($('#group-title-template').html(), data));
    return $('[data-group-id="' + data.group + '"]');
  };

  this.findGroup = function(data) {
    var el = $('[data-group-id="' + data.group + '"]');
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
    console.log($('#group-titles > a'))
    _($('#group-titles > a')).each(function(el) {
      var el = $(el),
          groupEl = $('#groups > li[data-group-id="' + el.attr('data-group-id') + '"]');
          console.log(el, groupEl)
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


