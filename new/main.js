"use strict";

let Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ******************************multilanguages***********************************
let languages = {
	en: {
		ActifChannel: "Actif Channel :",
		ChannelList: "Channel List",
		AvailableChannels: "Available Channels",
		Send: "Send",
		Default: "default",
		Sunday: "SUN",
		Monday: "MON",
		Tuesday: "TUE",
		Wednesday: "WED",
		Thursday: "THU",
		Friday: "FRI",
		Saturday: "SAT",
	},
	fr: {
		ActifChannel: "Groupe Actif :",
		ChannelList: "Liste des groupes",
		AvailableChannels: "Groupes disponibles",
		Send: "Envoyer",
		Default: "défaut",
		Sunday: "Sunday",
		Monday: "LUN",
		Tuesday: "MAR",
		Wednesday: "MER",
		Thursday: "JEU",
		Friday: "VEN",
		Saturday: "SAM",
	},
};

let currentLanguage = "en";
$("#translateButton").text("fr");

$(".toTranslate").each(function() {
	$(this).text(languages[currentLanguage][$(this).attr("key")]);
});

$("#translateButton").click(function() {
	if (currentLanguage == "en") {
		currentLanguage = "fr";
		$("#translateButton").text("en");
	} else {
		currentLanguage = "en";
		$("#translateButton").text("fr");
	}

	$(".toTranslate").each(function() {
		$(this).text(languages[currentLanguage][$(this).attr("key")]);
	});
});
// ******************************multilanguages***********************************

function newConnection() {
	userName = prompt("Username (Nom d'utilisateur) : ");
	sock = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + userName);
	$("#currentUser").text(userName);
}

let userName;
let sock;
newConnection();

let audio = new Audio("get-outta-here.mp3");

let logo = document.getElementById("logo");
let user = document.getElementById("user");
let bell = document.getElementById("bell");
let navBarSecondLine = document.getElementById("navBarSecondLine");
let sendButton = document.getElementById("sendButton");
let thumbsUp = document.getElementById("thumbsUp");
let inputToSend = document.getElementById("inputToSend");
let messages = document.getElementById("messages");
let messagesWrapper = document.getElementById("messagesWrapper");
let listOfChannels = document.getElementById("listOfChannels");
let activeChannel = document.getElementById("actifChannel");
let createChannel = document.getElementById("createChannel");

let currentChannel;

let messagesVue = new MessagesVue();
let channelsVue = new ChannelsVue();
let messagesObserver = new MessagesObserver(messagesVue);
let channelsObserver = new ChannelsObserver(messagesVue, channelsVue);
let connectionHandler = new ConnectionHandler(messagesObserver, channelsObserver);

sendButton.addEventListener("click", connectionHandler.sendInput);
inputToSend.addEventListener("keypress", function(e) {
	if (e.key === "Enter") {
		connectionHandler.sendInput();
	}
});
thumbsUp.addEventListener("click", connectionHandler.sendThumbsUp);

createChannel.addEventListener("click", connectionHandler.createChannel);

user.addEventListener("click", newConnection);

$("#logo")
	.children()
	.click(newConnection);
