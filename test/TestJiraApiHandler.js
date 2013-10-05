

test( "JiraRequestQueryTest", function() {
	var query = JiraApiHandler.getJirasRequestQuery();
	equal(null, query);

	var query = JiraApiHandler.getJirasRequestQuery(null);
	equal(null, query);

	var query = JiraApiHandler.getJirasRequestQuery(["STORM-1471"]);
	equal(query, "key=STORM-1471");

	var query = JiraApiHandler.getJirasRequestQuery(["STORM-1471", "STORM-1535"]);
	equal(query, "key=STORM-1471+or+key=STORM-1535");
});
