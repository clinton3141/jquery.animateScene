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
	<span id="cloud1" class="cloud animatable" data-animation="bounceInDown" data-delay="1"></span>
	<span id="cloud2" class="cloud animatable" data-animation="bounceInDown" data-delay="1.5"></span>
	<span id="cloud3" class="cloud animatable" data-animation="bounceInDown" data-delay="2"></span>
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
// start preloading images (this is optional)
$("#my-scene .animatable").animateScene();

// kick off the animation
$("#my-scene .animatable").animateScene("go");

// disable animations - elements will simply appear instead
$("#my-scene .animatable").animateScene("disable");

// enable animations
$("#my-scene .animatable").animateScene("enable");

// re-run animation
$("#my-scene .animatable").hide(); // poor-man's rewind
$("#my-scene .animatable").animateScene("go");
```

**PLEASE NOTE**: Please see point number 2! This is likely to change!

## 4) Examples

I'm working on it.
