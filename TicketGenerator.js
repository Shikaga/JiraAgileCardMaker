QRCodeRenderer = function (divId, url) {
	document.getElementById(divId).innerHTML = '<img style="margin-top: 20px;" width="50px" height="50px" src="http://qr.kaywa.com/?s=8&d=http%3A%2F%2F' + url + '" alt="QRCode"/>';
};

CardRenderer = function (url, jira, estimate, summary, parent, parentSummary, component, tag, color, qrcode) {
	this.url = url;
	this.jira = jira;
	this.estimate = estimate;
	this.summary = summary;
	this.parent = parent;
	this.parentSummary = parentSummary;
	this.component = component;
	this.tag = tag;
	this.color = color;
	this.qrcode = qrcode;

};

CardRenderer.prototype.render = function (divId) {
	this.divId = divId + "" + jira;
	this.element = document.getElementById(divId);
	this.setWidth();
	this.setHeight();
	this.addDefaultBorder();

	this.addTitle(this.jira, this.estimate, this.parent, this.color);
	this.addSideBar();
	this.addSummary(this.summary, this.parentSummary, this.component, this.tag);
	if (this.qrcode) {
		this.addQRCode(this.url);
	}
};

CardRenderer.prototype.setWidth = function () {
	this.element.style.margin = "auto";
	this.element.style.float = "left";
	this.element.style.width = 335 + "px";
	this.element.style.position = "relative";
	this.element.style.marginLeft = 20 + "px";
};

CardRenderer.prototype.setHeight = function () {
	this.element.style.height = 320 + "px";
	this.element.style.marginTop = 20 + "px";
};

CardRenderer.prototype.addDefaultBorder = function () {
	this.element.style.border = "2px solid black"
};

CardRenderer.prototype.addTitle = function (jira, estimate, parent, color) {
	var summary = jira;
	if (parent !== null && parent !== undefined) {
		summary = parent + "\n" + jira;
	}
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

CardRenderer.prototype.addSummary = function (summary, parentSummary, component, tag) {
	var sideElement = document.createElement("div");
	sideElement.style.marginRight = "70px";
	sideElement.style.padding = "1em";
	sideElement.style.fontSize = "23px";

	sideElement.style.overflow = "hidden";
	sideElement.style.lineHeight = "23px";
	sideElement.style.height = "200px";

	if (parentSummary != undefined && parentSummary != null) {
		summary = "<strong>" + parentSummary + "</strong><br /><br />" + summary;
	}

	if (component != undefined && component != null) {
		summary = "<strong>" + component + "</strong><br /><br />" + summary;
	}

	sideElement.innerHTML = summary;

	var tagElement = document.createElement("div");
	tagElement.style.width = "70px";
	tagElement.style.height = "20px";
	tagElement.style.marginTop = "180px";
	tagElement.style.padding = "1em";
	tagElement.style.fontSize = "23px";
	tagElement.style.position = "absolute";
	tagElement.innerHTML = tag;

	this.element.appendChild(tagElement);
	this.element.appendChild(sideElement);

};

CardRenderer.prototype.addSideBar = function () {
	var sideElement = document.createElement("div");
	sideElement.style.textAlign = "center";
	sideElement.style.width = "70px";
	sideElement.style.height = "268px";
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
	var qrcodeElement = this.createTitleElement(this.divId + "_qrcode", "QRCode", "100%", 88);

	sideElement.appendChild(docElement);
	sideElement.appendChild(demoElement);
	sideElement.appendChild(reviewElement);
	if (this.qrcode) {
		sideElement.appendChild(qrcodeElement);
	}

	this.element.appendChild(sideElement);
};

CardRenderer.prototype.createTitleElement = function (id, text, width, height) {
	var multiline;
	var titleElement = document.createElement("span");
	if (isNaN(parseInt(text, 10)) == false) {
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
		titleElement.style.lineHeight = height / 2 + "px";
	} else {
		titleElement.style.lineHeight = height + "px";
	}
	titleElement.style.fontSize = "12px";

	titleElement.setAttribute("id", id);
	return titleElement;
};

CardRenderer.prototype.addQRCode = function (url) {
	new QRCodeRenderer(this.divId + "_qrcode", url);
};
