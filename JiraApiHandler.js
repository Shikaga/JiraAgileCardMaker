JiraApiHandler = function(jiraUrl) {
    this.jiraUrl = jiraUrl;
    this.jiraMap = {};
    
    this.requested = false;
    this.expectedCallbacks = 0;
    this.callbacksReceived = 0;
};

JiraApiHandler.prototype.get = function(jiraKey) {
    return this.jiraMap[jiraKey];
}

JiraApiHandler.prototype.requestJiras = function(jiraKeys, app) {
    if (!this.requested) {
        this.app = app;
        this.requested = true;
        this.requestAllJiras(jiraKeys);
    } else {
        throw "You can only requestJirasOnce";
    }
};

JiraApiHandler.prototype.requestAllJiras = function(jiras)
{
    this.expectedCallbacks = 0;
    this.callbacksReceived = 0;
    for (var i=0; i < jiras.length; i++)
    {
        this.expectedCallbacks++;
        var jira = jiras[i];
        this.requestJira(jira);
	}
}

JiraApiHandler.prototype.requestJira = function(jira) {
    selfJiraApiHandler = this;
    getJiraCallback = function(e) {
        selfJiraApiHandler.getJiraCallback(e);
    }
    var jiraUrl = this.jiraUrl + "/rest/api/latest/issue/" + jira + "?jsonp-callback=getJiraCallback";
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
}

JiraApiHandler.prototype.isParentLoaded = function(jira) {
    var parentId = jira.fields.parent;
    if (parentId) {
        var parentKey = jira.fields.parent.key;
        if (this.jiraMap[parentKey]) {
            return true;   
        } else {
            return false;
        }
    } else {
        return true;
    }
}

JiraApiHandler.prototype.parentsNotLoaded = function() {
    var parentsNotLoaded = [];
    for (index in this.jiraMap) {
        var jira = this.jiraMap[index];
        if (!this.isParentLoaded(jira)) {
            parentsNotLoaded.push(jira.fields.parent.key);
        }
    }
    return parentsNotLoaded
}

JiraApiHandler.prototype.getJiraCallback = function(e)
{
    this.callbacksReceived++;
    this.jiraMap[e.key] = e;
    if (this.callbacksReceived == this.expectedCallbacks) {
        this.renderCardsIfReady();
    }
}

JiraApiHandler.prototype.renderCardsIfReady = function() {
    var parentsNotLoaded = this.parentsNotLoaded();
    if (parentsNotLoaded.length == 0) {
        this.app.renderCards();
    } else {
        this.requestAllJiras(parentsNotLoaded);
    }
}