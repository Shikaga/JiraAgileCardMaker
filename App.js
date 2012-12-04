jira.App = function (jiraUrl, qrcode, parentEnabled, componentEnabled, tagEnabled) {
	this.jiraUrl = jiraUrl;
	this.ticketId = 0;
	this.qrcodeEnabled = qrcode;
	this.parentdescriptionEnabled = parentEnabled;
	this.componentEnabled = componentEnabled;
	this.tagEnabled = tagEnabled;
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
	this.jiraMap = {};
};

jira.App.prototype.x = function (jiras) {
	this.requestAllJiras(jiras);
};

jira.App.prototype.requestAllJiras = function (jiras) {
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
	for (var i = 0; i < jiras.length; i++) {
		this.expectedCallbacks++;
		var jira = jiras[i];
		this.requestJira(jira);
	}
};

jira.App.prototype.requestJira = function (jira) {
	var jiraUrl = this.jiraUrl + "/rest/api/latest/issue/" + jira + "?jsonp-callback=getJiraCallback";
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
};

jira.App.prototype.isParentLoaded = function (jira) {
	var parentId = jira.fields.parent;
	if (parentId) {
		var parentKey = jira.fields.parent.key;
		return this.jiraMap[parentKey] != null;
	} else {
		return true;
	}
};

jira.App.prototype.parentsNotLoaded = function () {
	var parentsNotLoaded = [];
	for (index in this.jiraMap) {
		var jira = this.jiraMap[index];
		if (!this.isParentLoaded(jira)) {
			parentsNotLoaded.push(jira.fields.parent.key);
		}
	}
	return parentsNotLoaded
};

jira.App.prototype.getJiraCallback = function (e) {
	this.callbacksReceived++;
	this.jiraMap[e.key] = e;
	if (this.callbacksReceived == this.expectedCallbacks) {
		this.renderCardsIfReady();
	}
};

jira.App.prototype.renderCardsIfReady = function () {
	var parentsNotLoaded = this.parentsNotLoaded();
	if (parentsNotLoaded.length == 0) {
		this.renderCards();
	} else {
		this.requestAllJiras(parentsNotLoaded);
	}
};

jira.App.prototype.getParentKey = function (jira) {
	if (this.parentdescriptionEnabled) {
		if (jira.fields.parent) {
			return jira.fields.parent.key;
		} else {
			return null;
		}
	} else {
		return null;
	}
};

jira.App.prototype.getParentSummary = function (jira) {
	if (this.getParentKey(jira) != null) {
		var parentKey = jira.fields.parent.key;
		return this.jiraMap[parentKey].fields.summary;
	} else {
		return null;
	}
};

jira.App.prototype.getTag = function (jira) {
	if (this.tagEnabled) {
		return jira.fields["customfield_10151"];
	} else {
		return null
	}
};

jira.App.prototype.getComponents = function (jira) {
	if (this.componentEnabled) {
		var components = jira.fields.components;
		if (components.length != 0) {
			var componentsString = "";
			for (id in components) {
				componentsString += components[id].name + ",";
			}
			return componentsString.substring(0, componentsString.length - 1) + ":";
		} else {
			return null;
		}
	} else {
		return null;
	}
};

jira.App.prototype.renderCards = function () {
	var cards = 0;
	for (index in this.jiraMap) {
		var jira = this.jiraMap[index];
		if (cards % 6 == 0) {
			var pageElement = document.createElement("div");
			pageElement.className = 'page';
			document.getElementById("tickets").appendChild(pageElement);
		}

		var parent = this.getParentKey(jira);
		var parentSummary = this.getParentSummary(jira);
		var component = this.getComponents(jira);
		var tag = this.getTag(jira);
		var jiraId = jira.key;
		var jiraEstimate = jira.fields["customfield_10243"];
		var jiraSummary = jira.fields.summary;
		this.addTicket(this.jiraUrl.replace(/https?:\/\//, "")+"/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, parent, parentSummary, component, tag, jira.fields.issuetype.name, pageElement, this.qrcodeEnabled);

		cards++;
	}
};

jira.App.prototype.addTicket = function (url, title, estimate, summary, parent, parentSummary, component, tag, issueType, pageElement, qrcodeEnabled) {
	this.ticketId++;
	var titleElement = document.createElement("div");
	pageElement.appendChild(titleElement);
	return new jira.ticketviewer.ticketgenerator.Ticket(titleElement, url, title, estimate, summary, parent, parentSummary, component, tag, issueType, qrcodeEnabled);
};
