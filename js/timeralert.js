/**
 * Timer counter
 */
var TimeC = (function () {
	"use strict";
	/*global window: true, document: true, alert: true, console: true, clearInterval: true, setTimeout: true, setInterval: true*/
	
	/**
	 * Document GetElementById helper
	 */
	function id(elementId) {
		var el = document.getElementById(elementId);
		return el;
	}
	
	/**
	 * useText = true;//true for span, false use canvas
	 */
	var timerId = "timer",
		separatorText = ":",
		countHour = 0,
		countMin = 0,
		countSec = 4,
		fontSizeStep = 10,
		timerContainerWidth,
		minTimerContainerWidth = 300,
		timerContainerHeight,
		minTimerContainerHeight = 70,
		minFontSize,
		fontSize,
		textColor = "000000",
		cutFromWidth = 100,
		cutFromHeight = 120,
		fontWeight = "bold",
		fontFamily = '"Droid Sans Mono, sans-serif"',
		timerSeconds = 0,
		tempContainerId = "measureTextSpan",
		elClockId = "clock",
		alertActive = true,
		useText = true,
		timerInterval = null,
		clockInterval = null,
		elAudioAlarm = null,
		elTimer = null,
		elCanvasTimer = null,
		isClock = false,
		isTimer = false;
	
	timerContainerWidth = minTimerContainerWidth;
	timerContainerHeight = minTimerContainerHeight;

	fontSize = minFontSize = minTimerContainerHeight - fontSizeStep;
	//audio element
	elAudioAlarm = id("audioAlarm");
	/**
	 * Start alarm
	 */
	function startAlarm() {
		elAudioAlarm.style.display = "block";
		elAudioAlarm.currentTime = 0;
		try {
			elAudioAlarm.play();
			elAudioAlarm.addEventListener('ended', function () {
				this.currentTime = 0;
				this.pause();
				elAudioAlarm.play();
			}, false);
		} catch (err) {
			//Handle errors here
		}
	}
	/**
	 * Stop alarm
	 */
	function stopAlarm() {
		elAudioAlarm.style.display = "none";
		try {
			elAudioAlarm.pause();
		} catch (err) {
			//Handle errors here
		}
	}
	/**
	 * Set container text
	 */
	function setTimerText(timerTextEl, text) {
		if (timerTextEl !== undefined && timerTextEl !== null) {
			if (useText) {
				timerTextEl.innerHTML = text;
			} else {
				timerTextEl.clearRect(0, 0, timerContainerWidth, timerContainerHeight);
				timerTextEl.fillText(text, timerContainerWidth / 2, timerContainerHeight / 2);
			}
		}
	}
	/**
	 * Set font style
	 */
	function setFontStyle() {
		var fontStyleValue = fontWeight + " " + fontSize + "px " + fontFamily;
		if (useText) {
			elTimer.style.fontFamily = fontFamily;
			elTimer.style.fontSize = fontSize + "px";
			elTimer.style.fontWeight = fontWeight;
		} else {
			elCanvasTimer.font = fontStyleValue;
		}
	}
	/**
	 * Remove temporary element used for getting font size
	 */
	function removeTempMeasureElement() {
		var tempContainerEl = id(tempContainerId);
		if (tempContainerEl !== undefined && tempContainerEl !== null) {
			document.body.removeChild(tempContainerEl);
		}
	}
	/**
	 * Measure text
	 */
	function measureText(pText) {
		var tempContainerEl = null,
			textWidth = 0;
		
		tempContainerEl = id(tempContainerId);
		if (tempContainerEl === undefined || tempContainerEl === null) {
			tempContainerEl = document.createElement('span');
			tempContainerEl.id = tempContainerId;
			document.body.appendChild(tempContainerEl);
			tempContainerEl.style.position = "absolute";
			tempContainerEl.style.left = "-9999px";
			tempContainerEl.style.top = "-9999px";
			//tempContainerEl.style.width = "auto";
		}
		
		tempContainerEl.style.font = fontWeight + " " + fontSize + "px " + fontFamily;

		tempContainerEl.innerHTML = pText;
		textWidth = tempContainerEl.clientWidth;
		
		return textWidth;
	}
	/**
	 * Function to calculate font used based on text input
	 */
	function calculateFontSize(textInput) {
		var timerElText = null,
			textMeasure = null,
			textMeasureWidth = 0;
		
		timerElText = elTimer;
		setFontStyle();
		
		if (!useText) {
			timerElText = elCanvasTimer;
		}
		//timerElText
		setTimerText(timerElText, textInput);
		if (useText) {
			textMeasureWidth = measureText(textInput);
		} else {
			textMeasure = elCanvasTimer.measureText(textInput);
			textMeasureWidth = textMeasure.width;
		}
		//console.log("timerContainerWidth: "+timerContainerWidth);
		//console.log("textMeasureWidth: "+textMeasureWidth);
		//console.log("fontSize: "+fontSize);
		//console.log("minFontSize: "+minFontSize);
		//debugger;
		if (timerContainerWidth < textMeasureWidth) {
			fontSize = fontSize - fontSizeStep;
			if (fontSize > minFontSize) {
				calculateFontSize(textInput);
			} else {
				console.log("Problem determining font size");
			}
		} else {
			removeTempMeasureElement();
		}
	}
	/**
	 * Time to seconds convertor
	 */
	function timeToSeconds(hours, minutes, seconds) {
		var tempSec = 0;
		tempSec = seconds + minutes * 60 + hours * 60 * 60;
		return tempSec;
	}
	/**
	 * Add 0 as prefix is number is lower then 10
	 */
	function zeroFill(intVal) {
		if (intVal < 10) {
			intVal = "0" + intVal;
		}
		return intVal;
	}
	/**
	 * Seconds to time convertor
	 */
	function secondsToTime(nrSeconds) {
		var tempTime = "",
			tempHours = 0,
			tempTotalSeconds = 0,
			tempMinutes = 0,
			tempSeconds = 0;
		
		if (nrSeconds > 0) {
			tempHours = parseInt(nrSeconds / 3600, 10);
			tempTotalSeconds = nrSeconds - tempHours * 3600;
			tempMinutes = parseInt(tempTotalSeconds / 60, 10);
			tempSeconds = tempTotalSeconds - tempMinutes * 60;
			if (tempHours > 0) {
				tempTime = tempHours + separatorText;
			}
			
			tempTime = tempTime + zeroFill(tempMinutes) + separatorText + zeroFill(tempSeconds);
			
		} else {
			tempTime = "00" + separatorText + "00";
		}
		return tempTime;
	}
	/**
	 * Set text color (public function)
	 */
	function setTextColor(colorValue) {
		textColor = colorValue;
	}
	/**
	 * Apply text color
	 */
	function setTimerTextColor(hex) {
		//console.log("setTimerTextColor hex: "+hex);
		if (hex === undefined || hex === null) {
			hex = textColor;
		}
		
		if (hex.substr(0, 1) !== '#') {
			hex = "#" + hex;
		}
		
		//console.log(hex);
		elTimer.style.color = hex;
		if (!useText) {
			elCanvasTimer.fillStyle = hex;
		}
		setTimerText(elCanvasTimer, secondsToTime(timerSeconds));
	}
	/**
	 * Set text properties
	 */
	function setTimerTextPropr() {
		if (!useText) {
			elCanvasTimer.textAlign = "center";
			elCanvasTimer.textBaseline = "middle";
		}
	}
	/**
	 * Stop counter
	 */
	function stopCounter() {
		isTimer = false;
		if (timerInterval !== undefined && timerInterval !== null) {
			clearInterval(timerInterval);
		}
		stopAlarm();
	}
	/**
	 * Start alert
	 */
	function startAlert() {	
		if (alertActive) {
			startAlarm();
			alert("Time expired");
		}
	}
	function populateClock(firstCall) {
		var currentDate = null,
			timerElText = null,
			timerDisplay = "";
		
		firstCall = firstCall || false;
		
		currentDate = new Date();
		timerDisplay = currentDate.toLocaleTimeString();
		//console.log(timerDisplay);
		timerElText = elTimer;
		if (!useText) {
			timerElText = elCanvasTimer;
		}
		if (firstCall === true) {
			calculateFontSize(timerDisplay);
		}
		if (isClock === true) {
			setTimerText(timerElText, timerDisplay);
		}
	}
	
	function stopClock() {
		isClock = false;
		clearInterval(clockInterval);
	}
	/**
	 * Clock
	 */
	function clock() {
		if (isClock === true) {
			populateClock();
		} else {
			stopClock();
		}
	}
	/**
	 * Count down
	 */
	function countDown() {
		//console.log("countDown");
		var continueCount = true,
			timerDisplay = "",
			timerElText = null;
		
		timerDisplay = "00" + separatorText + "00";
		if (timerSeconds > 0) {
			timerSeconds = timerSeconds - 1;
			timerDisplay = secondsToTime(timerSeconds);
			
			if (timerSeconds === 0) {
				continueCount = false;
			}
		} else {
			continueCount = false;
		}
		
		//console.log(timerDisplay);
		timerElText = elTimer;
		if (!useText) {
			timerElText = elCanvasTimer;
		}
		if (isClock === false) {
			setTimerText(timerElText, timerDisplay);
		}
		if (continueCount === false) {
			stopCounter();
			setTimeout(function () {startAlert(); }, 1000);
		}
	}
	
	function filterValue(initialValue, defaultValue) {
		if (initialValue === undefined || initialValue === null) {
			initialValue = defaultValue;
		}
		
		return initialValue;
	}
	
	function preInit(useCanvas) {
		var elClock;
		
		useCanvas = useCanvas || false;
		useText = !useCanvas;
		
		elClock = id(elClockId);
		if (elClock !== undefined && elClock !== null) {
			elTimer = id(timerId);
			if (elTimer === undefined || elTimer === null) {
				if (useCanvas === true) {
					//create canvas element
					elTimer = document.createElement("CANVAS");
					elCanvasTimer = elTimer.getContext("2d");
				} else {
					//create span element
					elTimer = document.createElement("SPAN");
				}
				elTimer.setAttribute("id", timerId);
				elTimer.setAttribute("class", timerId);
				elTimer.innerHTML = "00:00";
				//insert timer element
				elClock.appendChild(elTimer);
			}
		}
	}
	
	function init(fromClock) {
		var displayWidth = 0,
			displayHeight = 0,
			timerDisplay = "";
		
		fromClock = fromClock || false;
		
		if (elTimer !== undefined && elTimer !== null) {
			
			displayWidth = window.innerWidth;
			displayHeight = window.innerHeight;
			//console.log("displayHeight: "+displayHeight);
			
			timerContainerWidth = displayWidth - cutFromWidth;
			timerContainerWidth = (minTimerContainerWidth > timerContainerWidth) ? minTimerContainerWidth : timerContainerWidth;
			timerContainerHeight = displayHeight - cutFromHeight;
			timerContainerHeight = (minTimerContainerHeight > timerContainerHeight) ? minTimerContainerHeight : timerContainerHeight;
			elTimer.style.width = timerContainerWidth + "px";
			elTimer.style.height = timerContainerHeight + "px";
			elTimer.style.lineHeight = timerContainerHeight + "px";
			elTimer.style.display = "block";
			if (!useText) {
				elTimer.width = timerContainerWidth;
				elTimer.height = timerContainerHeight;
			}
			fontSize = timerContainerHeight - fontSizeStep;
			
			setTimerTextColor(textColor);
			setTimerTextPropr();
			//setFontStyle();
			
			if (fromClock === true) {
				populateClock(true);
				clockInterval = setInterval(clock, 1000);
			} else {
				isTimer = true;
				if (isClock === false) {
					timerDisplay = secondsToTime(timerSeconds);
					calculateFontSize(timerDisplay);
				}
				timerInterval = setInterval(countDown, 1000);
			}
			
		}
	}
	/**
	 * Start count down - click in browser
	 */
	function browserStart() {
		stopCounter();
		timerSeconds = timeToSeconds(countHour, countMin, countSec);
		init();
	}
	/**
	 * Start count down - remote call
	 */
	function remoteStart(withTime) {
		stopCounter();
		/*var oDate = new Date().valueOf();
		oDate = parseInt(oDate/1000, 10);*/
		timerSeconds = withTime;
		init();
	}
	/**
	 * Set timer values and start count down
	 */
	function setData(iHour, iMin, iSec) {
		iHour = parseInt(filterValue(iHour, 0), 10);
		iMin = parseInt(filterValue(iMin, 0), 10);
		iSec = parseInt(filterValue(iSec, 0), 10);
		if (iHour < 0 || iHour > 24) {
			alert("Hour must be between 0 and 24");
		} else if (iMin < 0 || iMin > 59) {
			alert("Minutes must be between 0 and 59");
		} else if (iSec < 0 || iSec > 59) {
			alert("Seconds must be between 0 and 59");
		} else if (iHour === 0 && iMin === 0 && iSec === 0) {
			alert("Everything is 0");
		} else {
			countHour = iHour;
			countMin = iMin;
			countSec = iSec;
			browserStart();
		}
	}
	
	function toggleClock() {
		if (isClock === true) {
			stopClock();
			if (isTimer === false) {
				elTimer.style.display = "none";
			}
		} else {
			isClock = true;
			init(true);
		}
	}

	return {
		preInit: preInit,
		init: init,
		toggleClock: toggleClock,
		stopClock: stopClock,
		setData: setData,
		remoteStart: remoteStart,
		stopCounter: stopCounter,
		setTextColor: setTextColor,
		setTimerTextColor: setTimerTextColor
    };

}());

TimeC.preInit(false);