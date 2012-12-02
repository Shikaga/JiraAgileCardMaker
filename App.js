//This classes responsiblities:

//Class 1:
    //Creating the div for cards to be added to so they are on seperate pages

//Class 2:
    //Converting JSON data to card data

//Class 3:
    //Hodls the co lors for rendering task types

//Class 4:
    //Handles asynchronous callbacks for card data
    //Handles requesting parents to get their summaries

jira = function() {};
jira.App = function(jiraUrl, divId, fixVersion, color, qrcode, parentEnabled, componentEnabled, tagEnabled)
{
    this.jiraUrl = jiraUrl;
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
    this.parentdescriptionEnabled = parentEnabled;
    this.componentEnabled = componentEnabled;
    this.tagEnabled = tagEnabled;
    this.cardsAdded = 0;
}

jira.App.prototype.x = function(jiras)
{
    this.jiras = jiras;
    this.jah = new JiraApiHandler(this.jiraUrl);
    var self = this;
	this.jah.requestJiras(jiras, this);
}

jira.App.prototype.getParentKey = function(jira) {
    if (this.parentdescriptionEnabled) { 
        if (jira.fields.parent) {
            return jira.fields.parent.key;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

jira.App.prototype.getParentSummary = function(jira) {
    if (this.getParentKey(jira) != null) {
        var parentKey = jira.fields.parent.key;
        return this.jah.get(parentKey).fields.summary;
    } else {
        return null;
    }
}

jira.App.prototype.getTag = function(jira) {
    if (this.tagEnabled) {
        var tag = jira.fields["customfield_10151"];
        return tag;        
    } else {
        return null
    }
}

jira.App.prototype.getComponents = function(jira) {
    if (this.componentEnabled) {
        var components = jira.fields.components;
        if (components.length != 0) {
            var componentsString = "";
            for (id in components) {
                componentsString += components[id].name + ",";
            }
            return componentsString.substring(0, componentsString.length-1) + ":";
        } else {
            return null;
        }
    } else {
        return null;
    }
}

jira.App.prototype.renderCards = function() {
    for (var i=0; i < this.jiras.length; i++) {
        var jira = this.jah.get(this.jiras[i]);
        
        var parent = this.getParentKey(jira);
        var parentSummary = this.getParentSummary(jira);
        var component = this.getComponents(jira);
        var tag = this.getTag(jira);
		var jiraId = jira.key;
		var jiraEstimate = jira.fields["customfield_10243"];
		var jiraSummary = jira.fields.summary;
		var color = this.colorEnabled ? this.issueTypeColors[jira.fields.issuetype.name] : null;
        var card = new CardRenderer("jira.caplin.com/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, parent, parentSummary, component, tag, color, this.qrcodeEnabled);
        
		this.addTicket(this.divId, card);
    };
}

jira.App.prototype.addTicket = function(divId, card)
{
    var pageElement = this.getPageForNewCard();
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	pageElement.appendChild(titleElement);
		
    card.render(divId + "_ticket" + this.ticketId);
}

jira.App.prototype.getPageForNewCard = function() {
    if (this.cardsAdded%6 == 0) {
        pageElement = document.createElement("div");
        pageElement.style.pageBreakBefore = "always";
		pageElement.style.clear = "both";
		document.getElementById("tickets").appendChild(pageElement);
	}
    this.cardsAdded++;
    return pageElement;
}