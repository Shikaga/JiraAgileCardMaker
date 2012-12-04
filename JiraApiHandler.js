JiraApiHandler = function (jiraUrl) {
	this.jiraUrl = jiraUrl;
	this.jiraMap = {};

	this.requested = false;
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;

	this.issueTypeColors = {
		"Bug": "#C00",
		"Documentation": "#FFD600",
		"Improvement": "#090",
		"Story": "#909",
		"Task": "#BFE4FF",
		"Technical task": "#099"
	};

	this.issueTypeFontColors = {
		"Bug": "#FFF",
		"Documentation": "#FFF",
		"Improvement": "#FFF",
		"Story": "#FFF",
		"Task": "#000",
		"Technical task": "#FFF"
	};
};

JiraApiHandler.prototype.get = function (jiraKey) {
	return this.jiraMap[jiraKey];
};

JiraApiHandler.prototype.requestJiras = function (jiraKeys, app) {
	if (!this.requested) {
		this.app = app;
		this.requested = true;
		this.requestAllJiras(jiraKeys);
	} else {
		throw "You can only requestJirasOnce";
	}
};

JiraApiHandler.prototype.requestAllJiras = function (jiras) {
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
	for (var i = 0; i < jiras.length; i++) {
		this.expectedCallbacks++;
		var jira = jiras[i];
		this.requestJira(jira);
	}
};

JiraApiHandler.prototype.requestJira = function (jira) {
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

JiraApiHandler.prototype.getJiraCallback = function (e) {
	this.callbacksReceived++;
	this.jiraMap[e.key] = this.getCard(e);
	if (this.callbacksReceived == this.expectedCallbacks) {
		this.renderCardsIfReady();
	}
};

JiraApiHandler.prototype.getCard = function (jira) {
	var card = new Card(jira.key);
	card.parentKey = jira.fields.parent ? jira.fields.parent.key : null;

	card.estimate = jira.fields["customfield_10243"];
	card.summary = jira.fields.summary;
	card.tag = jira.fields["customfield_10151"];
	card.issueType = jira.fields.issuetype.name;

	var components = jira.fields.components;
	if (components.length != 0) {
		var componentsString = "";
		for (var id in components) {
			componentsString += components[id].name + ",";
		}
		card.components = componentsString.substring(0, componentsString.length - 1) + ":";
	} else {
		card.components = "";
	}

	return card;
};

JiraApiHandler.prototype.renderCardsIfReady = function () {
	var parentsNotLoaded = this.parentsNotLoaded();
	if (parentsNotLoaded.length == 0) {
		this.app.renderCards();
	} else {
		this.requestAllJiras(parentsNotLoaded);
	}
};