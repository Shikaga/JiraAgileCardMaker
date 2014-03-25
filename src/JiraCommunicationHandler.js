var JiraCommunicationHandler = function(domain, username, password) {
	this.domain = domain;
	this.username = username;
	this.password = password;
	this.dataTypes = {
		JSONP: 0,
		JSON: 1,
		JSONWITHAUTH: 2
	}
	this.dataType = null;
    this.errorEvents = JiraCommunicationHandler.errorEvents;
	this.queuedRequests = [];
}

JiraCommunicationHandler.errorEvents = {
    SUCCESS: 0,
    WRONG_AUTH: 1,
    AUTH_NEEDED: 2,
    FAIL: 3
}

JiraCommunicationHandler.prototype.connect = function() {
    this.detectConnectionType(function(){});
}

JiraCommunicationHandler.prototype.getData = function(callback, requestUrl) {
	if (this.dataType === null) {
		this.queuedRequests.push({callback: callback, requestUrl: requestUrl});
	} else {
		if (this.dataType === this.dataTypes.JSONP) {
			this.getDataWithJSONP(callback, requestUrl);
		} else if (this.dataType === this.dataTypes.JSON) {
			this.getDataWithJSON(callback, requestUrl);
		}
	}
}

JiraCommunicationHandler.prototype.detectConnectionType = function(callback) {
	this.tryJsonp(function(error) {
        this.setConnectionType(this.dataTypes.JSONP);
        callback(error);
    }.bind(this));

	this.tryJson(function(error) {
        if (error === this.errorEvents.SUCCESS) {
            this.setConnectionType(this.dataTypes.JSON);
        } else if (error === this.errorEvents.AUTH_NEEDED) {
            console.log("Auth required!")
        } else if (error === this.errorEvents.WRONG_AUTH) {
            console.log("Auth failed!")
        }
        callback(error);
    }.bind(this));
}

JiraCommunicationHandler.prototype.setConnectionType = function(connectionType) {
	if (this.dataType == null) {
		this.dataType = connectionType;
	}
	console.log(this.dataType);
	this.sendQueuedRequests();
}

JiraCommunicationHandler.prototype.sendQueuedRequests = function() {
	this.queuedRequests.forEach(function(queuedRequest) {
		this.getData(queuedRequest.callback, queuedRequest.requestUrl);
	}.bind(this));
	this.queuedRequests = [];
}

JiraCommunicationHandler.prototype.tryJsonp = function(callback) {
	this.getDataWithJSONP(function(data) {
		if (data !== "failed") {
			callback(this.errorEvents.SUCCESS);
		} else {
            callback(this.errorEvents.FAIL);
        }
	}.bind(this), this.domain + "/rest/api/latest/project");
}

JiraCommunicationHandler.prototype.tryJson = function(callback) {
	this.getDataWithJSON(function(data) {
		if (data === 401) { //failed to authenticate
            callback(this.errorEvents.WRONG_AUTH);
		} else if (data.toString() === "") {
            callback(this.errorEvents.AUTH_NEEDED);
		} else {
            callback(this.errorEvents.SUCCESS);
		}
	}.bind(this), this.domain + "/rest/api/latest/project");
}

JiraCommunicationHandler.prototype.getDataWithJSONP = function(callback, requestUrl) {
	var randomFunctionName = JiraApi.getRandomFunction(callback);
	if (requestUrl.indexOf("?") == -1) {
		var callbackAppend = "?jsonp-callback=" + randomFunctionName;
	} else {
		var callbackAppend = "&jsonp-callback=" + randomFunctionName;
	}
	$.ajax({
		type: "GET",
		url: requestUrl + callbackAppend,
		contentType: "application/javascript; charset=utf-8",
		dataType: "jsonp",
		success: function (data) { },
		error: function (errormessage) {
            if (errormessage.status !== 200) {
                callback("failed")
            }
        }
	});
}

JiraCommunicationHandler.prototype.getDataWithJSON = function(callback, requestUrl) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + requestUrl)
	if (this.username !== "") {
		this.setAuthorizationHeader(xhr);
	}
	xhr.setRequestHeader("x-requested-with", "love");
	xhr.send();
	xhr.onload = function(response) {
		if (this.status === 401) {
			callback(this.status);
		} else {
			var data = JSON.parse(response.target.response);
			callback(data);
		}
	};

}

JiraCommunicationHandler.prototype.setAuthorizationHeader = function(xhr) {
	var authHeader = "Basic "+btoa(this.username + ":" + this.password);
	xhr.setRequestHeader("Authorization", authHeader);
}