/**
 * Application JS file
 */

function colorToHex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    
    var red = parseInt(digits[2], 10);
	var redHex = "";
	if (red <= 0 || red>255) {
		redHex = "00";
	}
    var green = parseInt(digits[3], 10);
	var greenHex = "";
	if (redHex !== "" && (green <= 0 || green>255)) {
		greenHex = "00";
	}
    var blue = parseInt(digits[4], 10);
	var blueHex = "";
	if (redHex !== "" && greenHex !== "" && (blue <= 0 || blue>255)) {
		blueHex = "00";
	}
	completeHex = redHex + greenHex + blueHex;
    
    var rgb = blue | (green << 8) | (red << 16);
	var rgbHex = rgb.toString(16);
	if (completeHex.length === 6) {
		rgbHex = "";
	}
	if (rgbHex.length > 0 && rgbHex.length%2 === 1) {
		rgbHex = "0" + rgbHex;
	}
	//console.log("completeHex: "+completeHex);console.log("rgbHex: "+rgbHex);
    return '#' + completeHex + rgbHex;
};
function hexColorWithoutHash(color) {
    if (color.substr(0, 1) === '#') {
        return color.substr(1, color.length);
    }
	return color;
};
function checkStatus() {
	//request for YM
	jQuery.ajax({
		url: "php/client.php",
		dataType: "json"
	}).success(function(callResponse) {
		//console.log(callResponse);
		if (callResponse.start !== undefined && callResponse.start !== null) {
			//console.log("do start "+callResponse.start);
			TimerDom.hideSettings();
			TimeC.remoteStart(callResponse.start);
		}
		else if (callResponse.stop !== undefined && callResponse.stop !== null) {
			//console.log("do stop");
			TimerDom.showSettings();
			TimeC.stopCounter();
		}
	});
}

var checkStatusTime = 1000; //YM says 5-10 seconds
var checkStatusInterval = null;

jQuery(document).ready(function(){
	TimerDom.attachEvents();
	$('#textColor').ColorPicker({
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).ColorPickerHide();
			$('#textColor div').css('backgroundColor', '#' + hex);
			TimeC.setTextColor(hex);
			TimeC.setTimerTextColor(hex);
		},
		onBeforeShow: function () {
			var useColor = $('#textColor div').css('backgroundColor');
			$(this).ColorPickerSetColor(colorToHex(useColor));
		}
	});

	$('#backgroundColor').ColorPicker({
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).ColorPickerHide();
			$('#backgroundColor div').css('backgroundColor', '#' + hex);
			$('body').css('backgroundColor', '#' + hex);
		},
		onBeforeShow: function () {
			var useColor = $('#backgroundColor div').css('backgroundColor');
			$(this).ColorPickerSetColor(colorToHex(useColor));
		}
	});
	$("#switchColors").click(function(){
		var textColor = colorToHex($('#textColor div').css('backgroundColor'));
		var backgroundColor = colorToHex($('#backgroundColor div').css('backgroundColor'));
		
		$('#textColor div').css('backgroundColor', backgroundColor);
		TimeC.setTextColor(backgroundColor);
		TimeC.setTimerTextColor(backgroundColor);
		
		$('#backgroundColor div').css('backgroundColor', textColor);
		$('body').css('backgroundColor', textColor);
	});
	
	//checkStatusInterval = setInterval(checkStatus, checkStatusTime);
});