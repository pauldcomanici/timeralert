/**
 * Application JS file
 */
/*global jQuery: true, TimeC: true, TimerDom: true, document: true*/
/*jslint sloppy: true*/
function colorToHex(color) {
	"use strict";
	/*jslint bitwise: true, regexp: true*/
	var digits,
		red,
		redHex,
		green,
		greenHex,
		blue,
		blueHex,
		rgb,
		rgbHex,
		completeHex;

    if (color.substr(0, 1) === '#') {
        return color;
    }
    digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/i.exec(color);

	red = parseInt(digits[2], 10);
	redHex = "";
	if (red <= 0 || red > 255) {
		redHex = "00";
	}
	green = parseInt(digits[3], 10);
	greenHex = "";
	if (redHex !== "" && (green <= 0 || green > 255)) {
		greenHex = "00";
	}
	blue = parseInt(digits[4], 10);
	blueHex = "";
	if (redHex !== "" && greenHex !== "" && (blue <= 0 || blue > 255)) {
		blueHex = "00";
	}
	completeHex = redHex + greenHex + blueHex;
	rgb = blue | (green << 8) | (red << 16);
	rgbHex = rgb.toString(16);
	if (completeHex.length === 6) {
		rgbHex = "";
	}
	if (rgbHex.length > 0 && rgbHex.length % 2 === 1) {
		rgbHex = "0" + rgbHex;
	}
	//console.log("completeHex: "+completeHex);console.log("rgbHex: "+rgbHex);
	return '#' + completeHex + rgbHex;
}
function hexColorWithoutHash(color) {
	"use strict";
	if (color.substr(0, 1) === '#') {
		return color.substr(1, color.length);
	}
	return color;
}
function checkStatus() {
	//request for YM
	jQuery.ajax({
		url: "php/client.php",
		dataType: "json"
	}).success(function (callResponse) {
		//console.log(callResponse);
		if (callResponse.start !== undefined && callResponse.start !== null) {
			//console.log("do start "+callResponse.start);
			TimerDom.hideSettings();
			TimeC.remoteStart(callResponse.start);
		} else if (callResponse.stop !== undefined && callResponse.stop !== null) {
			//console.log("do stop");
			TimerDom.showSettings();
			TimeC.stopCounter();
		}
	});
}

var checkStatusTime = 1000; //YM says 5-10 seconds
var checkStatusInterval = null;

jQuery(document).ready(function () {
	"use strict";
	TimerDom.attachEvents();

	//checkStatusInterval = setInterval(checkStatus, checkStatusTime);
});