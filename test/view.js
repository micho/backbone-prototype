jQuery(document).ready(function() {

  module("Backbone.View");

  var view = new Backbone.View({
    id        : 'test-view',
    className : 'test-view'
  });

  v = view;

  test("View: constructor", function() {
    equals(view.el.id, 'test-view');
    equals(view.el.className, 'test-view');
    equals(view.options.id, 'test-view');
    equals(view.options.className, 'test-view');
  });

  test("View: Selectors", function() {
    view.el = document.body;
    equals(view.$('#qunit-header a')[0].innerHTML, ' Backbone Test Suite');
    equals(view.$('#qunit-header a')[1].innerHTML, 'Backbone Speed Suite');
  });

  test("View: make", function() {
    var div = view.make('div', {id: 'test-div'}, "one two three");
    equals(div.tagName.toLowerCase(), 'div');
    equals(div.id, 'test-div');
    equals(jQuery(div).text(), 'one two three');
  });

  test("View: initialize", function() {
    var View = Backbone.View.extend({
      initialize: function() {
        this.one = 1;
      }
    });
    var view = new View;
    equals(view.one, 1);
  });

  test("View: delegateEvents", function() {
    var counter = counter2 = 0;
    view.el = document.body;
    view.increment = function(){ counter++; };
    jQuery(view.el).bind('click', function(){ counter2++; });
    var events = {"click #qunit-banner": "increment"};
    view.delegateEvents(events);
    jQuery('#qunit-banner').trigger('click');
    equals(counter, 1);
    equals(counter2, 1);
    jQuery('#qunit-banner').trigger('click');
    equals(counter, 2);
    equals(counter2, 2);
    view.delegateEvents(events);
    jQuery('#qunit-banner').trigger('click');
    equals(counter, 3);
    equals(counter2, 3);
  });

  test("View: _ensureElement with DOM node el", function() {
    var ViewClass = Backbone.View.extend({
      el: document.body
    });
    var view = new ViewClass;
    equals(view.el, document.body);
  });

  test("View: _ensureElement with string el", function() {
    var ViewClass = Backbone.View.extend({
      el: "body"
    });
    var view = new ViewClass;
    equals(view.el, document.body);

    ViewClass = Backbone.View.extend({
      el: "body > h2"
    });
    view = new ViewClass;
    equals(view.el, jQuery("#qunit-banner").get(0));

    ViewClass = Backbone.View.extend({
      el: "#nonexistent"
    });
    view = new ViewClass;
    ok(!view.el);
  });

  test("View: with attributes", function() {
    var view = new Backbone.View({attributes : {'class': 'one', id: 'two'}});
    equals(view.el.className, 'one');
    equals(view.el.id, 'two');
  });

  test("View: multiple views per element", function() {
    var count = 0, ViewClass = Backbone.View.extend({
      el: jQuery("body"),
      events: {
        "click": "click"
      },
      click: function() {
        count++;
      }
    });

    var view1 = new ViewClass;
    jQuery("body").trigger("click");
    equals(1, count);

    var view2 = new ViewClass;
    jQuery("body").trigger("click");
    equals(3, count);

    view1.delegateEvents();
    jQuery("body").trigger("click");
    equals(5, count);
  });
});
