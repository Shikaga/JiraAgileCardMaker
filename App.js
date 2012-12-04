//This classes responsiblities:

//Class 1:
//Creating the div for cards to be added to so they are on seperate pages

//Class 2:
//Converting JSON data to card data

jira = function () {};

jira.App = function (jiraUrl, divId, fixVersion, color, qrcode, parentEnabled, componentEnabled, tagEnabled) {
	this.jiraUrl = jiraUrl;
	this.ticketId = 0;
	this.divId = divId;
	this.colorEnabled = color;
	this.qrcodeEnabled = qrcode;
	this.parentdescriptionEnabled = parentEnabled;
	this.componentEnabled = componentEnabled;
	this.tagEnabled = tagEnabled;
	this.cardsAdded = 0;
	this.currentPage = null;
};

jira.App.prototype.x = function (jiras) {
	this.jiras = jiras;
	this.jah = new JiraApiHandler(this.jiraUrl);
	this.jah.requestJiras(jiras, this);
};

jira.App.prototype.getParentSummary = function (jira) {
	return jira.parentKey ? this.jah.get(jira.parentKey).summary : null;
};

jira.App.prototype.renderCards = function () {
	for (var i = 0; i < this.jiras.length; i++) {
		var jira = this.jah.get(this.jiras[i]);
		var jiraId = jira.key;
		var parentKey = jira.parentKey;
		var parentSummary = this.getParentSummary(jira);
		var component = this.componentEnabled ? jira.component : null;
		var tag = this.tagEnabled ? jira.tag : null;
		var jiraEstimate = jira.estimate;
		var jiraSummary = jira.summary;
		var issueType = this.colorEnabled ? jira.issueType : "";

		var card = new CardRenderer(this.jiraUrl.replace(/https?:\/\//, "")+"/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, parentKey, parentSummary, component, tag, issueType, this.qrcodeEnabled);

		this.addTicket(this.divId, card);
	}
};

jira.App.prototype.addTicket = function (divId, card) {
	var pageElement = this.getPageForNewCard();
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	pageElement.appendChild(titleElement);

	card.render(divId + "_ticket" + this.ticketId);
};

jira.App.prototype.getPageForNewCard = function () {
	if (this.currentPage == null || this.cardsAdded % 6 === 0) {
		this.currentPage = document.createElement("div");
		this.currentPage.className = "page";
		document.getElementById("tickets").appendChild(this.currentPage);
	}
	this.cardsAdded++;
	return this.currentPage;
};