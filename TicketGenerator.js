var jira = function() {};
jira.ticketviewer = function() {};
jira.ticketviewer.ticketgenerator = function() {};
jira.ticketviewer.ExampleClass = function(divId, url)
{
	document.getElementById(divId).innerHTML = '<img style="margin-top: 20px;" width="50px" height="50px" src="http://qr.kaywa.com/?s=8&d=http%3A%2F%2F'+url + '" alt="QRCode"/>';
}

jira.ticketviewer.ticketgenerator.TicketGenerator = function(divId,url, jira, estimate, summary, color)
{
	//if (pagebreak)
		//this.createNewPage();
	this.divId = divId + "" + jira
	console.log("!!!!!!!!", color);
	this.element = document.getElementById(divId);
	this.setWidth(350);
	this.setHeight();
	this.addDefaultBorder();
	
	this.addTitle(jira,estimate, color);
	this.addSideBar();
	this.addSummary(summary);
	this.addQRCode(url);
};

jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.setWidth = function(width)
{
	this.element.style.margin = "auto";
	this.element.style.float = "left";
	this.element.style.width = width + "px";
	this.element.style.position = "relative";
	this.element.style.marginLeft = 50 + "px";

}
jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.setHeight = function()
{
	this.element.style.height = 250 + "px";
	this.element.style.marginBottom = 50 + "px";
}
jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.addDefaultBorder = function(width)
{
	this.element.style.border = "2px solid black"
}

jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.addTitle = function(jira, estimate, color)
{
	
	var jiraElement = this.createTitleElement(this.divId + "_jira", jira || "Jira", "35%");
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
}

jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.addSummary = function(summary)
{
	var sideElement = document.createElement("div");
	sideElement.style.marginRight = "5em";
	sideElement.style.padding = "1em";
	sideElement.style.fontSize= "23px";
	sideElement.innerHTML = summary;

	this.element.appendChild(sideElement);
}

jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.addSideBar = function()
{
	var sideElement = document.createElement("div");
	sideElement.style.textAlign = "center";
	sideElement.style.width = "70px";
	sideElement.style.height = "198px";
	sideElement.style.clear = "both";
	sideElement.style.position = "absolute";
	sideElement.style.top = "52px";
	sideElement.style.bottom = "0";
	sideElement.style.right = "0";
	sideElement.style.outline = "2px solid black";
	sideElement.setAttribute("id", "sidebar");

	var docElement = this.createTitleElement(this.divId + "_doc", "Doc", "100%",40);
	var demoElement = this.createTitleElement(this.divId + "_demo", "Demo", "100%",40);
	var reviewElement = this.createTitleElement(this.divId + "_review", "Review", "100%",40);
	var qrcodeElement = this.createTitleElement(this.divId + "_qrcode", "QRCode", "100%", 78);

	sideElement.appendChild(docElement);
	sideElement.appendChild(demoElement);
	sideElement.appendChild(reviewElement);
	sideElement.appendChild(qrcodeElement);

	this.element.appendChild(sideElement);
}

jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.createTitleElement = function(id,text,width,height)
{
	var titleElement = document.createElement("span");
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
	titleElement.style.lineHeight = height + "px";
	titleElement.style.fontSize= "12px";
	
	titleElement.setAttribute("id", id);
	titleElement.appendChild(document.createTextNode(text));
	return titleElement;
}

jira.ticketviewer.ticketgenerator.TicketGenerator.prototype.addQRCode = function(url)
{
	new jira.ticketviewer.ExampleClass(this.divId + "_qrcode",url);
}
