//This classes responsiblities:

//Class 1:
//Creating the div for cards to be added to so they are on seperate pages

//Class 2:
//Converting JSON data to card data

var jira = {};

jira.App = function (element, baseUrl, fixVersion, color, qrcode, parentEnabled, componentEnabled, tagEnabled, businessValue, epicsEnabled) {
	if (baseUrl == "") {
		alert("You need to set a valid Jira Location")
		return;
	}
	this.baseUrl = baseUrl;
	this.element = element;
	this.colorEnabled = color;
	this.qrcodeEnabled = qrcode;
	this.parentDescriptionEnabled = parentEnabled;
	this.componentEnabled = componentEnabled;
	this.tagEnabled = tagEnabled;
	this.businessValue = businessValue;
    this.epicsEnabled = epicsEnabled;
	this.cardsAdded = 0;
	this.currentPage = null;
    this.issueRequester = new JiraApiHandler(this.baseUrl, this);
};

jira.App.prototype.requestIssues = function(selectedIssueIds) {
	this.selectedIssueIds = selectedIssueIds;
	this.issueRequester.requestIssues(selectedIssueIds, function(issues, issueMap) {
        this.onIssuesAvailable(issues, issueMap);
    }.bind(this));
};

jira.App.prototype.onIssuesAvailable = function(issueIds, issueMap) {

	for (var i = 0; i < issueIds.length; i++) {
		var cardModel = issueMap[issueIds[i]];

		//TODO: May god have mercy on my soul
		if (cardModel.parentIssueId !== null) {
			if (issueMap[cardModel.parentIssueId].epic !== null) {
				cardModel.epic = issueMap[cardModel.parentIssueId].epic;
			}
		}

		var cardView = new CardView(
			cardModel,
			issueMap,
			["ACs", "PO Approval"],
			this.parentDescriptionEnabled,
			this.componentEnabled,
			this.tagEnabled,
			this.colorEnabled,
			this.qrcodeEnabled,
			this.businessValue,
            this.epicsEnabled
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