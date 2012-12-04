//This classes responsiblities:

//Class 1:
//Creating the div for cards to be added to so they are on seperate pages

//Class 2:
//Converting JSON data to card data

var jira = {};

jira.App = function (element, baseUrl, fixVersion, color, qrcode, parentEnabled, componentEnabled, tagEnabled) {
	this.baseUrl = baseUrl;
	this.element = element;
	this.colorEnabled = color;
	this.qrcodeEnabled = qrcode;
	this.parentDescriptionEnabled = parentEnabled;
	this.componentEnabled = componentEnabled;
	this.tagEnabled = tagEnabled;
	this.cardsAdded = 0;
	this.currentPage = null;
};

jira.App.prototype.requestIssues = function(selectedIssueIds) {
	this.selectedIssueIds = selectedIssueIds;

	this.issueRequester = new JiraApiHandler(this.baseUrl, this);
	this.issueRequester.requestIssues(selectedIssueIds);
};

jira.App.prototype.onIssuesAvailable = function(issueIds, issueMap) {
	for (var i = 0; i < issueIds.length; i++) {
		var cardModel = issueMap[issueIds[i]];

		var cardView = new CardView(
			cardModel,
			issueMap,
			this.parentDescriptionEnabled,
			this.componentEnabled,
			this.tagEnabled,
			this.colorEnabled,
			this.qrcodeEnabled
		);

		this.addTicket(cardView);
	}
};

jira.App.prototype.addTicket = function(card) {
	var pageElement = this.getPageForNewCard();
	pageElement.appendChild(card.getElement());
};

jira.App.prototype.getPageForNewCard = function() {
	if (this.currentPage == null || this.cardsAdded % 6 === 0) {
		this.currentPage = document.createElement("div");
		this.currentPage.className = "page";
		this.element.appendChild(this.currentPage);
	}
	this.cardsAdded++;
	return this.currentPage;
};