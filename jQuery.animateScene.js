;(function ($) {
	"use strict";
	var pluginName = 'animateScene',
		defaults = {
			animatables: ".animatable"
		},
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
		}()),
		reveal = function(el, animate) {
			var animation = el.data("animation");
			el.addClass("animated");
			if (animate && $.isFunction(animations[animation])) {
				animations[animation](el);
			} else {
				el.show();
			}
		},
		scenes = [],
		eachScene = function (callback) {
			$.each (scenes, function (index, scene) {
				callback(scene);
			});
		};


	function Scene (element, options) {
		this.options = $.extend({}, defaults, options);

		this.element = element;

		this.animatables = $(element).find(this.options.animatables);

		this.enabled = true;

		this._defaults = defaults;
		this._name = pluginName;

		this.active = false;

		this.init();
	}

	Scene.prototype = {
		init: function () {
			scenes.push(this);
			return this.animatables.each (function () {
				preload(this);
			});
		},
		enable: function () {
			this.enabled = true;
		},
		disable: function () {
			this.enabled = false;
		},
		go: function () {
			// stops the animations running more than once
			if (this.active) {
				return;
			}

			var animate = this.enabled;
			this.active = true;

			return this.animatables.each (function () {
				var $this = $(this),
					delay = $this.data("delay") || 0;

				$.when(preload($this)).then(function () {
					setTimeout (function () {
						reveal($this, animate);
					}, (Math.random() * 500 + delay * 1000));

				});
			});
		}
	};

    $.fn[pluginName] = function (options) {
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

	$[pluginName] = {
		enable: function () {
			eachScene(function (scene) {
				scene.disable();
			});
		},
		disable: function () {
			eachScene(function (scene) {
				scene.enable();
			});
		},
		go: function () {
			eachScene(function (scene) {
				scene.go();
			});
		}
	};
}(jQuery));
/*jslint browser: true, nomen: true, regexp: true, white: true */
