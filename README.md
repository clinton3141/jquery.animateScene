# 0) jQuery.animateScene.js

jQuery plugin to make animating scenes in HTML super-easy. Think of it as the HTML7 CSS4.3 version of the "annoying flash intro" if you like. 

## 1) Requirements
* [jQuery 1.7](https://github.com/jquery/jquery/tree/1.7)

## 2) Work in progress!

Consider it in pre-alpha and alost certainly broken. The API will change, invocation may change, hell, even the name might change! Good luck ;)

## 3) Usage

Animations and delays are taken from `data-` attributes in the HTML. This is probably a good plan in the CSS (assuming you add the `.js` class to the HTML with something like [Modernizr](http://modernizr.com/))
```
.js .animatable {
	visiblity: hidden;
}
```

Kick it all off with jQuery

```
$(".animatable").animateScene("go");
```

**PLEASE NOTE**: Please see point number 2! This is likely to change!

## 4) Examples

I'm working on it.
