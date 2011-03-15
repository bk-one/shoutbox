var shoutboxClient, layout;

function ShoutboxClient() {
  var self = this;
  this.init = function(){
    self.setupBayeuxClient();
    self.loadEntries();
    setInterval(function() {
      self.checkStatus();
    }, 10 * 1000);
  };

  this.setupBayeuxClient = function() {
    self.client = new Faye.Client(location.protocol + '//' + location.host + '/bayeux', { timeout: 180000 });
    self.client.subscribe('/status', function(updateData) {
      console.log(updateData);
      if (updateData.remove) {
        self.removeEntry({ slug: updateData.remove });
      }
      else {
        var el = self.findEntry(updateData);
        el.removeClass();
        el.attr('data-updated-at', updateData.updatedAt);
        el.addClass(updateData.status);
        el.addClass('fresh');
        layout.show(indexByGroup(updateData.group));
      }
      self.colorizesNav();
      self.checkStatus();
    });
  };

  this.checkStatus = function() {
    $('li[data-updated-at]').each(function(){
      lastUpdate = $(this).attr('data-updated-at');

      if ((parseInt(lastUpdate) + 1 * 60 * 1000) < (new Date().getTime()) ) {
        $(this).removeClass('fresh');
      }
      if ((parseInt(lastUpdate) + 30 * 60 * 60 * 1000) < (new Date().getTime()) ) {
        $(this).addClass('offline');
      }
    });
    this.colorizesNav();
  };

  this.loadEntries = function() {
    $.getJSON('/data', function(data) {
      _(data).forEach(function(entries, group) {
        _(entries).forEach(function(entry, name) {
          self.addEntry(_(entry).extend({ statusId: name, group: group }));
        });
      });
      self.colorizesNav();
      self.checkStatus();
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
    data = _(data).clone();
    data.className = data.status + (data.message ? '' : ' without-info');
    this.findGroup(data).find('ul').append($.mustache($('#entry-template').html(), data));
    return $('[data-entry-id="' + data.slug + '"]');
  };

  this.removeEntry = function(data) {
    this.findEntry(data).remove();
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
      if (groupEl.find('.red').length || groupEl.find('.offline').length) {
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

jQuery(function() {
  shoutboxClient = new ShoutboxClient();
});


var indexByGroup = function(group) {
  return _($('#groups > li')).chain().map(function(el) {
    return $(el).attr('data-group-id');
  }).indexOf(group).value();
}

$(function() {
  $('#groups').delegate('[data-action="activate-info"]', 'click', function() {
    $(this).parents('li').toggleClass('info-activated');
  });

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
    var index = indexByGroup($(this).attr('data-group-id'));
    layout.show(index);
    return false;
  });
});


