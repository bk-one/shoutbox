var Layout;

(function() {
  var layouts = {};

  Layout = {
    _zoomed: false,
    options: {
      layout: 'list',
      margin: 20,
      padding: 6,
      index: 0
    },

    _create: function() {
      this._render();
      this.element.css({
        left: 0,
        position: 'absolute',
        top: 0
      });
      $('html').css({
        overflow: 'hidden'
      });
      var that = this;
      $(window).resize(function() {
        that._render();
      }).keyup(function(event) {
        if (event.which == 27 /* ESC */) {
          if (that._zoomed = !that._zoomed) {
            that.zoomOut();
          }
          else {
            that.zoomIn();
          }
        }
        else if ((event.which == 37 || event.which == 38) && that.options.index > 0) {
          that.options.index--;
          that.findLayout().show.call(that);
        }
        else if ((event.which == 39 || event.which == 40) && that.options.index < that.elements().length - 1) {
          that.options.index++;
          that.findLayout().show.call(that);
        }
      });
    },

    _render: function() {
      this.findLayout().render.call(this);
      this.findLayout().show.call(this);
    },

    elements: function() {
      return this.element.find('> *');
    },

    destroy: function() {
      $.Widget.prototype.destroy.apply(this, arguments);
    },

    addLayout: function(layout, renderer) {
      return layouts[layout] = renderer;
    },

    setLayout: function(layout) {
      if (this._zoomed) {
        this.zoomOut();
      }
      this.options.layout = layout;
      this._render();
    },

    getLayout: function() {
      return this.options.layout;
    },

    findLayout: function() {
      return layouts[this.options.layout];
    },

    zoomOut: function() {
      var windowWidth = $(window).width(),
          windowHeight = $(window).height(),
          width = this.element.width(),
          height = this.element.height(),
          factor = width > windowWidth ? windowWidth / width : windowHeight / height;
      this.element.css({
        WebkitTransform: 'scale(' + factor + ', ' + factor + ') ' +
          (width > windowWidth
            ? 'translateX(' + ((width - windowWidth) / -2 - parseInt(this.element.css('left'))) / factor + 'px)'
            : 'translateY(' + ((height - windowHeight) / -2 - parseInt(this.element.css('top'))) / factor + 'px)')
      });
      this._zoomed = true;
    },

    zoomIn: function() {
      this.element.css({
        WebkitTransform: 'scale(1, 1) translateX(0) translateY(0)'
      });
      this._zoomed = false;
    }
  };
})();

$.widget('ui.layout', Layout);

Layout.addLayout('list', {
  render: function() {
    var margin = this.options.margin,
        padding = this.options.padding,
        top = margin,
        windowWidth = $(window).width();
    this.elements().each(function() {
      var el = $(this),
          height = el.find('.inner').height();
      el.css({
        height: height + 'px',
        left: margin + 'px',
        padding: padding + 'px ' + padding + 'px 0',
        position: 'absolute',
        top: top + 'px',
        width: windowWidth - 2 * margin - 2 * padding + 'px'
      });
      top += height + margin + 2 * padding;
    });
    this.element.css({
      height: top + 'px',
      width: windowWidth + 'px'
    });
  },
  show: function(index) {
    this.element.css({
      left: 0,
      top: -parseInt(this.elements().eq(this.options.index).css('top')) + this.options.margin + 'px'
    });
  }
});

Layout.addLayout('spaces', {
  render: function() {
    var margin = this.options.margin,
        padding = this.options.padding,
        left = margin,
        right,
        windowHeight = $(window).height(),
        windowWidth = $(window).width();
    this.elements().each(function(i) {
      var el = $(this);
      right = -i * windowWidth - margin;
      el.css({
        left: left + 'px',
        height: windowHeight - 2 * margin - padding + 'px',
        padding: padding + 'px ' + padding + 'px 0',
        position: 'absolute',
        top: margin + 'px',
        width: windowWidth - 2 * margin - 2 * padding + 'px'
      });
      left += windowWidth - margin;
    });
    this.element.css({
      height: windowHeight + 'px',
      width: left + 'px'
    });
  },
  show: function() {
    this.element.css({
      left: -this.options.index * ($(window).width() - this.options.margin) + 'px',
      top: 0
    });
  }
});
