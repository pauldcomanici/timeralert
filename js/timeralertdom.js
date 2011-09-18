/**
 * Timer alert integration with DOM
 */
var TimerDom = (function () {
	"use strict";
	/*global jQuery: true, TimeC: true*/
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
	 * Attach events
	 */
	attachEvents = function () {
		startTimer();
		stopTimer();
		showHideManagement();
		toggleClock();
	};
	
	return {
		attachEvents: attachEvents,
		showSettings: showSettings,
		hideSettings: hideSettings
	};
}());