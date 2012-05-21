# 0) jQuery.animateScene.js

jQuery plugin to make animating scenes in HTML super-easy. Think of it as the HTML7 CSS4.3 version of the "annoying flash intro" if you like. 

## 1) Requirements
* [jQuery 1.7](https://github.com/jquery/jquery/tree/1.7)

## 2) Work in progress!

Consider it in pre-alpha and alost certainly broken. The API will change, invocation may change, hell, even the name might change! Good luck ;)

## 3) Usage

Animations and delays are taken from `data-` attributes in the HTML.
```
<div id="my-scene">
	<span id="cloud1" class="cloud animatable" data-animation="bounceInDown" data-delay="1000"></span>
	<span id="cloud2" class="cloud animatable" data-animation="bounceInDown" data-delay="1500"></span>
	<span id="cloud3" class="cloud animatable" data-animation="bounceInDown" data-delay="2000"></span>
</div>
```

Sample CSS
```
.js .animatable {
	visiblity: hidden;
}

#my-scene
{
	position: relative;
	width: 600px;
	height: 400px;
}

.cloud
{	
	width: 100px;
	height: 50px;
	background-image: url(cloud.png);
	position: absolute;
	display: block;
	top: 0;
}

#cloud1
{
	left: 50px;
}

#cloud2
{
	left: 200px;
}

#cloud3
{
	left: 450px;
}

```

Kick it all off with jQuery

```
// start preloading images
$("#my-scene").animateScene(); // using default options
$("#my-scene-2").animateScene({animatables: ".moving-item"}); // specify animatable item selector
$("#my-scene-3").animateScene({randomDelay: 1000}); // add a bit of randomness to the animation sequence

// kick off the animation for one scene
$("#my-scene").animateScene("go");
// kick off animation for ALL scenes
$.animateScene.go();

// disable animations for one scene - elements will simply appear instead
$("#my-scene").animateScene("disable");
// disable animations for ALL scenes
$.animateScene.disable();

// enable animations for one scene
$("#my-scene").animateScene("enable");
// enable animations for ALL scenes
$.animateScene.enable();

// re-run animation
$("#my-scene .animatable").hide(); // poor-man's rewind
$("#my-scene").animateScene("go"); // just one scene
$.animateScene.go(); // ALL scenes

// add new custom animation
$.animateScene.addAnimation("moveAcrossScreen", function (el) {
	el.css({left, 0}).animate({
		left: '100%'
	}, {
		duration: 1000,
		easing: 'linear'
	});
});
```

**PLEASE NOTE**: Please see point number 2! This is likely to change!

## 4) Options

* `animatables`: selector for elements in the scene which are to be animated. Default is `.animatable`
* `randomDelay`: maximum time in milliseconds to delay animation by. It will be a random number between 0 and randomDelay. Default is `0`
* `go`: should the animation run straight away? Set to false to make the amimation wait for you to `$(selector).animateScene("go")`. Default is `true`

## 5) Examples

I'm working on it.


## 6) Changelog
### v0.2
* **Change data-delay from seconds to milliseconds**
* Add randomDelay option 
* **Animations now auto-play** you can disable this by passing the option `go: false`
