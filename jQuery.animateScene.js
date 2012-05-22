/**
 * jQuery.animateScene.js version 0.2
 *
 * Copyright (c) 2012 Clinton Montague - http://slightlymore.co.uk/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function ($) {
	"use strict";
	var pluginName = "animateScene", // uhh, name of the plugin
		version = "0.2", // version number
		pluginDataKey = "plugin_" + pluginName + "_" + version, // key for $.data storing the initialised Scene object
		/**
		 * Defaults for the plugin - see README for detailed descriptions
		 */
		defaults = {
			animatables: ".animatable", // selector for animatable DOM nodes in the scene
			randomDelay: 0, // add a bit of randomness to the timings?
			go: true // should the animation autoplay?
		},

		/**
		 * available animations - you can add more with:
		 *		$.animateScene.addAnimation(name, animationFunction);
		 *
		 *	animationFunction takes a jQuery wrapped element as its argument
		 */
		animations = {
			// e.g. cloud bouncing in down from the top
			bounceInDown: function ($el) {
				var height = $el.height();
				$el.css("margin-top", -height).css("opacity", 0).animate({
						marginTop: 0,
						opacity: 1
					}, {
						duration: 2500,
						easing: "easeOutElastic"
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
							height: "easeOutCirc",
							opacity: "easeOutSine"
						}
					});
			}
		},

		/**
		 * Preload an image, returns a jQuery deferred object to indicate when the image has loaded.
		 *
		 * Argument is a jQuery wrapped element. Returns a deferred.
		 */
		preload = (function () {
			var loaded = {}, // cache of deferreds
				getBackgroundSRC = function (el) { // return the URL of a background image of an element.
					return el.css("background-image").replace(/^url\("?([^"]*)"?\);?/, "$1");
				},
				load = function (src) { // generate the deferred
					var deferred = $.Deferred();
					$("<img />", {
						"src": src
					}).on("load", function () {
						deferred.resolve();
					});
					return deferred.promise();
				};

			// check the cache for the image, if not defined, generate a new one and store it.
			// return appropriate deferred
			return function (el) {
				var src = getBackgroundSRC(el);

				if (typeof loaded[src] === "undefined") {
					loaded[src]	= load(src);
				}

				return loaded[src];
			};
		}()),

		/**
		 * Reveal a scene object (play the animation). el is a jQuery wrapped element.
		 * if animate is true, the object will animate, otherwise it'll just appear
		 */
		reveal = function(el, animate) {
			var animation = el.data("animation");
			el.addClass("animated");
			if (animate && $.isFunction(animations[animation])) {
				animations[animation](el);
			} else {
				el.show();
			}
		},

		/**
		 * Store of all of the scenes created with the plugin
		 */
		scenes = [],

		/**
		 * Run callback one every scene
		 */
		eachScene = function (callback) {
			$.each (scenes, function (index, scene) {
				callback(scene);
			});
		};


	/**
	 * A Scene represents each animatable layer.
	 */
	function Scene (element, options) {
		this.options = $.extend({}, defaults, options); // local store of options
		this.element = element; // parent element
		this.enabled = true; // allow for per-scene control over animations

		// let's do this!
		this.init();
		if (this.options.go) {
			this.go();
		}
	}

	/**
	 * $(selector).animateScene(method) style API
	 */
	Scene.prototype = {
		/**
		 * Set everything up for the first time
		 */
		init: function () {
			var animatables = $(this.element).find(this.options.animatables);
			scenes.push(this);
			return animatables.each (function () {
				preload($(this));
			});
		},

		/**
		 * Enable animations for this scene
		 */
		enable: function () {
			this.enabled = true;
		},

		/**
		 * Disable animations for this scene
		 */
		disable: function () {
			this.enabled = false;
		},

		/**
		 * Run the animations in this scene
		 */
		go: function () {
			var animatables = $(this.element).find(this.options.animatables), // animatable objects in this scene
				randomness = this.options.randomDelay, // randomness in animation time for this scene
				animate = this.enabled; // should this scene animate or not?

			return animatables.each (function () {
				var $this = $(this),
					delay = $this.data("delay") || 0,
					active = $this.data(pluginDataKey + "_active"); // has this object already animated? If so, don't run animation again

				// stops the animations running more than once
				if (active) {
					return;
				}
				// the animation is now running, save that information
				$this.data(pluginDataKey + "_active", true);

				// run animation when it's image has loaded
				$.when(preload($this)).then(function () {
					setTimeout (function () {
						reveal($this, animate);
					}, (Math.random() * randomness + delay));
				});
			});
		}
	};

	/**
	 * $.animateScene.method style API
	 */
	$[pluginName] = {
		/**
		 * Expose version number
		 */
		version: version,

		/**
		 * Enable ALL animations
		 */
		enable: function () {
			eachScene(function (scene) {
				scene.disable();
			});
		},

		/**
		 * Disable ALL animations
		 */
		disable: function () {
			eachScene(function (scene) {
				scene.enable();
			});
		},

		/**
		 * Run ALL scenes
		 */
		go: function () {
			eachScene(function (scene) {
				scene.go();
			});
		},

		/**
		 * Register a new animation.
		 *
		 * name should correspond to the name in data-animation
		 *
		 * fn is the animation function, it takes one argument which is the element
		 * to animate. Example:
		 *
		 * addAnimation("moveAcrossScreen", function (el) {
		 *   el.css({left, 0}).animate({
		 *     left: '100%'
		 *   }, {
		 *	   duration: 1000
		 *	   easing: 'linear'
		 *   })
		 * });
		 */
		addAnimation: function (name, fn) {
			animations[name] = fn;
		}
	};

	/**
	 * Release the plugin into the wild!
	 */
    $.fn[pluginName] = function (options) {
		return this.each(function () {
			var scene;
			// prevent two instantiations of a scene
			if (!$.data(this, pluginDataKey)) {
				$.data(this, pluginDataKey, new Scene(this, options));
			}
			// grab the scene from $.data
			scene = $.data(this, pluginDataKey);
			// deal with $(selector).animateScene("go")
			if (typeof options === "string" && $.isFunction(scene[options])) {
				scene[options]();
			}
		});
    };
}(jQuery));
/*jslint browser: true, nomen: true, regexp: true, white: true */
