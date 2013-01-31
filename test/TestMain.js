test( "getUrlType recognizes Jira URLs", function() {
	var urlType = getUrlType("https://jira.springsource.org/browse/BATCH-915")
	equal("jira", urlType );
});

test( "getUrlType recognizes RapidBoard URLs", function() {
	var urlType = getUrlType("https://jira.caplin.com/secure/RapidBoard.jspa?rapidView=11")
	equal("rapidBoard", urlType );
});


test( "getUrlType recognizes FixVersion URLs", function() {
	var urlType = getUrlType("https://jira.springsource.org/browse/BATCH/fixforversion/11327")
	equal("fixVersion", urlType );
});

test( "getUrlType recognizes bad URLs", function() {
	var urlType = getUrlType("http://www.google.com")
	equal("null", urlType );
});

test( "getUrlType recognizes Jira URLs", function() {
	var jira = getJiraFromUrl("https://jira.springsource.org/browse/BATCH-915")
	equal("BATCH-915", jira );
});


test( "get host from secure URL", function() {
	var urlType = getHostFromUrl("https://jira.caplin.com/secure/RapidBoard.jspa?rapidView=8")
	equal("https://jira.caplin.com", urlType );
});

test( "get host from URL", function() {
	var urlType = getHostFromUrl("http://jira.springsource.org/browse/BATCH/fixforversion/11327")
	equal("http://jira.springsource.org", urlType );
});

test( "get host from redirect url", function() {
	var urlType = getHostFromUrl("http://jira/browse/BATCH/fixforversion/11327")
	equal("http://jira", urlType );
});

test( "getHostFromURL returns null for bad URL", function() {
	var urlType = getHostFromUrl("ra.caplin.com/secure/RapidBoard.jspa?rapidView=8")
	equal(null, urlType );
});
