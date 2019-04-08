"use strict";

// ******************************DataBase***********************************
let Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
// ******************************DataBase***********************************

class Controller {
	constructor(connectionHandler) {
		this.connectionHandler_ = connectionHandler;
	}

	setControl() {
		sendButton.addEventListener("click", this.connectionHandler_.sendInput);
		inputToSend.addEventListener("keypress", function(e) {
			if (e.key === "Enter") {
				this.connectionHandler_.sendInput();
			}
		});
		thumbsUp.addEventListener("click", this.connectionHandler_.sendThumbsUp);

		createChannel.addEventListener("click", this.connectionHandler_.createChannel);

		user.addEventListener("click", this.connectionHandler_.newConnection);

		$("#logo")
			.children()
			.click(this.connectionHandler_.newConnection);

		//languages setup
		$("#translateButton").text("fr");
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

		sock.onmessage = event => {
			this.connectionHandler_.lastAnswerFromServer = JSON.parse(event.data);

			this.connectionHandler_.messagesObserver_.updateVue(this.connectionHandler_.lastAnswerFromServer);
			this.connectionHandler_.channelsObserver_.updateVue(this.connectionHandler_.lastAnswerFromServer);
		};
	}

	updateControl() {
		setTimeout(() => {
			$(".toTranslate").each(function() {
				$(this).text(languages[currentLanguage][$(this).attr("key")]);
			});
		}, 100);

		$(".channelName").css("cursor", "pointer");
		$(".channelName").bind("click", event => {
			if (event.target.attributes["status"].value == "false") {
				alert("You need to join this channel first !\nVous devez d'abord rejoindre ce groupe !");
			} else {
				channelsObserver.changeActiveChannel(event.target);
			}
		});

		$(".toLeave").bind("click", connectionHandler.leaveChannel);
		$(".toJoin").bind("click", connectionHandler.joinChannel);
	}
}

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

let audio = new Audio("get-outta-here.mp3");

let currentChannel;
let currentLanguage = "fr";

let userName;
let sock;

let messagesVue = new MessagesVue();
let channelsVue = new ChannelsVue();
let messagesObserver = new MessagesObserver(messagesVue);
let channelsObserver = new ChannelsObserver(messagesVue, channelsVue);
let connectionHandler = new ConnectionHandler(messagesObserver, channelsObserver);
let controller = new Controller(connectionHandler);

connectionHandler.newConnection();
controller.setControl();
