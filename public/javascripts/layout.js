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
          that.show(that.options.index - 1);
        }
        else if ((event.which == 39 || event.which == 40) && that.options.index < that.elements().length - 1) {
          that.show(that.options.index + 1);
        }
        else {
          var number = event.which - 49;
          if (number >= 0 && number <= 8 && number < that.elements().length) {
            that.show(number);
          }
        }
      });
      this.show(this.options.index);
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
        this.zoomIn();
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
    },
    
    show: function(index) {
      if (index != this.options.index && index >= 0 && index < this.elements().length) {
        this.options.index = index;
        this._render();
        if (typeof this.options.showCallback == 'function') {
          this.options.showCallback(index);
        }
      }
    },
    
    margins: function() {
      var margin = this.options.margin;
      return {
        margin: margin,
        left:   this.options.marginLeft   || margin,
        top:    this.options.marginTop    || margin,
        bottom: this.options.marginBottom || margin,
        right:  this.options.marginRight  || margin,
      }
    }
  };
})();

$.widget('ui.layout', Layout);

Layout.addLayout('list', {
  render: function() {
    var margins = this.margins(),
        padding = this.options.padding,
        top = margins.top,
        windowWidth = $(window).width();
    this.elements().each(function() {
      var el = $(this),
          height = el.find('.inner').height();
      el.css({
        height: height + 'px',
        left: margins.left + 'px',
        padding: padding + 'px 0 0 ' + padding + 'px',
        position: 'absolute',
        top: top + 'px',
        width: windowWidth - margins.left - margins.right - 2 * padding + 'px'
      });
      top += height + margins.margin + 2 * padding;
    });
    this.element.css({
      height: top + 'px',
      width: windowWidth + 'px'
    });
  },
  show: function(index) {
    this.element.css({
      left: 0,
      top: -parseInt(this.elements().eq(this.options.index).css('top')) + this.margins().top + 'px'
    });
  }
});

Layout.addLayout('spaces', {
  render: function() {
    var margins = this.margins(),
        padding = this.options.padding,
        left = margins.left,
        right,
        windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        that = this;
    this.elements().each(function(i) {
      var el = $(this);
      right = -i * windowWidth - margins.right;
      el.css({
        left: left + 'px',
        height: windowHeight - margins.top - margins.bottom - padding + 'px',
        padding: padding + 'px 0 0 ' + padding + 'px',
        position: 'absolute',
        top: margins.top + 'px',
        width: windowWidth - margins.left - margins.right - padding + 'px'
      });
      left += windowWidth - margins.left;
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
