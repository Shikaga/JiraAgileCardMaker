var CardView = function(cardModel, issueMap, checkBoxes, isParentDescriptionEnabled, isComponentEnabled, isTagEnabled, isColorEnabled, isQRCodeEnabled, isBusinessValueEnabled, isEpicEnabled) {
	this.cardModel = cardModel;
	this.issueMap = issueMap;
	this.checkBoxes = checkBoxes;
	this.isParentDescriptionEnabled = isParentDescriptionEnabled;
	this.isComponentEnabled = isComponentEnabled;
	this.isTagEnabled = isTagEnabled;
	this.isColorEnabled = isColorEnabled;
	this.isQRCodeEnabled = isQRCodeEnabled;
	this.isBusinessValueEnabled = isBusinessValueEnabled;
    this.isEpicEnabled = isEpicEnabled;
	this.element = null;
};

CardView.prototype.getElement = function () {
	if (this.element == null) {
		this.element = document.createElement('div');
		this.element.className = "ticket "+(this.isColorEnabled ? "color" : "mono")+" "+this.cardModel.issueType.replace(" ", "_");

		this.addTitle(this.cardModel.issueId, this.cardModel.estimate, this.cardModel.parentIssueId);
		this.addSideBar(this.isQRCodeEnabled, this.cardModel.issueUrl, this.cardModel.priorityImage);
		this.addSummary(this.cardModel.summary, this.getCardParentSummary(), this.cardModel.component, this.cardModel.tag, this.cardModel.businessValue, this.cardModel.epic);
	}
	return this.element;
};

CardView.prototype.getCardParentSummary = function() {
	var parentIssue = this.issueMap[this.cardModel.parentIssueId];
	return parentIssue != null ? parentIssue.summary : null;
}

CardView.prototype.addTitle = function (issueId, estimate, parent, priorityImage) {
	var titleElement = document.createElement("div");
	titleElement.className = "titleRow";

	var issueIdElement = this.createSummaryElement(issueId || "Issue Id");
	issueIdElement.className += " key";
	
	var estimateElement = this.createTitleElement(estimate || "Estimate");
	if (estimate) {
		estimateElement.className += " estimate-number";
	}
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

CardView.prototype.addSummary = function (summary, parentSummary, component, tag, businessvalue, epic) {
	var sideElement = document.createElement("div");
	sideElement.className = "summaryElement";

    if (this.isComponentEnabled && component != null) {
        sideElement.innerHTML += "<span class='component'>" + component + "</span>";
    }

    if (this.isEpicEnabled && epic != null && typeof epics !== "undefined") {
        var epicData = epics.filter(function(_) {
            return _.key === epic
        })[0];
        sideElement.innerHTML += "<span class='epic' style='background-color: " + epicData.epicColor + "'>" + epicData.epicLabel + "</span>";
    }

	if (this.isParentDescriptionEnabled && parentSummary != null) {
		sideElement.innerHTML += "<span class='parentSummary'>" + parentSummary + "</span>"
	}

	sideElement.innerHTML += "<span class='summary'>" + summary + "</span>";

	if (this.isTagEnabled) {
		var tagElement = document.createElement("div");
		tagElement.className = "tag";
		tagElement.innerHTML = tag;
		this.element.appendChild(tagElement);
	}

	if (this.isBusinessValueEnabled) {
		var tagElement = document.createElement("div");
		tagElement.className = "businessvalue cat" + businessvalue;
		tagElement.innerHTML = "";
		this.element.appendChild(tagElement);
	}

	this.element.appendChild(sideElement);
};

CardView.prototype.addSideBar = function (bAddQRCode, url, priorityImage) {
	var sideElement = document.createElement("div");
	sideElement.className = "sidebar";

	for (var i = 0; i < this.checkBoxes.length; ++i) {
		var checkBoxName = this.checkBoxes[i];
		var element = this.createTitleElement(checkBoxName);
		element.className += " "+checkBoxName.replace(" ", "_");
		sideElement.appendChild(element);
	}

	// if (bAddQRCode) {
	// 	var qrcodeElement = this.createTitleElement("QRCode");
	// 	qrcodeElement.className += " qrcode";
	// 	qrcodeElement.innerHTML = '<img src="http://qr.kaywa.com/?s=8&d=' + encodeURIComponent(url) + '" alt="QRCode"/>';
	// 	sideElement.appendChild(qrcodeElement);
	// }

	if (priorityImage) {
		var priorityElement = this.getPriorityElement(priorityImage)
		sideElement.appendChild(priorityElement);
	}

	this.element.appendChild(sideElement);
};

CardView.prototype.createTitleElement = function (text) {
	var titleElement = document.createElement("span");
	titleElement.className = "titleElement";

	if (typeof text != 'number') {
		var textArray = text.split("\n");
		for (var i = 0; i < textArray.length; i++) {
			titleElement.appendChild(document.createTextNode(textArray[i]));
		}
	} else {
		titleElement.appendChild(document.createTextNode(text));
	}

	return titleElement;
};

CardView.prototype.createSummaryElement = function (text) {
	var multiline;
	var titleElement = document.createElement("span");
	titleElement.className = "titleElement";

	var textArray = text.split("\n");
	for (var i = 0; i < 1; i++) {
		var project = textArray[i].split("-")[0];
		var number = textArray[i].split("-")[1];
		var projectDiv = document.createElement("div");
		projectDiv.className = "project";
		projectDiv.innerHTML = project;
		var numberDiv = document.createElement("div");
		numberDiv.className = "number";
		numberDiv.innerHTML = number;
		titleElement.appendChild(projectDiv);
		titleElement.appendChild(numberDiv);
		titleElement.appendChild(document.createElement("br"));
	}
	multiline = textArray.length > 1;

	if (multiline) {
		titleElement.className += " multiline";
	}

	return titleElement;
};

CardView.prototype.getPriorityElement = function(imgUrl) {
	var priorityImage = document.createElement("img");
	priorityImage.style.position = "absolute";
	priorityImage.style.bottom = "5px";
	priorityImage.style.right = "5px";
	priorityImage.style.width = "70px";
	priorityImage.style.height = "70px";

	priorityImage.src = imgUrl;

	return priorityImage;
}

