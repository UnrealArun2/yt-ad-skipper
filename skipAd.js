function body_callback(mutatedElements, observer) {
	console.log("body callback func");
	mutatedElements.forEach(mutation => {
		if (mutation.type == "childList") {
			topLevelAdElement = document.getElementsByClassName("video-ads")[0];
			if (topLevelAdElement == undefined) {
				console.log("topLevelAdElement still undefined");
				return;
			}
			console.log("Detected topLevelAdElement:")
			console.log(topLevelAdElement);	
			
			bodyObserver.disconnect();
			
			// check for a flag that it was not started in main thread
			topElementObserver.observe(topLevelAdElement, topElementoptions);
			console.log("started top element observer");
		}
	});
}

function button_callback(mutatedElements, observer) {
	console.log("button callback func");
	mutatedElements.forEach(mutation => {
		console.log(mutation);
		if (mutation.type == "attributes" && mutation.attributeName == "style") {
			if (mutation.oldValue !== "") {
				console.log("Skip AD button is in foreground");
				// var curr_attr_value = mutation.target.getAttribute("style");
				console.log("clicking:");
				console.log(mutation.target);
				var skipButton = mutation.target.getElementsByClassName("ytp-ad-skip-button ytp-button")[0];
				console.log(skipButton);
				skipButton.click();
			}
		}
	});
}

function callback(mutatedElements, observer) {
	console.log("top element callback func");
	mutatedElements.forEach(mutation => {
		if (mutation.type == "childList") {		
			if (mutation.target.childElementCount > 0) {
				var skipButtonElement = document.getElementsByClassName("ytp-ad-skip-button-slot")[0];
				if (skipButtonElement == undefined) {
					console.log("skipButtonElement undefined");
					return;
				}

				console.log("found skipButtonElement:");
				console.log(skipButtonElement);

				if (skipButtonElement.style.cssText !== "display: none;") {
					var skipButton = mutation.target.getElementsByClassName("ytp-ad-skip-button ytp-button")[0];
					console.log("clicking skip button:");
					console.log(skipButton);
					skipButton.click();
				} else {
					buttonObserver.observe(skipButtonElement, buttonOptions);
					console.log("started button observer");
				}
			}
		}
	});
}

/* We have 3 mutation observers.
* It was seen that the JS was not re-run when a video was played
* from the youtube homepage.
* This is why we have the following observers:
* 1. To observe the top level Advertisement HTML element "video-ads"
		so that we are sure that the AD is loaded/playing.
* 2. To observe and get a reference to the 'skip ads' HTML element
* 3. To observe when the 'skip ads' element is shown foreground on the page
* 		so that the auto skip is done only when the 'skip ads' is visible
*/
const bodyObserver = new MutationObserver(body_callback);
const bodyOptions = {
	childList: true,
	subTree: true
};

const topElementObserver = new MutationObserver(callback);
const topElementoptions = {
	childList: true,
	subTree: true
};

const buttonObserver = new MutationObserver(button_callback);
const buttonOptions = {
	attributes: true,
	attributeFilter: ["style"],
	attributeOldValue: true
};

var bodyElement = document.getElementsByTagName("body")[0];
console.log("body element found");

//<div class="video-ads ytp-ad-module" data-layer="4">
var topLevelAdElement = document.getElementsByClassName("video-ads")[0];

if (topLevelAdElement !== false) { // AD element already visible
	topElementObserver.observe(topLevelAdElement, topElementoptions);
	console.log("started top element observer");
} else {
	bodyObserver.observe(bodyElement, bodyOptions);
	console.log("started body element observer");
}
