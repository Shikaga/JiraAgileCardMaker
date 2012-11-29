var jira = function() {};
jira.ticketviewer = function() {};
jira.ticketviewer.ticketgenerator = function() {};

jira.ticketviewer.ExampleClass = function(divId, url)
{
	document.getElementById(divId).innerHTML = '<img style="margin-top: 10px;" width="50px" height="50px" src="http://qr.kaywa.com/?s=8&d=http%3A%2F%2F'+url + '" alt="QRCode"/>';
}

jira.ticketviewer.ticketgenerator.Ticket = function(divId, url, jira, estimate, summary, parent, parentSummary, color, qrcode)
{
    this.qrcode = qrcode;
	this.divId = divId + "" + jira
	this.element = document.getElementById(divId);
	this.setWidth(350);
	this.setHeight();
	this.addDefaultBorder();
	
	this.addTitle(jira,estimate, parent, color);
	this.addSideBar();
	this.addSummary(summary, parentSummary);
    if (this.qrcode) {
    	this.addQRCode(url);
    }
};

jira.ticketviewer.ticketgenerator.Ticket.prototype.setWidth = function(width)
{
	this.element.style.margin = "auto";
	this.element.style.float = "left";
	this.element.style.width = width + "px";
	this.element.style.position = "relative";
	this.element.style.marginLeft = 20 + "px";

};

jira.ticketviewer.ticketgenerator.Ticket.prototype.setHeight = function()
{
	this.element.style.height = 300 + "px";
	this.element.style.marginTop = 20 + "px";
};

jira.ticketviewer.ticketgenerator.Ticket.prototype.addDefaultBorder = function(width)
{
	this.element.style.border = "2px solid black"
};

jira.ticketviewer.ticketgenerator.Ticket.prototype.addTitle = function(jira, estimate, parent, color)
{
    var summary = jira;
    if (parent !== null && parent !== undefined)
        summary = parent + "\n" + jira
	var jiraElement = this.createTitleElement(this.divId + "_jira", summary || "Jira", "35%");
	var estimateElement = this.createTitleElement(this.divId + "_estimate", estimate || "Estimate", "15%");
	var actualElement = this.createTitleElement(this.divId + "_actual", "Actual", "15%");
	var ownerElement = this.createTitleElement(this.divId + "_owner", "Owner", "35%");

	var titleElement = document.createElement("div");
	titleElement.style.height = "50px";
	
    if (color !== null) {    
        jiraElement.style.backgroundColor = color;
        jiraElement.style.color = "white";
    }
	jiraElement.style["-webkit-print-color-adjust"] = "exact";
	jiraElement.style.fontSize = "80%";
	jiraElement.style.fontWeight = "Bolder";
    jiraElement.style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";


	titleElement.appendChild(jiraElement);
	titleElement.appendChild(estimateElement);
	titleElement.appendChild(actualElement);
	titleElement.appendChild(ownerElement);

	this.element.appendChild(titleElement);
};

jira.ticketviewer.ticketgenerator.Ticket.prototype.addSummary = function(summary, parentSummary)
{
	var sideElement = document.createElement("div");
	sideElement.style.marginRight = "70px";
	sideElement.style.padding = "1em";
	sideElement.style.fontSize= "23px";
    
    sideElement.style.overflow="hidden";
    sideElement.style.lineHeight="23px";
    sideElement.style.height = "200px";
    
    
    if (parentSummary != undefined && parentSummary != null) {
        summary = "<strong>" + parentSummary + "</strong><br /><br />" + summary;
    }
	sideElement.innerHTML = summary;

	this.element.appendChild(sideElement);
};

jira.ticketviewer.ticketgenerator.Ticket.prototype.addSideBar = function()
{
	var sideElement = document.createElement("div");
	sideElement.style.textAlign = "center";
	sideElement.style.width = "70px";
	sideElement.style.height = "248px";
	sideElement.style.clear = "both";
	sideElement.style.position = "absolute";
	sideElement.style.top = "52px";
	sideElement.style.bottom = "0";
	sideElement.style.right = "0";
	sideElement.style.outline = "2px solid black";
	sideElement.setAttribute("id", "sidebar");

	var docElement = this.createTitleElement(this.divId + "_doc", "Doc", "100%", 60);
	var demoElement = this.createTitleElement(this.divId + "_demo", "Demo", "100%", 60);
	var reviewElement = this.createTitleElement(this.divId + "_review", "Review", "100%", 60);
	var qrcodeElement = this.createTitleElement(this.divId + "_qrcode", "QRCode", "100%", 68);

	sideElement.appendChild(docElement);
	sideElement.appendChild(demoElement);
	sideElement.appendChild(reviewElement);
    if (this.qrcode) {
	    sideElement.appendChild(qrcodeElement);
    }

	this.element.appendChild(sideElement);
};

jira.ticketviewer.ticketgenerator.Ticket.prototype.createTitleElement = function(id,text,width,height)
{

	var titleElement = document.createElement("span");
    if (parseInt(text != NaN)) {
	var textArray = text.split("\n");
	for (var i=0; i < textArray.length; i++) {
	    titleElement.appendChild(document.createTextNode(textArray[i]));
        titleElement.appendChild(document.createElement("br"));
	}
	var multiline = textArray.length > 1;
    } else {
	 titleElement.appendChild(document.createTextNode(text));
	var multiline = true;
    }
    
    
    titleElement.style.textAlign = "center";
	titleElement.style.width = width;
	if (height != undefined)
		titleElement.style.height = height + "px";
	else 
		titleElement.style.height = "50px";
	titleElement.style.float = "left";
	titleElement.style.outline = "2px solid black";
	titleElement.style.verticalAlign = "middle";
	height = height || 50;
    if (multiline) {
	    titleElement.style.lineHeight = height/2 + "px";
    } else {
        titleElement.style.lineHeight = height + "px";
    }
	titleElement.style.fontSize= "12px";
	
	titleElement.setAttribute("id", id);
	return titleElement;
};

jira.ticketviewer.ticketgenerator.Ticket.prototype.addQRCode = function(url)
{
	new jira.ticketviewer.ExampleClass(this.divId + "_qrcode",url);
};
