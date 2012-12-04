CardRenderer = function (url, jira, estimate, summary, parent, parentSummary, component, tag, issueType, qrcode) {
	this.url = url;
	this.jira = jira;
	this.estimate = estimate;
	this.summary = summary;
	this.parent = parent;
	this.parentSummary = parentSummary;
	this.component = component;
	this.tag = tag;
	this.issueType = issueType;
	this.bAddQRCode = qrcode;
};

CardRenderer.prototype.render = function (divId) {
	this.divId = divId + "" + jira;
	this.element = document.getElementById(divId);
	this.element.className = "ticket";

	this.addTitle(this.jira, this.estimate, this.parent, this.issueType);
	this.addSideBar(this.bAddQRCode);
	this.addSummary(this.summary, this.parentSummary, this.component, this.tag);
};

CardRenderer.prototype.addTitle = function (jira, estimate, parent, issueType) {
	var summary = jira;
	if (parent !== null && parent !== undefined) {
		summary = parent + "\n" + jira;
	}
	var jiraElement = this.createTitleElement(this.divId + "_jira", summary || "Jira", "35%");
	jiraElement.className += " jiraElement "+issueType.replace(" ", "_");

	var estimateElement = this.createTitleElement(this.divId + "_estimate", estimate || "Estimate", "15%");
	var actualElement = this.createTitleElement(this.divId + "_actual", "Actual", "15%");
	var ownerElement = this.createTitleElement(this.divId + "_owner", "Owner", "35%");

	var titleElement = document.createElement("div");
	titleElement.className = "titleRow";

	titleElement.appendChild(jiraElement);
	titleElement.appendChild(estimateElement);
	titleElement.appendChild(actualElement);
	titleElement.appendChild(ownerElement);

	this.element.appendChild(titleElement);
};

CardRenderer.prototype.addSummary = function (summary, parentSummary, component, tag) {
	var sideElement = document.createElement("div");
	sideElement.className = "summaryElement";

	if (parentSummary != null) {
		summary = "<strong>" + parentSummary + "</strong><br /><br />" + summary;
	}

	if (component != null) {
		summary = "<strong>" + component + "</strong><br /><br />" + summary;
	}

	sideElement.innerHTML = summary;

	var tagElement = document.createElement("div");
	tagElement.className = "tagElement";
	tagElement.innerHTML = tag;

	this.element.appendChild(tagElement);
	this.element.appendChild(sideElement);

};

CardRenderer.prototype.addSideBar = function (bAddQRCode) {
	var sideElement = document.createElement("div");
	sideElement.className = "sidebarSideElement";
	sideElement.setAttribute("id", "sidebar");

	var docElement = this.createTitleElement(this.divId + "_doc", "Doc", "100%", 60);
	var demoElement = this.createTitleElement(this.divId + "_demo", "Demo", "100%", 60);
	var reviewElement = this.createTitleElement(this.divId + "_review", "Review", "100%", 60);

	sideElement.appendChild(docElement);
	sideElement.appendChild(demoElement);
	sideElement.appendChild(reviewElement);

	if (bAddQRCode) {
		var qrcodeElement = this.createTitleElement("qrid", "QRCode", "100%", 88);
		qrcodeElement.innerHTML = '<img style="margin-top: 20px;" width="50px" height="50px" src="http://qr.kaywa.com/?s=8&d=http%3A%2F%2F' + this.url + '" alt="QRCode"/>';
		sideElement.appendChild(qrcodeElement);
	}

	this.element.appendChild(sideElement);
};

CardRenderer.prototype.createTitleElement = function (id, text, width, height) {
	var multiline;
	var titleElement = document.createElement("span");
	titleElement.className = "titleElement";
	titleElement.style.width = width;
	if (height != undefined) {
		titleElement.style.height = height + "px";
	}

	if (typeof text != 'number') {
		var textArray = text.split("\n");
		for (var i = 0; i < textArray.length; i++) {
			titleElement.appendChild(document.createTextNode(textArray[i]));
			titleElement.appendChild(document.createElement("br"));
		}
		multiline = textArray.length > 1;
	} else {
		titleElement.appendChild(document.createTextNode(text));
		multiline = true;
	}

	if (multiline) {
		titleElement.style.lineHeight = (height || 50) / 2 + "px";
	}

	titleElement.setAttribute("id", id);
	return titleElement;
};
