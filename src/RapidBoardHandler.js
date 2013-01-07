var RapidBoardHandler = function () {
};

RapidBoardHandler.getSprintIfFromURL = function(url) {
	return url.split("=")[1];
}

RapidBoardHandler.getOpenSprintFromJSON = function(json) {
	var object = json;
	var sprints = object.sprints;
	var openSprintIds = [];
	for (var i=0; i < sprints.length; i++) {
		if (sprints[i].closed == false) {
			openSprintIds.push(sprints[i].id.toString());
		}
	}
	return openSprintIds;
}

RapidBoardHandler.getJirasFromJSON = function(json) {
	var object = json;
	return object.contents.issueKeys;
}
