JSONParser = function () {
	this.jiras = {};
};

JSONParser.prototype.addJSON = function (jiraID, json) {
	this.jiras[jiraID] = json;
};

JSONParser.prototype.getParentKey = function () {
	if (this.parentdescriptionEnabled) {
		if (this.jira.fields.parent) {
			return jira.fields.parent.key;
		} else {
			return null;
		}
	} else {
		return null;
	}
};

JSONParser.prototype.getParentSummary = function () {
	if (this.getParentKey() != null) {
		var parentKey = jira.fields.parent.key;
		return this.jiraMap[parentKey].fields.summary;
	} else {
		return null;
	}
};

JSONParser.prototype.getTag = function () {
	if (this.tagEnabled) {
		return jira.fields["customfield_10151"];
	} else {
		return null;
	}
};