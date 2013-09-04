var RapidBoardHandler = function () {
};

RapidBoardHandler.getSprintIfFromURL = function(url) {
	return url.split("=")[1];
}

RapidBoardHandler.getOpenSprintsFromJSON = function(json) {
	var object = json;
	var sprints = object.sprints;
	var openSprintIds = [];
	for (var i=0; i < sprints.length; i++) {
		if (sprints[i].closed == false) {
			openSprintIds.push({name: sprints[i].name, id: sprints[i].id.toString()});
		}
	}
	return openSprintIds;
}

RapidBoardHandler.getJirasFromJSON = function(json) {
	var object = json;
	//There are two different APIs, handle both
	if (typeof object.contents.issueKeys !== "undefined") {
		return object.contents.issueKeys;	
	} else {
		var issues = [];
		issues = issues.concat(RapidBoardHandler.getArrayOfIssueIdsFromArrayOfIssueObjects(object.contents.completedIssues));
		issues = issues.concat(RapidBoardHandler.getArrayOfIssueIdsFromArrayOfIssueObjects(object.contents.incompletedIssues));
		issues = issues.concat(RapidBoardHandler.getArrayOfIssueIdsFromArrayOfIssueObjects(object.contents.puntedIssues));
		return issues;
	}
}

RapidBoardHandler.getArrayOfIssueIdsFromArrayOfIssueObjects = function(issueObjects) {
	var stringArray = [];
	for (var i=0; i < issueObjects.length; i++) {
		stringArray.push(issueObjects[i].key)
	}
	return stringArray;
}
