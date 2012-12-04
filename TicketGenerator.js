var jira = {
	ticketviewer: {
		ticketgenerator: {}
	}
};

// Ticket

jira.ticketviewer.ticketgenerator.Ticket = (function() {

	function Ticket(ticketDiv, url, jira, estimate, summary, parent, parentSummary, component, tag, issueType, qrcode) {
		this.element = ticketDiv;
		this.element.className = "ticket";

		this.addTitle(jira, estimate, parent, issueType);
		this.addSideBar(url, qrcode);
		this.addSummary(summary, parentSummary, component, tag);
	}

	Ticket.prototype.addTitle = function (jira, estimate, parent, issueType) {
		var summary = jira;
		if (parent !== null && parent !== undefined) {
			summary = parent + "\n" + jira
		}
		var jiraElement = this.createTitleElement(summary || "Jira", "35%");
		jiraElement.className += " jiraElement "+issueType.replace(" ", "_");

		var estimateElement = this.createTitleElement(estimate || "Estimate", "15%");
		var actualElement = this.createTitleElement("Actual", "15%");
		var ownerElement = this.createTitleElement("Owner", "35%");

		var titleElement = document.createElement("div");
		titleElement.className = 'titleRow';

		titleElement.appendChild(jiraElement);
		titleElement.appendChild(estimateElement);
		titleElement.appendChild(actualElement);
		titleElement.appendChild(ownerElement);

		this.element.appendChild(titleElement);
	};

	Ticket.prototype.addSummary = function (summary, parentSummary, component, tag) {
		var sideElement = document.createElement("div");
		sideElement.className = "summaryElement";

		if (parentSummary != undefined && parentSummary != null) {
			summary = "<strong>" + parentSummary + "</strong><br /><br />" + summary;
		}

		if (component != undefined && component != null) {
			summary = "<strong>" + component + "</strong><br /><br />" + summary;
		}

		sideElement.innerHTML = summary;

		var tagElement = document.createElement("div");
		tagElement.className = "tagElement";
		tagElement.innerHTML = tag;

		this.element.appendChild(tagElement);
		this.element.appendChild(sideElement);

	};

	Ticket.prototype.addSideBar = function (url, bAddQRCode) {
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
			qrcodeElement.innerHTML = '<img style="margin-top: 20px;" width="50px" height="50px" src="http://qr.kaywa.com/?s=8&d=http%3A%2F%2F' + url + '" alt="QRCode"/>';
			sideElement.appendChild(qrcodeElement);
		}

		this.element.appendChild(sideElement);
	};

	Ticket.prototype.createTitleElement = function (text, width, height) {
		var titleElement = document.createElement("span");
		titleElement.className = "titleElement";
		titleElement.style.width = width;
		if (height != undefined) {
			titleElement.style.height = height + "px";
		}

		var multiline;
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

		if (multiline) {
			titleElement.style.lineHeight = (height || 50) / 2 + "px";
		}

		return titleElement;
	};

	return Ticket;
})();