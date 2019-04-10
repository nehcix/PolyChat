/**
 * @description main.js contains the declaration of the class Controller and all the variables will be used later in MVC.
 * @author Xi Chen Shen
 * @author Hakim Payman
 * @copyright Ecole Polytechnique de Montreal & Course LOG2420
 * @version 1.0.0
 */

"use strict";

// ******************************DataBase***********************************
/**
 * An array to translate numbers to Days(string).
 */
let Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * This object will be used for multi languages translation.
 */
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

/**
 * @description This objet is in the main scope, so by default it has asses to all variables declared in main.js, it contains the connectionHandler which contains channels ans messages observer.
 * @author Xi Chen Shen
 * @author Hakim Payman
 * @copyright Ecole Polytechnique de Montreal & Course LOG2420
 * @version 1.0.0
 */
class Controller {
	/**
	 * @param {object} connectionHandler The controller will update this global model in which contains two sub-models.
	 */
	constructor(connectionHandler) {
		this.connectionHandler_ = connectionHandler;
	}

	/**
	 * SetControl will add EventListener to Dom elements,
	 * This method will be call on the current objet(Controller), and will be execute only once in end of main.js to setup everything.
	 */
	setControl() {
		sendButton.addEventListener("click", this.connectionHandler_.sendInput);
		inputToSend.addEventListener("keypress", e => {
			if (e.key === "Enter") {
				e.preventDefault();
				this.connectionHandler_.sendInput();
			}
		});
		thumbsUp.addEventListener("click", this.connectionHandler_.sendThumbsUp);

		createChannel.addEventListener("click", this.connectionHandler_.createChannel);

		user.addEventListener("click", this.connectionHandler_.newConnection);

		/**
		 * A click on anyparts of logo will call the newConnection function.
		 */
		$("#logo")
			.children()
			.click(this.connectionHandler_.newConnection);

		/**
		 * The language is setted to french by default.
		 */
		$("#translateButton").text("fr");

		/**
		 * Once the translateButton is clicked, it's text will be changed (en->fr or fr->en) depending the current language,
		 * then every element of class .toTranslate will be translate by changing its text(innerHTML) to the corresponding element in languages objet declared in line 12 of main.js.
		 */
		$("#translateButton").click(() => {
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

		/**
		 * Adds the dropdown list element (Volume : icon) of default (volume on).
		 */
		let icon = document.createElement("i");
		icon.classList.add("fas");
		icon.classList.add("fa-volume-up");
		$("#soundControl").text("Volume : ");
		$("#soundControl").append(icon);

		/**
		 * Toggles between hiding and showing the dropdown list element.
		 */
		$("#globaleSettings").click(() => {
			let myDropdown = document.getElementById("myDropdown");
			myDropdown.classList.toggle("show");
		});

		/**
		 * Toggles between the mute icon and volume-up icon depending the if the volume is on.
		 */
		$("#soundControl").click(() => {
			audioIsON = !audioIsON;
			if (audioIsON) {
				let icon = document.createElement("i");
				icon.classList.add("fas");
				icon.classList.add("fa-volume-up");
				$("#soundControl").empty();
				$("#soundControl").text("Volume : ");
				$("#soundControl").append(icon);
			} else {
				let icon = document.createElement("i");
				icon.classList.add("fas");
				icon.classList.add("fa-volume-mute");
				$("#soundControl").empty();
				$("#soundControl").text("Volume : ");
				$("#soundControl").append(icon);
			}
		});

		/** Closes the dropdown menu if the user clicks outside of the icon. */
		window.onclick = event => {
			if (event.target.parentElement != null && !event.target.parentElement.matches("#globaleSettings")) {
				myDropdown.classList.remove("show");
			}
		};
	}

	/**
	 * This method will be execute everytime we update the Dom,
	 * since the Dom is changed, it may loses some EventListeners and css propoties that have been setup by setControl at the beginning.
	 */
	updateControl() {
		$(".channelName").css("cursor", "pointer");
		$(".channelName").bind("click", this.connectionHandler_.verificationBeforeChange.bind(this.connectionHandler_));
		$(".toLeave").bind("click", this.connectionHandler_.leaveChannel);
		$(".toJoin").bind("click", this.connectionHandler_.joinChannel);
	}
}

// Variables that will be used by MVC.
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

let audioIsON = true;
/**
 * The notification sound.
 */
let audio = new Audio("get-outta-here.mp3");

/**
 * This variable holds the span (.channelName) of the current channel.
 */
let currentChannel;
let currentLanguage = "fr";

let username;

/**
 * This variable holds the WebSocket created by newConnection().
 */
let sock;

/**
 * Objet view for messages.
 */
let messagesView = new MessagesView();

/**
 * Objet view for channels.
 */
let channelsView = new ChannelsView();

/**
 * Objet model for messages which will update messagesView.
 */
let messagesObserver = new MessagesObserver(messagesView);

/**
 * Objet model for channels which will update messagesView.
 */
let channelsObserver = new ChannelsObserver(channelsView);

/**
 * Objet global model which will tell messagesObserver and channelsObserver to update itself.
 */
let connectionHandler = new ConnectionHandler(messagesObserver, channelsObserver);

/**
 * Objet ontroller to update models.
 */
let controller = new Controller(connectionHandler);

connectionHandler.newConnection();
controller.setControl.call(controller);
