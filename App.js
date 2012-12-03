//This classes responsiblities:

//Class 1:
    //Creating the div for cards to be added to so they are on seperate pages

//Class 2:
    //Converting JSON data to card data

//Class 3:
    //Hodls the co lors for rendering task types

jira = function() {};
jira.App = function(jiraUrl, divId, fixVersion, color, qrcode, parentEnabled, componentEnabled, tagEnabled)
{
    this.jiraUrl = jiraUrl;
	this.fixVersion = fixVersion;
	this.ticketId = 0;
	this.divId = divId;
	this.colorEnabled = color;
    this.qrcodeEnabled = qrcode;
    this.parentdescriptionEnabled = parentEnabled;
    this.componentEnabled = componentEnabled;
    this.tagEnabled = tagEnabled;
    this.cardsAdded = 0;
};

jira.App.prototype.x = function(jiras)
{
    this.jiras = jiras;
    this.jah = new JiraApiHandler(this.jiraUrl);
    var self = this;
	this.jah.requestJiras(jiras, this);
};

jira.App.prototype.getParentSummary = function(jira) {
    return jira.parentKey ? this.jah.get(jira.parentKey).summary : null;
};

jira.App.prototype.renderCards = function() {
    for (var i=0; i < this.jiras.length; i++) {
        var jira = this.jah.get(this.jiras[i]);
        debugger;
        var jiraId = jira.key;
        var parentKey = jira.parentKey;
        var parentSummary = this.getParentSummary(jira);
        var component = this.componentEnabled ? jira.component : null;
        var tag = this.tagEnabled ? jira.tag : null;
		var jiraEstimate = jira.estimate;
		var jiraSummary = jira.summary;
		var color = this.colorEnabled ? jira.color : null;
        
        var card = new CardRenderer("jira.caplin.com/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, parentKey, parentSummary, component, tag, color, this.qrcodeEnabled);
        
		this.addTicket(this.divId, card);
    }
};

jira.App.prototype.addTicket = function(divId, card)
{
    var pageElement = this.getPageForNewCard();
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	pageElement.appendChild(titleElement);
		
    card.render(divId + "_ticket" + this.ticketId);
};

jira.App.prototype.getPageForNewCard = function() {
    if (this.cardsAdded%6 === 0) {
        pageElement = document.createElement("div");
        pageElement.style.pageBreakBefore = "always";
		pageElement.style.clear = "both";
		document.getElementById("tickets").appendChild(pageElement);
	}
    this.cardsAdded++;
    return pageElement;
};