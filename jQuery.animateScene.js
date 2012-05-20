;(function ($) {
	"use strict";
	var pluginName = 'animateScene',
		defaults = {},
		ANIMATIONS_ENABLED = true,
		animations = {
			// e.g. cloud bouncing in down from the top
			bounceInDown: function ($el) {
				var height = $el.height();
				$el.css("margin-top", -height).css("opacity", 0).animate({
						marginTop: 0,
						opacity: 1
					}, {
						duration: 2500,
						easing: 'easeOutElastic'
					});
			},
			// e.g. buildings growing up from the floor
			growUp: function ($el) {
				var height = $el.height();

				$el.css("height", 0).css("opacity", 0).animate({
						opacity: 1,
						height: height
					}, {
						duration: 1000,
						specialEasing: {
							height: 'easeOutCirc',
							opacity: 'easeOutSine'
						}
					});
			}
		},
		preload = (function () {
				var loaded = {},
					getBackgroundSRC = function (el) {
						// return the URL of a background image of an element.
						return $(el).css("background-image").replace(/^url\("?([^"]*)"?\);?/, "$1");
					},
					load = function (src) {
						var deferred = $.Deferred();
						$("<img />", {
							"src": src
						}).on("load", function () {
							deferred.resolve();
						});
						return deferred.promise();
					};


				return function (el) {
					var src = getBackgroundSRC(el);

					if (typeof loaded[src] === "undefined") {
						loaded[src]	= load(src);
					}

					return loaded[src];
				};
			})(),
		reveal = function(el) {
			var animation = el.data("animation");
			el.addClass("animated");
			if (ANIMATIONS_ENABLED && $.isFunction(animations[animation])) {
				animations[animation](el);
			} else {
				el.show();
			}
		};


	function Scene (element, options) {
		this.element = element;

		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Scene.prototype = {
		enable: function () {
			ANIMATIONS_ENABLED = true;
		},
		disable: function () {
			ANIMATIONS_ENABLED = true;
		},
		go: function () {
			return $(this.element).each (function () {
				var $this = $(this),
					delay = $this.data("delay") || 0;

				$.when(preload($this)).then(function () {
					setTimeout (function () {
						reveal($this);
					}, (Math.random() * 500 + delay * 1000));

				});
			});
		},
		init: function () {
			return $(this.element).each (function () {
				preload(this);
			});
		}
	};

    $.fn[pluginName] = function ( options ) {
		return this.each(function () {
			var scene;
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Scene( this, options ));
			}
			scene = $.data(this, 'plugin_' + pluginName);
			if (typeof options === "string" && $.isFunction(scene[options])) {
				scene[options]();
			}
		});
    };
})(jQuery);
