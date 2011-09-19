var Cache = (function () {
	"use strict";
	/*global window: true, document: true, navigator: true, console: true, confirm: true, jQuery: true*/
	var obj,
		el = null;

	/**
	 * Set cache DOM element
	 */
	el = (function () {
		return document.getElementById("cache");
	}());
	/**
	 * Append cache log
	 */
	function appendContent(newContent) {
		el.innerHTML = el.innerHTML + "<br/>" + newContent;
	}
	/**
	 * Set cache log
	 */
	function setOfflineMessage() {
		var offlineEl = document.getElementById("offline");
		if (offlineEl) {
			offlineEl.innerHTML = "application is available offline";
		}
	}
	/**
	 * Handle exception for caching
	 */
	function handleCacheException(ex) {
		var newMessage = "";
		if (ex.code === 11) {
			newMessage = "Application Cache Error event: Resource fetch failed (404)";
		} else {
			newMessage = ex.message;
		}
		appendContent(newMessage);
	}
	/**
	 * Handle cache events
	 */
	function handleCacheEvent(e) {
		var eventType = e.type,
			newContent = "",
			availableOffline = true;

		if (eventType === "cached") {
			// Fired after the first cache of the manifest.
			newContent = "recources have been downloaded for the first time";
		} else if (eventType === "checking") {
			// Checking for an update. Always the first event fired in the sequence.
			newContent = "checking for updates";
		} else if (eventType === "downloading") {
			// An update was found. The browser is fetching resources.
			newContent = "fetching resources";
		} else if (eventType === "error") {
			// The manifest returns 404 or 410, the download failed,
			// or the manifest changed while the download was in progress.
			newContent = "download failed";
			availableOffline = false;
		} else if (eventType === "noupdate") {
			// Fired after the first download of the manifest.
			newContent = "cache is up to date";
		} else if (eventType === "obsolete") {
			// Fired if the manifest file returns a 404 or 410.
			// This results in the application cache being deleted.
			newContent = "cache manifest couldn't be found";
			availableOffline = false;
		} else if (eventType === "progress") {
			// Fired for each resource listed in the manifest as it is being fetched.
			newContent = "downloading resource " + e.originalEvent.loaded + " from " + e.originalEvent.total;
		} else if (eventType === "updateready") {
			// Fired when the manifest resources have been newly redownloaded.
			newContent = "resources have been newly redownloaded";
			obj.swapCache();
			if (confirm("A new version of this site is available. Load it?")) {
				window.location.reload();
			}
		}
		appendContent(newContent);
		if (availableOffline === true) {
			setOfflineMessage();
		}
	}
	/**
	 * Attach cache events
	 */
	function attachCacheEvents() {
		if (window.applicationCache) {
			//browser supports caching
			obj = window.applicationCache;
			jQuery(obj).bind("cached checking downloading error noupdate obsolete progress updateready", handleCacheEvent);
			/*try {
				obj.update();
			} catch(ex) {
				handleCacheException(ex);
			}*/
		} else {
			el.innerHTML = "Your browser doesn't support caching";
		}
	}
	/**
	 * Initialize caching
	 */
	function init() {
		if (el) {
			attachCacheEvents();
		}
	}

	return {
		init: init
	};
}());

Cache.init();