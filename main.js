// userName = "sxc";
userName = prompt("Who dat?");
let sock = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + userName);
let sendButton = document.getElementById("sendButton");
let inputToSend = document.getElementById("inputToSend");
let messages = document.getElementById("messages");
let messagesWrapper = document.getElementById("messagesWrapper");
let listOfDiscussion = document.getElementById("listOfDiscussion");
let activeGroup = document.getElementById("actifGroupe");
let activeGroupId;
let lastAnswerFromServer;

messagesWrapper.scrollTop = messagesWrapper.scrollHeight;

// let alpha = [
// 	"a",
// 	"b",
// 	"c",
// 	"d",
// 	"e",
// 	"f",
// 	"g",
// 	"h",
// 	"i",
// 	"j",
// 	"k",
// 	"l",
// 	"m",
// 	"n",
// 	"o",
// 	"p",
// 	"q",
// 	"r",
// 	"s",
// 	"t",
// 	"u",
// 	"v",
// 	"w",
// 	"x",
// 	"y",
// 	"z"
// ];

// let nameToTry = "";
// for (let i = 0; i < alpha.length; i++) {
// 	setTimeout(() => {
// 		for (let j = 0; j < alpha.length; ++j) {
// 			setTimeout(() => {
// 				for (let k = 0; k < alpha.length; ++k) {
// 					setTimeout(() => {
// 						nameToTry = alpha[i] + alpha[j] + alpha[k];
// 						console.log(nameToTry);
// 						var sock = new WebSocket(
// 							"ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + nameToTry
// 						);
// 					}, i * 2000 + j * 2000 + k * 2000);
// 					sock.close();
// 				}
// 			}, i * 2000 + j * 2000);
// 		}
// 	}, i * 2000);
// }

var months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

sock.onmessage = function(event) {
	lastAnswerFromServer = JSON.parse(event.data);

	console.log(lastAnswerFromServer);
	

	switch (lastAnswerFromServer.eventType) {
		case "onMessage":
			onMessage(lastAnswerFromServer);
			break;
		case "onCreateChannel":
			break;
		// case "onJoinChannel":
		// 	break;
		// case "onLeaveChannel":
		// 	break;
		case "updateChannelsList":
			updateChannelsList(lastAnswerFromServer);
			break;
		case "onError":
			console.log(`onError: ${lastAnswerFromServer.data}`);
			break;
		case "onGetChannel":
			console.log(lastAnswerFromServer);
			for (let i = 0; i < lastAnswerFromServer.data.messages.length; ++i) {
				onMessage(lastAnswerFromServer.data.messages[i]);
			}
	}
};
function onMessage(answerFromServer) {
	if (answerFromServer.sender == userName) {
		messages.innerHTML +=
			'<div class="messageSend">\
			<div class="content">' +
			answerFromServer.data +
			'</div>\
			<div class="time">' +
			answerFromServer.timestamp +
			"</div>\
			</div>";
		inputToSend.value = "";
	} else {
		messages.innerHTML +=
			'<div class="messageReceived">\
			<div class="name">' +
			answerFromServer.sender +
			'</div>\
			<div class="content">' +
			answerFromServer.data +
			'</div>\
			<div class="time">' +
			answerFromServer.timestamp +
			"</div>\
			</div>";
	}

	messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}
function updateChannelsList(answerFromServer) {
	// when we remove 1st child, 2nd child becomes 1st... and the length decrease...
	let length = listOfDiscussion.children.length;
	for (let i = 1; i < length; ++i) {
		listOfDiscussion.children[1].remove();
	}
	// first time on chat, default channel is on General
	if (listOfDiscussion.children.length == 0) {
		updateGeneral(answerFromServer.data[0]);
		activeGroup.innerHTML = answerFromServer.data[0].name;
		activeGroupId = answerFromServer.data[0].id;
	}
	for (let i = 1; i < answerFromServer.data.length; ++i) {
		updateUserGroups(answerFromServer.data[i]);
	}
}
function updateGeneral(element) {
	let icon = '<i class="fas fa-star"></i>';
	let defaultTag = '<span id="defaultTag">défaut</span>';
	listOfDiscussion.innerHTML +=
		'<div class="chatGroup" id="' +
		element.id +
		'">' +
		icon +
		'<span class="groupName" onclick="changeActiveGroupFromGroupDiv(this.parentElement)">' +
		element.name +
		"</span>" +
		defaultTag +
		"</div>";
}
function updateUserGroups(element) {
	let icon;
	if (element.joinStatus == false) {
		icon = '<i class="fas fa-plus" onclick="joinChannel(this)"></i>';
	} else {
		icon = '<i class="fas fa-minus" onclick="leaveChannel(this)"></i>';
	}
	listOfDiscussion.innerHTML +=
		'<div class="chatGroup" id="' +
		element.id +
		'">' +
		icon +
		'<span class="groupName" onclick="changeActiveGroupFromGroupDiv(this.parentElement)">' +
		element.name +
		"</span></div>";
}
function onJoinChannel() {}

sendButton.addEventListener("click", sendInput);
inputToSend.addEventListener("keypress", function(e) {
	if (e.key === "Enter") {
		sendInput();
	}
});
function sendInput() {
	let message = new Message("onMessage", activeGroupId, inputToSend.value, userName, new Date());
	sock.send(JSON.stringify(message));
}

// Since we can leave a groupe which is not active... we need theses loops
function joinChannel(thisEl) {
	for (let i = 0; i < listOfDiscussion.children.length; ++i) {
		if (listOfDiscussion.children[i].children[1].innerText == thisEl.parentElement.children[1].innerText) {
			let message = new Message("onJoinChannel", listOfDiscussion.children[i].id, null, userName, new Date());
			sock.send(JSON.stringify(message));
			// activeGroup is on this new channel
			changeActiveGroupFromGroupDiv(listOfDiscussion.children[i]);
			break;
		}
	}
}
function leaveChannel(thisEl) {
	for (let i = 0; i < listOfDiscussion.children.length; ++i) {
		if (listOfDiscussion.children[i].children[1].innerText == thisEl.parentElement.children[1].innerText) {
			let message = new Message("onLeaveChannel", listOfDiscussion.children[i].id, null, userName, new Date());
			sock.send(JSON.stringify(message));
			// activeGroupId back to default channel which is General
			changeActiveGroupFromGroupDiv(listOfDiscussion.children[i]);
			break;
		}
	}
}

function changeActiveGroupFromGroupDiv(thisEl) {
	activeGroup.innerHTML = thisEl.innerHTML;
	activeGroupId = thisEl.id;
	let message = new Message("onGetChannel", activeGroupId, null, userName, new Date());
	sock.send(JSON.stringify(message));
	messages.innerHTML = "";
	console.log(thisEl.id);
}
