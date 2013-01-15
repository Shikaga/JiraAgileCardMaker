test( "it can extract the SprintsId from the URL", function() {
	var sprintId = RapidBoardHandler.getSprintIfFromURL("https://jira.caplin.com/secure/RapidBoard.jspa?rapidView=0");
	equal("0", sprintId);

	var sprintId = RapidBoardHandler.getSprintIfFromURL("https://jira.caplin.com/secure/RapidBoard.jspa?rapidView=11");
	equal("11", sprintId);
});

test("get open sprints from JSON", function() {
	var json = JSON.parse('{"sprints":[{"id":6,"name":"Sprint 18","closed":true},{"id":9,"name":"Sprint 19","closed":true},{"id":11,"name":"Sprint 0","closed":false}],"rapidViewId":11}');
	var openSprints = RapidBoardHandler.getOpenSprintFromJSON(json);
	deepEqual(["11"], openSprints);

	json = JSON.parse('{"sprints":[{"id":6,"name":"Sprint 18","closed":false},{"id":9,"name":"Sprint 19","closed":true},{"id":11,"name":"Sprint 0","closed":false}],"rapidViewId":11}');
	openSprints = RapidBoardHandler.getOpenSprintFromJSON(json);
	deepEqual(["6", "11"], openSprints);
});

test("get list of GreenHopper Jiras from JSON", function() {
	var json = JSON.parse('{"contents":{"issueKeys":["PCINTS-100","PCX1AQA4-112","PCX1AQA4-120","PCX1AQA4-139","PCX1AQA4-145","PCX1AQA4-149","PSL-68","PSL-109","PSL-161","PSL-163","PSL-167","PSL-174","PSL-179","PSL-181","PSL-182","PSL-183","PSL-184","PSL-185","PSL-186","PSL-187","PSL-188","PSL-189","PSL-190","PSL-191","PSL-192","PSL-194","PSL-195","PSL-196","PSL-197","PSL-198","PSL-199","PSL-200","PSL-203","PSL-208","PSL-209","PSL-211","PSL-213"]}}');
	var jiras = RapidBoardHandler.getJirasFromJSON(json);
	deepEqual(["PCINTS-100","PCX1AQA4-112","PCX1AQA4-120","PCX1AQA4-139","PCX1AQA4-145","PCX1AQA4-149","PSL-68","PSL-109","PSL-161","PSL-163","PSL-167","PSL-174","PSL-179","PSL-181","PSL-182","PSL-183","PSL-184","PSL-185","PSL-186","PSL-187","PSL-188","PSL-189","PSL-190","PSL-191","PSL-192","PSL-194","PSL-195","PSL-196","PSL-197","PSL-198","PSL-199","PSL-200","PSL-203","PSL-208","PSL-209","PSL-211","PSL-213"], jiras);

	json = JSON.parse('{"contents":{"issueKeys":["PCINTS-101","PCX1AQA4-112","PCX1AQA4-120","PCX1AQA4-139","PCX1AQA4-145","PCX1AQA4-149","PSL-68","PSL-109","PSL-161","PSL-163","PSL-167","PSL-174","PSL-179","PSL-181","PSL-182","PSL-183","PSL-184","PSL-185","PSL-186","PSL-187","PSL-188","PSL-189","PSL-190","PSL-191","PSL-192","PSL-194","PSL-195","PSL-196","PSL-197","PSL-198","PSL-199","PSL-200","PSL-203","PSL-208","PSL-209","PSL-211","PSL-213"]}}');
	jiras = RapidBoardHandler.getJirasFromJSON(json);
	deepEqual(["PCINTS-101","PCX1AQA4-112","PCX1AQA4-120","PCX1AQA4-139","PCX1AQA4-145","PCX1AQA4-149","PSL-68","PSL-109","PSL-161","PSL-163","PSL-167","PSL-174","PSL-179","PSL-181","PSL-182","PSL-183","PSL-184","PSL-185","PSL-186","PSL-187","PSL-188","PSL-189","PSL-190","PSL-191","PSL-192","PSL-194","PSL-195","PSL-196","PSL-197","PSL-198","PSL-199","PSL-200","PSL-203","PSL-208","PSL-209","PSL-211","PSL-213"], jiras);

});