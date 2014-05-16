var JiraApiHandler = function(jiraUrl, listener) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    this.jiraApi = new JiraApi(jiraUrl, true, username, password);
	this.baseUrl = jiraUrl;
	this.listener = listener;
	this.jiraMap = {};

	this.requested = false;
	this.expectedCallbacks = 0;
	this.callbacksReceived = 0;
};

// Interface method - requestIssues passing in an array of issue ids.
JiraApiHandler.prototype.requestIssues = function(issueIds, callback) {
    //TODO: This will break if invoked twice quickly.
	if (!this.requested) {
        this.requestIssuesCallback = callback;
		this.requested = true;
		this.requestJiras(issueIds);
		this.chosenIssues = issueIds;
	} else {
		throw new Error("You can only request issues once.");
	}
};

JiraApiHandler.prototype.requestJiras = function(jiraIds) {
    jiraIds = _.uniq(jiraIds);
	this.expectedCallbacks = jiraIds.length;
	this.callbacksReceived = 0;
	this.requestJirasWithSQL(jiraIds, this.processCardsData.bind(this));
};

JiraApiHandler.getJirasRequestQuery = function(jiraIds) {
	if (jiraIds == null) return null;
	return jiraIds.map(λ("'key='+_")).join("+or+");
}


JiraApiHandler.prototype.isParentLoaded = function (card) {
	if (card.parentIssueId) {
		return this.jiraMap[card.parentIssueId] != null;
	} else {
		return true;
	}
};

JiraApiHandler.prototype.parentsNotLoaded = function () {
	var parentsNotLoaded = [];
	for (var index in this.jiraMap) {
		var card = this.jiraMap[index];
        if (!this.isParentLoaded(card)) {
            parentsNotLoaded.push(card.parentIssueId);
        }
        for (var i=0; i < card.subtasks.length; i++) {
            var subtaskId = card.subtasks[i];
            if (this.jiraMap[subtaskId] == null) {
                parentsNotLoaded.push(subtaskId);
                this.chosenIssues.push(subtaskId);
            }
        }
	}
	return parentsNotLoaded
};

JiraApiHandler.prototype.processCardsData = function(jiraData) {
	jiraData.issues.forEach(function(issue) {
		this.processCardData(issue);
	}.bind(this));
};

JiraApiHandler.prototype.processCardData = function(jiraData) {
this.callbacksReceived++;
	this.jiraMap[jiraData.key] = this.createCard(jiraData);
	if (this.callbacksReceived == this.expectedCallbacks) {
		this.renderCardsIfReady();
	}
};

JiraApiHandler.prototype.processJiraData = function(jiraData) {
	this.processCardData(jiraData);
};

JiraApiHandler.prototype.createCard = function (jira) {
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
        jira.fields["customfield_10870"],
		jira.fields.parent ? jira.fields.parent.key : null,
		jira.fields.priority ? jira.fields.priority.iconUrl : null,
        jira.fields.subtasks.map(function(_) {return _.key})
	);
	return card;
};

JiraApiHandler.prototype.renderCardsIfReady = function () {
	var parentsNotLoaded = this.parentsNotLoaded();
		this.requestJiras(parentsNotLoaded);
	if (parentsNotLoaded.length !== 0) {
	} else {
        this.requestIssuesCallback(this.chosenIssues, this.jiraMap);
	}
};

JiraApiHandler.prototype.getRapidBoardSprint = function(viewId, sprintId, callback) {
    this.jiraApi.getGreenhopperSprint(callback, viewId, sprintId);
}

JiraApiHandler.prototype.requestRapidSprints = function(sprintId, callback) {
	//https://jira.caplin.com/rest/greenhopper/latest/sprints/11
	jiraUrl = this.baseUrl + "/rest/greenhopper/latest/sprints/" + sprintId;

	if (document.getElementById('jiraOnDemand').checked) {
		//CJB. Modified to work around recent bug in RapidBoard API
		//https://github.com/Shikaga/JiraAgileCardMaker/issues/20
		//https://jira.caplin.com/rest/greenhopper/latest/sprintquery/11?includeFutureSprints=true&includeHistoricSprints=false
		jiraUrl = this.baseUrl + "/rest/greenhopper/latest/sprintquery/" + sprintId + "?includeFutureSprints=true&includeHistoricSprints=false";
	}

	this.jiraApi.jch.getData(callback, jiraUrl);
}

JiraApiHandler.prototype.requestRapidViews = function(callback) {
	//https://jira.caplin.com/rest/greenhopper/latest/rapidviews/list
	var jiraUrl = this.baseUrl + "/rest/greenhopper/latest/rapidviews/list";
	this.jiraApi.jch.getData(callback, jiraUrl);
}

JiraApiHandler.prototype.requestXBoard = function(rapidViewId, callback) {
	//https://jira.caplin.com/rest/greenhopper/1.0/xboard/plan/backlog/data.json?rapidViewId=43
	var jiraUrl = this.baseUrl + "/rest/greenhopper/1.0/xboard/plan/backlog/data.json?rapidViewId=" + rapidViewId;
	this.jiraApi.jch.getData(callback, jiraUrl);
}

JiraApiHandler.prototype.requestXBoards = function(callback) {
	//https://jira.caplin.com/rest/greenhopper/1.0/rapidviews/viewsData.json
	var jiraUrl = this.baseUrl + "/rest/greenhopper/1.0/rapidviews/viewsData.json";
	this.jiraApi.jch.getData(callback, jiraUrl);
}

JiraApiHandler.prototype.requestProjects = function(callback) {
	//https://jira.springsource.org/rest/api/latest/project
	var jiraUrl = this.baseUrl + "/rest/api/latest/project";
	this.jiraApi.jch.getData(callback, jiraUrl);
}

JiraApiHandler.prototype.requestFixVersions = function(project, callback) {
	//https://jira.springsource.org/rest/api/latest/project/BATCH/versions
	var jiraUrl = this.baseUrl + "/rest/api/latest/project/" + project + "/versions"
	this.jiraApi.jch.getData(callback, jiraUrl);
}

JiraApiHandler.prototype.requestFixVersion = function(project, fixversion, callback) {

    jiraUrl = this.baseUrl + "/rest/api/latest/search?jql=project=" + project + "%20AND%20fixversion=" + fixversion + "&fields=key&maxResults=1000";
    this.jiraApi.jch.getData(callback, jiraUrl);
};

JiraApiHandler.prototype.requestJirasWithSQL = function(jiraIds,callback) {
	if (jiraIds.length == 0) return;
	var jiraUrl = this.baseUrl + "/rest/api/latest/search?jql=" + JiraApiHandler.getJirasRequestQuery(jiraIds) + "&maxResults=1000";
	this.jiraApi.jch.getData(callback, jiraUrl);
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