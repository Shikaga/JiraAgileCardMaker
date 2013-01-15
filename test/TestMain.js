test( "getUrlType recognizes jira URLs", function() {
	var urlType = getUrlType("https://jira.springsource.org/browse/BATCH-915")
	ok("jira", urlType );
});
