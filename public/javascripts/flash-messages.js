(function($) {
  $(function() {
    var params = {};
    _(location.search.substr(1).split('&')).each(function(param) {
      param = param.split('=');
      params[param[0]] = unescape(param[1]);
    });
    console.log(params)

    _('error warning notice'.split(' ')).each(function(type) {
      var message = params['flash_' + type];
      if (message) {
        var el = $('<div id="flash-' + type + '">' + message + '</div>');
        $('#flash-messages').append(el);
        setTimeout(function() {
          el.slideDown();
        }, 1000);
      }
    });
  });
})(jQuery);
