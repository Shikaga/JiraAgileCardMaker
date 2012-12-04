//This classes responsiblities:

//Class 1:
//Creating the div for cards to be added to so they are on seperate pages

//Class 2:
//Converting JSON data to card data

var jira = {};

jira.App = function (element, jiraUrl, fixVersion, color, qrcode, parentEnabled, componentEnabled, tagEnabled) {
	this.jiraUrl = jiraUrl;
	this.element = element;
	this.ticketId = 0;
	this.colorEnabled = color;
	this.qrcodeEnabled = qrcode;
	this.parentdescriptionEnabled = parentEnabled;
	this.componentEnabled = componentEnabled;
	this.tagEnabled = tagEnabled;
	this.cardsAdded = 0;
	this.currentPage = null;
};

jira.App.prototype.x = function(jiras) {
	this.jiras = jiras;
	this.jah = new JiraApiHandler(this.jiraUrl);
	this.jah.requestJiras(jiras, this);
};

jira.App.prototype.getParentSummary = function (jira) {
	return jira.parentKey ? this.jah.get(jira.parentKey).summary : null;
};

jira.App.prototype.renderCards = function(issues, issueMap) {
	for (var i = 0; i < issues.length; i++) {
		var cardModel = issueMap[issues[i]];

		var jiraId = jira.key;
		var parentKey = jira.parentKey;
		var parentSummary = this.getParentSummary(jira);
		var component = this.componentEnabled ? jira.component : null;
		var tag = this.tagEnabled ? jira.tag : null;
		var jiraEstimate = jira.estimate;
		var jiraSummary = jira.summary;
		var issueType = this.colorEnabled ? jira.issueType : "";

		var cardView = new CardRenderer(
			cardModel,
			issueMap,
			this.componentEnabled,
			this.tagEnabled,
			this.colorEnabled,
			this.qrcodeEnabled
		);

		this.addTicket(cardView);
	}
};

jira.App.prototype.addTicket = function (card) {
	var pageElement = this.getPageForNewCard();
	this.ticketId++;
	pageElement.appendChild(card.getElement());
};

jira.App.prototype.getPageForNewCard = function () {
	if (this.currentPage == null || this.cardsAdded % 6 === 0) {
		this.currentPage = document.createElement("div");
		this.currentPage.className = "page";
		this.element.appendChild(this.currentPage);
	}
	this.cardsAdded++;
	return this.currentPage;
};