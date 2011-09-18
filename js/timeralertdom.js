/**
 * Timer alert integration with DOM
 */
var TimerDom = (function () {
	"use strict";
	/*global jQuery: true, TimeC: true, colorToHex: true*/
	var ids = {},
		startTimer = null,
		stopTimer = null,
		showHideManagement = null,
		toggleClock = null,
		attachEvents = null,
		showClockName = "Show clock",
		hideClockName = "Hide clock",
		showSettingsName = "Show settings",
		hideSettingsName = "Hide settings";

	/**
	 * List of ids used for timer management
	 */
	ids = {
		hour: "time_hour",
		minute: "time_minutes",
		second: "time_seconds",
		start: "start_timer",
		stop: "stop_timer",
		displayClock: "displayClock",
		showHideManagement: "showHideManagement",
		management: "management"
	};
	/**
	 * Toggle show/hide settings
	 */
	function toggleSettings(toggleFlag) {
		var $settingsBlock = null,
			newValue = showSettingsName,
			currentDisplayStatus = "none";

		$settingsBlock = jQuery('#' + ids.management);

		if (toggleFlag === undefined || toggleFlag === null) {
			currentDisplayStatus = $settingsBlock.css("display");
			toggleFlag = false;
			if (currentDisplayStatus === "none") {
				toggleFlag = true;
			}
		}

		if (toggleFlag === true) {
			newValue = hideSettingsName;
		}
		$settingsBlock.toggle(toggleFlag);
		jQuery("#" + ids.showHideManagement).val(newValue);
	}
	/**
	 * Show settings block
	 */
	function showSettings() {
		jQuery("#" + ids.showHideManagement).val(showSettingsName);
		jQuery('#' + ids.management).toggle(true);
	}
	/**
	 * Hide settings block
	 */
	function hideSettings() {
		jQuery("#" + ids.showHideManagement).val(hideSettingsName);
		jQuery('#' + ids.management).toggle(false);
	}
	/**
	 * Start timer event
	 */
	startTimer = function () {
		jQuery("#" + ids.start).click(function () {
			TimeC.setData(jQuery("#" + ids.hour).val(), jQuery("#" + ids.minute).val(), jQuery("#" + ids.second).val());
			toggleSettings(false);
		});
	};
	/**
	 * Stop timer event
	 */
	stopTimer = function () {
		jQuery("#" + ids.stop).click(function () {
			TimeC.stopCounter();
		});
	};
	/**
	 * Show/hide event
	 */
	showHideManagement = function () {
		jQuery("#" + ids.showHideManagement).click(function () {
			toggleSettings();
		});
	};
	toggleClock = function () {
		jQuery("#" + ids.displayClock).click(function () {
			var $this = null,
				newValue = showClockName;
			$this = jQuery(this);
			if ($this.val() === showClockName) {
				newValue = hideClockName;
			}
			$this.val(newValue);
			TimeC.toggleClock();
		});
	};
	/**
	 * Set text color
	 */
	function textColor() {
		jQuery("#textColor").ColorPicker({
			onShow: function (colpkr) {
				jQuery(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				jQuery(colpkr).fadeOut(500);
				return false;
			},
			onSubmit: function (hsb, hex, rgb, el) {
				jQuery(el).ColorPickerHide();
				jQuery('#textColor div').css('backgroundColor', '#' + hex);
				TimeC.setTextColor(hex);
				TimeC.setTimerTextColor(hex);
			},
			onBeforeShow: function () {
				var useColor = jQuery('#textColor div').css('backgroundColor');
				jQuery(this).ColorPickerSetColor(colorToHex(useColor));
			}
		});
	}
	/**
	 * Set background color
	 */
	function backgroundColor() {
		jQuery('#backgroundColor').ColorPicker({
			onShow: function (colpkr) {
				jQuery(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				jQuery(colpkr).fadeOut(500);
				return false;
			},
			onSubmit: function (hsb, hex, rgb, el) {
				jQuery(el).ColorPickerHide();
				jQuery('#backgroundColor div').css('backgroundColor', '#' + hex);
				jQuery('body').css('backgroundColor', '#' + hex);
			},
			onBeforeShow: function () {
				var useColor = jQuery('#backgroundColor div').css('backgroundColor');
				jQuery(this).ColorPickerSetColor(colorToHex(useColor));
			}
		});
	}
	/**
	 * Switch colors
	 */
	function switchColors() {
		jQuery("#switchColors").click(function () {
			var textColor = colorToHex(jQuery('#textColor div').css('backgroundColor')),
				backgroundColor = colorToHex(jQuery('#backgroundColor div').css('backgroundColor'));

			jQuery('#textColor div').css('backgroundColor', backgroundColor);
			TimeC.setTextColor(backgroundColor);
			TimeC.setTimerTextColor(backgroundColor);

			jQuery('#backgroundColor div').css('backgroundColor', textColor);
			jQuery('body').css('backgroundColor', textColor);
		});
	}

	/**
	 * Attach events
	 */
	attachEvents = function () {
		startTimer();
		stopTimer();
		showHideManagement();
		toggleClock();
		textColor();
		backgroundColor();
		switchColors();
	};

	return {
		attachEvents: attachEvents,
		showSettings: showSettings,
		hideSettings: hideSettings
	};
}());