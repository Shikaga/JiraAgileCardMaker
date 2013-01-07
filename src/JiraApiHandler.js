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

JiraApiHandler.prototype.requestRapidBoard = function(sprintId) {

//https://jira.caplin.com/rest/greenhopper/latest/sprint/10/issues
	var callbackName = this.getCallbackName();
	//https://jira.caplin.com/rest/greenhopper/latest/sprints/11
	jiraUrl = this.baseUrl + "/rest/greenhopper/latest/sprints/" + sprintId + "?jsonp-callback=" + callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
}

JiraApiHandler.prototype.requestFixVersion = function(project, fixversion) {
	var callbackName = this.getCallbackName();
	if (project != "" && fixversion != "") {
			jiraUrl = this.baseUrl + "/rest/api/latest/search?jql=project=" + project + "%20AND%20fixversion=" + fixversion + "&fields=key&jsonp-callback=" + callbackName + "&maxResults=1000";

			var scriptElement = document.createElement("script");
			scriptElement.setAttribute("type", "text/javascript");
			scriptElement.setAttribute("src", jiraUrl);
			document.head.appendChild(scriptElement);
			jiraRequestedTimeout = setTimeout(function () {
				alert("The Jira's have not loaded after 2 seconds. Are you sure you are logged in?");
			}, 2000);
		} else {
			alert("You have not set the Project Name or Fix Version");
		}
};

JiraApiHandler.prototype.getCallbackName = function() {
	var callbackName = "_jiraProcessData_";
	while (window[callbackName]) {
		callbackName += "X";
	}
	window[callbackName] = function(jiraData) {
		this.processJiraData(jiraData);
		delete window[callbackName];
	}.bind(this);
	return callbackName
}

JiraApiHandler.prototype.requestJira = function(jiraId) {
	var callbackName = this.getCallbackName();
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

JiraApiHandler.prototype.processCardsData = function(jiraData) {
	var jiraKeys = [];
	for (var i=0; i < jiraData.issues.length; i++) {
		jiraKeys.push(jiraData.issues[i].key);
	}
	this.listener.receiveJiraCallback(jiraKeys);
};

JiraApiHandler.prototype.processRapidBoardSprints = function(jiraData) {
	var callbackName = this.getCallbackName();
	var sprintId = RapidBoardHandler.getOpenSprintFromJSON(jiraData)[0];
	jiraUrl = this.baseUrl + "/rest/greenhopper/latest/sprint/" + sprintId + "/issues?jsonp-callback=" + callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
};

JiraApiHandler.prototype.processRapidBoardSprint = function(jiraData) {
	var issues = RapidBoardHandler.getJirasFromJSON(jiraData);
	this.listener.receiveJiraCallback(issues);
}

JiraApiHandler.prototype.processCardData = function(jiraData) {
this.callbacksReceived++;
	this.jiraMap[jiraData.key] = this.getCard(jiraData);
	if (this.callbacksReceived == this.expectedCallbacks) {
		this.renderCardsIfReady();
	}
};

JiraApiHandler.prototype.processJiraData = function(jiraData) {
	if (jiraData.sprints != null) {
		this.processRapidBoardSprints(jiraData);
	} else if (jiraData.contents != null) {
		this.processRapidBoardSprint(jiraData);
	} else {
		if (jiraData.issues != null) {
			this.processCardsData(jiraData);
		} else {
			this.processCardData(jiraData);
		}
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
		jira.fields["customfield_10261"],
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