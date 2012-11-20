jira.App = function(divId, fixVersion, color, qrcode, parentdescription)
{
	this.fixVersion = fixVersion;
	this.ticketId = 0;
	this.divId = divId;
	this.totalTickets = 0;
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
    for (var i=0; i < jiras.length; i++)
    {
        this.expectedCallbacks++;
        var jira = jiras[i];
		var jiraUrl = "https://jira.caplin.com/rest/api/latest/issue/" + jira + "?jsonp-callback=getJiraCallback";
		var scriptElement = document.createElement("script");
		scriptElement.setAttribute("type", "text/javascript");
		scriptElement.setAttribute("src", jiraUrl);
		document.head.appendChild(scriptElement);
	}
}

jira.App.prototype.matchFixVersion = function(e)
{
	var matchesFixVersion = false;
	var fixVersions = e.fields.fixVersions;
	for (var version in fixVersions)
	{
		if (fixVersions[version].id == this.fixVersion) matchesFixVersion = true;
	}
	return matchesFixVersion;
}

jira.App.prototype.getJiraCallback = function(e)
{
    this.callbacksReceived++;
    this.jiraMap[e.key] = e;
    if (this.callbacksReceived == this.expectedCallbacks) {
        this.renderCards();
    }
}

jira.App.prototype.renderCards = function() {
    var cards = 0;
    console.log(this.jiraMap);
    for (index in this.jiraMap) {
        var e = this.jiraMap[index];
        if (cards%2 == 0) {
        	var pageElement = document.createElement("div");
    		pageElement.style.pageBreakAfter = "always";
    		pageElement.style.clear = "both";
    		document.getElementById("tickets").appendChild(pageElement);
    	}
    	if (this.matchFixVersion(e)) {
    		this.totalTickets++;
            var parent = null;
            var parentSummary = null;
            if (e.fields.parent) {
                var parent = e.fields.parent.key;
                var parentSummary = this.jiraMap[parent].fields.summary;
                console.log(parentSummary);
            }
            
    		var jiraId = e.key;
    		var jiraEstimate = e.fields["customfield_10243"];
    		var jiraSummary = e.fields.summary;
    		var color = this.colorEnabled ? this.issueTypeColors[e.fields.issuetype.name] : null;
    		this.addTicket(this.divId,"jira.caplin.com/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, parent, parentSummary, color, pageElement, this.qrcodeEnabled);
    	}
        cards++;
    };
}

jira.App.prototype.addTicket = function(divId, url, title, estimate, summary, parent, parentSummary, color, pageElement, qrcodeEnabled)
{
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	pageElement.appendChild(titleElement);
	new jira.ticketviewer.ticketgenerator.TicketGenerator(divId + "_ticket" + this.ticketId,url, title, estimate, summary, parent, parentSummary, color, qrcodeEnabled);	
}
