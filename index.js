$(document).ready(() => {
	//	console.log(alert("ready"));
	// Notification.requestPermission().then(function (permission) {
	// 	// If the user accepts, let's create a notification
	// 	if (permission === "granted") {
	// 		// var notification = new Notification("Hi !");
	// 	}
	// });
});
const POMODORO = "pb";
const SHORT = "sb";
const LONG = "lb";
let mode = POMODORO;

// below time in minutes
let pTimer = 25;
let sTimer = 5;
let lTimer = 15;
let timer = pTimer;
let isTimerOn = false;
let tick = null;

function pomodoro() {
	console.log("pomodoro");
	changeBackgroundTo(POMODORO);
	mode = POMODORO;
	timer = pTimer;
}

function shortBreak() {
	console.log("shortbreak");
	changeBackgroundTo(SHORT);
	mode = SHORT;
	timer = sTimer;
}

function longBreak() {
	console.log("longbreak");
	changeBackgroundTo(LONG);
	mode = LONG;
	timer = lTimer;
}

function changeBackgroundTo(color) {
	//$("body").css("background-color", color).delay(2000);
	$("body").removeClass(POMODORO);
	$("body").removeClass(SHORT);
	$("body").removeClass(LONG);

	switch (color) {
		case POMODORO:
			$("body").addClass(POMODORO);
			$("#min").text(pTimer);
			break;
		case SHORT:
			$("body").addClass(SHORT);
			$("#min").text(sTimer);
			break;
		case LONG:
			$("body").addClass(LONG);
			$("#min").text(lTimer);
			break;
		default:
			$("body").addClass(POMODORO);
			break;
	}
}

function startTimer() {
	isTimerOn = !isTimerOn;
	if (isTimerOn) {
		$("#btnStart").text("Stop");
		console.log(mode);
		let startTime = new Date().getTime();
		let duration = timer * 60 * 1000;
		let endTime = startTime + duration;
		let sec = 59;
		let min = 0;
		tick = setInterval(() => {
			let cur = new Date().getTime();
			let diff1 = endTime - cur;
			min = getMins(diff1);

			// sec
			if (sec == 0) {
				--sec;
				sec = 59;
			} else {
				--sec;
			}
			refreshTime(min, sec, diff1, duration);
		}, 1000);

		setTimeout(() => {
			console.log("clear");
			resetTimer();
			pomodoroCompleted();
		}, timer * 60 * 1000);
	} else {
		$("#btnStart").text("Start");
		resetTimer();
	}
}

function getMins(time) {
	time = Math.floor(time / (60 * 1000));
	return time;
}

function refreshTime(min, sec, diff, total) {
	if (min < 10) {
		min = `0${min}`;
	}
	if (sec < 10) {
		sec = `0${sec}`;
	}
	$("#min").text(min);
	$("#sec").text(sec);

	per = Math.round((diff / total) * 100);
	per = 100 - per;
	//console.log(per);
	$(".progress").css("width", `${per}%`);
	$("title").text(`Timer : ${min}:${sec}`);
}

function pomodoroCompleted() {
	let bell = document.getElementById("bell");
	playedPromise = bell.play();
	if (playedPromise) {
		playedPromise.catch((e) => {
			if (
				e.name === "NotAllowedError" ||
				e.name === "NotSupportedError"
			) {
				//console.log(e.name);
			}
		});
	}

	var notification = new Notification("Pomodoro Completed");
	setTimeout(() => {
		notification.close();
	}, 5000);
}

function resetTimer() {
	clearInterval(tick);
	refreshTime(timer, 00, 0, 100);
	$("title").text(`Pomodoro Timer`);
	$("#btnStart").text("Start");
	isTimerOn = false;
}

const permissionsToRequest = {
	permissions: ["bookmarks", "history"],
	origins: ["https://developer.mozilla.org/"],
};

function requestPermissions() {
	function onResponse(response) {
		if (response) {
			console.log("Permission was granted");
		} else {
			console.log("Permission was refused");
		}
		return browser.permissions.getAll();
	}

	window.Permissions.request(permissionsToRequest)
		.then(onResponse)
		.then((currentPermissions) => {
			console.log(`Current permissions:`, currentPermissions);
		});
}

// document
// 	.querySelector("#request")
// 	.addEventListener("click", requestPermissions);
