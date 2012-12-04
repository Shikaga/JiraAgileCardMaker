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

CardView.prototype.addTitle = function (issueId, estimate, parent) {
	if (parent !== null && parent !== undefined) {
		issueId = parent + "\n" + issueId;
	}

	var titleElement = document.createElement("div");
	titleElement.className = "titleRow";

	var issueIdElement = this.createTitleElement(issueId || "Issue Id");
	issueIdElement.className += " issueId";

	var estimateElement = this.createTitleElement(estimate || "Estimate");
	estimateElement.className += " estimate";

	var actualElement = this.createTitleElement("Actual");
	actualElement.className += " actual";

	var ownerElement = this.createTitleElement("Owner");
	ownerElement.className += " owner";

	titleElement.appendChild(issueIdElement);
	titleElement.appendChild(estimateElement);
	titleElement.appendChild(actualElement);
	titleElement.appendChild(ownerElement);

	this.element.appendChild(titleElement);
};

CardView.prototype.addSummary = function (summary, parentSummary, component, tag) {
	var sideElement = document.createElement("div");
	sideElement.className = "summaryElement";

	if (this.isParentDescriptionEnabled && parentSummary != null) {
		summary = "<span class='parentSummary'>" + parentSummary + "</span>" + summary;
	}

	if (this.isComponentEnabled && component != null) {
		summary = "<span class='component'>" + component + "</span>" + summary;
	}

	sideElement.innerHTML = summary;

	if (this.isTagEnabled) {
		var tagElement = document.createElement("div");
		tagElement.className = "tag";
		tagElement.innerHTML = tag;
		this.element.appendChild(tagElement);
	}

	this.element.appendChild(sideElement);
};

CardView.prototype.addSideBar = function (bAddQRCode, url) {
	var sideElement = document.createElement("div");
	sideElement.className = "sidebar";

	var docElement = this.createTitleElement("Doc");
	docElement.className += " doc";

	var demoElement = this.createTitleElement("Demo");
	demoElement.className += " demo";

	var reviewElement = this.createTitleElement("Review");
	reviewElement.className += " review";

	sideElement.appendChild(docElement);
	sideElement.appendChild(demoElement);
	sideElement.appendChild(reviewElement);

	if (bAddQRCode) {
		var qrcodeElement = this.createTitleElement("QRCode");
		qrcodeElement.className += " qrcode";
		qrcodeElement.innerHTML = '<img src="http://qr.kaywa.com/?s=8&d=' + encodeURIComponent(url) + '" alt="QRCode"/>';
		sideElement.appendChild(qrcodeElement);
	}

	this.element.appendChild(sideElement);
};

CardView.prototype.createTitleElement = function (text) {
	var multiline;
	var titleElement = document.createElement("span");
	titleElement.className = "titleElement";

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
		titleElement.className += " multiline";
	}

	return titleElement;
};
