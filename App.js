jira.App = function(divId, fixVersion, color, qrcode, parentdescription)
{
	this.fixVersion = fixVersion;
	this.ticketId = 0;
	this.divId = divId;
	this.issueTypeColors = {
		"Bug": "#C00"
		,"Documentation": "#FFD600"
		,"Improvement": "#090"
		,"Story": "#909"
		,"Task": "#BFE4FF"
		,"Technical task": "#099"}
    this.issueTypeFontColors = {
        "Bug": "#FFF"
        ,"Documentation": "#FFF"
        ,"Improvement": "#FFF"
        ,"Story": "#FFF"
        ,"Task": "#000"
        ,"Technical task": "#FFF"
    }
	this.colorEnabled = color;
    this.qrcodeEnabled = qrcode;
    this.parentdescription = parentdescription;
    this.expectedCallbacks = 0;
    this.callbacksReceived = 0;
    this.jiraMap = {};
}

jira.App.prototype.x = function(jiras)
{
	this.requestAllJiras(jiras);
}

jira.App.prototype.requestAllJiras = function(jiras)
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

jira.App.prototype.requestJira = function(jira) {
    var jiraUrl = "https://jira.caplin.com/rest/api/latest/issue/" + jira + "?jsonp-callback=getJiraCallback";
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
}

jira.App.prototype.isParentLoaded = function(jira) {
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

jira.App.prototype.parentsNotLoaded = function() {
    var parentsNotLoaded = [];
    for (index in this.jiraMap) {
        var jira = this.jiraMap[index];
        if (!this.isParentLoaded(jira)) {
            parentsNotLoaded.push(jira.fields.parent.key);
        }
    }
    return parentsNotLoaded
}

jira.App.prototype.getJiraCallback = function(e)
{
    this.callbacksReceived++;
    this.jiraMap[e.key] = e;
    if (this.callbacksReceived == this.expectedCallbacks) {
        this.renderCardsIfReady();
    }
}

jira.App.prototype.renderCardsIfReady = function() {
    var parentsNotLoaded = this.parentsNotLoaded();
    if (parentsNotLoaded.length == 0) {
        this.renderCards();
    } else {
        this.requestAllJiras(parentsNotLoaded);
    }
}

jira.App.prototype.getParentKey = function(jira) {
    if (jira.fields.parent) {
        return jira.fields.parent.key;
    } else {
        return null;
    }
}

jira.App.prototype.getParentSummary = function(jira) {
    if (jira.fields.parent) {
        var parentKey = jira.fields.parent.key;
        if (this.parentdescription) {   
            return this.jiraMap[parentKey].fields.summary;
        } else {
            return null;
        }
    }  else {
        return null;
    }
}

jira.App.prototype.renderCards = function() {
    var cards = 0;
    for (index in this.jiraMap) {
        var jira = this.jiraMap[index];
        if (cards%6 == 0) {
            var pageElement = document.createElement("div");
    		pageElement.style.pageBreakBefore = "always";
    		pageElement.style.clear = "both";
    		document.getElementById("tickets").appendChild(pageElement);
    	}
    
        var parent = this.getParentKey(jira);
        var parentSummary = this.getParentSummary(jira);
		var jiraId = jira.key;
		var jiraEstimate = jira.fields["customfield_10243"];
		var jiraSummary = jira.fields.summary;
		var color = this.colorEnabled ? this.issueTypeColors[jira.fields.issuetype.name] : null;
		this.addTicket(this.divId,"jira.caplin.com/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, parent, parentSummary, color, pageElement, this.qrcodeEnabled);

        cards++;
    };
}

jira.App.prototype.addTicket = function(divId, url, title, estimate, summary, parent, parentSummary, color, pageElement, qrcodeEnabled)
{
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	pageElement.appendChild(titleElement);
	new jira.ticketviewer.ticketgenerator.Ticket(divId + "_ticket" + this.ticketId,url, title, estimate, summary, parent, parentSummary, color, qrcodeEnabled);	
}
