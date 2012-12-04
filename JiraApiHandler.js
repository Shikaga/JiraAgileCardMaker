var JiraApiHandler = function(jiraUrl, listener) {
	this.baseUrl = jiraUrl;
	this.listener = listener;
	this.jiraMap = {};

	this.requested = false;
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
};

// Interface method - requestIssues passing in an array of issue ids.
JiraApiHandler.prototype.requestIssues = function(issueIds) {
	if (!this.requested) {
		this.requested = true;
		this.requestJiras(issueIds);
		this.chosenIssues = issueIds;
	} else {
		throw new Error("You can only request issues once.");
	}
};

JiraApiHandler.prototype.requestJiras = function(jiraIds) {
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
	for (var i = 0; i < jiraIds.length; i++) {
		this.expectedCallbacks++;
		this.requestJira(jiraIds[i]);
	}
};

JiraApiHandler.prototype.requestJira = function(jiraId) {
	var callbackName = "_jiraProcessData_";
	while (window[callbackName]) {
		callbackName += "X";
	}

	window[callbackName] = function(jiraData) {
		this.processJiraData(jiraData);
		delete window[callbackName];
	}.bind(this);

	var jiraUrl = this.baseUrl + "/rest/api/latest/issue/" + jiraId + "?jsonp-callback="+callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
};

JiraApiHandler.prototype.isParentLoaded = function (card) {
	if (card.parentKey) {
		return this.jiraMap[card.parentKey] != null;
	} else {
		return true;
	}
};

JiraApiHandler.prototype.parentsNotLoaded = function () {
	var parentsNotLoaded = [];
	for (var index in this.jiraMap) {
		var card = this.jiraMap[index];
		if (!this.isParentLoaded(card)) {
			parentsNotLoaded.push(card.parentKey);
		}
	}
	return parentsNotLoaded
};

JiraApiHandler.prototype.processJiraData = function(jiraData) {
	this.callbacksReceived++;
	this.jiraMap[jiraData.key] = this.getCard(jiraData);
	if (this.callbacksReceived == this.expectedCallbacks) {
		this.renderCardsIfReady();
	}
};

JiraApiHandler.prototype.getCard = function (jira) {
	var componentString = "";
	var components = jira.fields.components;
	if (components.length != 0) {
		var componentsString = "";
		for (var id in components) {
			componentsString += components[id].name + ",";
		}
		componentString = componentsString.substring(0, componentsString.length - 1) + ":";
	}

	var card = new Card(jira.key,
		this.baseUrl + "/browse/" + jira.key,
		jira.fields.issuetype.name,
		jira.fields["customfield_10243"],
		jira.fields.summary,
		componentString,
		jira.fields["customfield_10151"],
		jira.fields.parent ? jira.fields.parent.key : null
	);
	return card;
};

JiraApiHandler.prototype.renderCardsIfReady = function () {
	var parentsNotLoaded = this.parentsNotLoaded();
		this.requestJiras(parentsNotLoaded);
	if (parentsNotLoaded.length !== 0) {
	} else {
		this.listener.onIssuesAvailable(this.chosenIssues, this.jiraMap);
	}
};