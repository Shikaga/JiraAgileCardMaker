var Card = function (issueId, issueUrl, issueType, estimate, summary, component, tag, businessValue, parentIssueId) {
	if (issueId == null) throw new Error("An Issue must have an id.");

	this.issueId = issueId;
	this.issueUrl = issueUrl;
	this.issueType = issueType;
	this.estimate = estimate;
	this.summary = summary;
	this.component = component;
	this.tag = tag;
	this.businessValue = businessValue;
	this.parentIssueId = parentIssueId;
};