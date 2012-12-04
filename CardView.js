var CardView = function(cardModel, issueMap, isParentDescriptionEnabled, isComponentEnabled, isTagEnabled, isColorEnabled, isQRCodeEnabled) {
	this.cardModel = cardModel;
	this.issueMap = issueMap;
	this.isParentDescriptionEnabled = isParentDescriptionEnabled;
	this.isComponentEnabled = isComponentEnabled;
	this.isTagEnabled = isTagEnabled;
	this.isColorEnabled = isColorEnabled;
	this.isQRCodeEnabled = isQRCodeEnabled;

	this.element = null;
};

CardView.prototype.getElement = function () {
	if (this.element == null) {
		this.element = document.createElement('div');
		this.element.className = "ticket "+(this.isColorEnabled ? "color" : "mono")+" "+this.cardModel.issueType.replace(" ", "_");

		this.addTitle(this.cardModel.issueId, this.cardModel.estimate, this.cardModel.parentIssueId);
		this.addSideBar(this.isQRCodeEnabled, this.cardModel.issueUrl);
		this.addSummary(this.cardModel.summary, this.cardModel.getParentSummary(this.issueMap), this.cardModel.component, this.cardModel.tag);
	}
	return this.element;
};

CardView.prototype.addTitle = function (jira, estimate, parent) {
	var summary = jira;
	if (parent !== null && parent !== undefined) {
		summary = parent + "\n" + jira;
	}
	var jiraElement = this.createTitleElement(summary || "Jira", "35%");
	jiraElement.className += " jiraElement";

	var estimateElement = this.createTitleElement(estimate || "Estimate", "15%");
	estimateElement.className += " estimate";

	var actualElement = this.createTitleElement("Actual", "15%");
	actualElement.className += " actual";

	var ownerElement = this.createTitleElement("Owner", "35%");
	ownerElement.className += " owner";

	var titleElement = document.createElement("div");
	titleElement.className = "titleRow";

	titleElement.appendChild(jiraElement);
	titleElement.appendChild(estimateElement);
	titleElement.appendChild(actualElement);
	titleElement.appendChild(ownerElement);

	this.element.appendChild(titleElement);
};

CardView.prototype.addSummary = function (summary, parentSummary, component, tag) {
	var sideElement = document.createElement("div");
	sideElement.className = "summaryElement";

	if (this.isParentDescriptionEnabled && parentSummary != null) {
		summary = "<strong>" + parentSummary + "</strong><br /><br />" + summary;
	}

	if (this.isComponentEnabled && component != null) {
		summary = "<strong>" + component + "</strong><br /><br />" + summary;
	}

	sideElement.innerHTML = summary;

	if (this.isTagEnabled) {
		var tagElement = document.createElement("div");
		tagElement.className = "tagElement";
		tagElement.innerHTML = tag;
		this.element.appendChild(tagElement);
	}

	this.element.appendChild(sideElement);
};

CardView.prototype.addSideBar = function (bAddQRCode, url) {
	var sideElement = document.createElement("div");
	sideElement.className = "sidebarSideElement";

	var docElement = this.createTitleElement("Doc", "100%", 60);
	var demoElement = this.createTitleElement("Demo", "100%", 60);
	var reviewElement = this.createTitleElement("Review", "100%", 60);

	sideElement.appendChild(docElement);
	sideElement.appendChild(demoElement);
	sideElement.appendChild(reviewElement);

	if (bAddQRCode) {
		var qrcodeElement = this.createTitleElement("QRCode", "100%", 88);
		qrcodeElement.innerHTML = '<img style="margin-top: 20px;" width="50px" height="50px" src="http://qr.kaywa.com/?s=8&d=' + encodeURIComponent(url) + '" alt="QRCode"/>';
		sideElement.appendChild(qrcodeElement);
	}

	this.element.appendChild(sideElement);
};

CardView.prototype.createTitleElement = function (text, width, height) {
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

	return titleElement;
};
