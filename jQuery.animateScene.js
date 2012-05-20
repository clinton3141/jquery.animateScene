;(function ($) {
	var ANIMATIONS_ENABLED = true,
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
		init = function () {
		},
		API = {},
		preload = (function () {
				var loaded = {},
					getBackgroundSRC = function (el) {
						// return the URL of a background image of an element.
						return el.css("background-image").replace(/^url\("?([^"]*)"?\);?/, "$1");
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


	/**
	 *
	 */
	API.enableAnimations = function () {
		ANIMATIONS_ENABLED = true;
	};

	/**
	 *
	 */
	API.disableAnimations = function () {
		ANIMATIONS_ENABLED = false;
	};

	/**
	 *
	 */
	API.go = function () {
		return this.each (function () {
			var $this = $(this);
				delay = $this.data("delay") || 0;

			$.when(preload($this)).then(function () {
				setTimeout (function () {
					reveal($this);
				}, (Math.random() * 500 + delay * 1000));

			});
		});
	};

	/**
	 * get a head start on preloading the assets
	 */
	API.init = function () {
		return this.each (function () {
			preload(this);
		});
	};

	// TODO: THIS IS A MESS! Sort it out!!11!!!!!!1
	$.fn.animateScene = function(method) {
		if (API[method]) {
			return API[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || !method) {
			return init.apply(this, arguments);
		} else {
			$.error("jQuery.animateScene('" + method + "') doesn't exist");
		}
	};
})(jQuery);
