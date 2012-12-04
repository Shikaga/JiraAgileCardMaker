JiraApiHandler = function (jiraUrl) {
	this.jiraUrl = jiraUrl;
	this.jiraMap = {};

	this.requested = false;
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
};

JiraApiHandler.prototype.get = function(jiraKey) {
	return this.jiraMap[jiraKey];
};

JiraApiHandler.prototype.requestJiras = function(jiraKeys, app) {
	if (!this.requested) {
		this.app = app;
		this.requested = true;
		this.requestAllJiras(jiraKeys);
		this.chosenIssues = jiraKeys;
	} else {
		throw new Error("You can only requestJirasOnce");
	}
};

JiraApiHandler.prototype.requestAllJiras = function(jiras) {
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
	for (var i = 0; i < jiras.length; i++) {
		this.expectedCallbacks++;
		var jira = jiras[i];
		this.requestJira(jira);
	}
};

JiraApiHandler.prototype.requestJira = function(jira) {
	var selfJiraApiHandler = this;
	getJiraCallback = function (e) {
		selfJiraApiHandler.getJiraCallback(e);
	};
	var jiraUrl = this.jiraUrl + "/rest/api/latest/issue/" + jira + "?jsonp-callback=getJiraCallback";
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

JiraApiHandler.prototype.getJiraCallback = function(jiraData) {
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
		this.jiraUrl + "/browse/" + jira.key,
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
		this.requestAllJiras(parentsNotLoaded);
	if (parentsNotLoaded.length !== 0) {
	} else {
		this.app.renderCards(this.chosenIssues, this.jiraMap);
	}
};