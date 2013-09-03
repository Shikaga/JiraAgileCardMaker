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
    this.detectConnectionType();
}

JiraCommunicationHandler.prototype.getData = function(callback, requestUrl) {
    if (this.dataType === this.dataTypes.JSONP) {
        this.getDataWithJSONP(callback, requestUrl);
    } else if (this.dataType === this.dataTypes.JSON) {
        this.getDataWithJSON(callback, requestUrl);
    }
}

JiraCommunicationHandler.prototype.detectConnectionType = function() {
    this.tryJsonp();
    this.tryJson();
}

JiraCommunicationHandler.prototype.tryJsonp = function() {
    this.getDataWithJSONP(function(data) {
        if (data !== "failed") {
            this.dataType = this.dataTypes.JSONP;
            console.log(this.dataType);
        }
    }.bind(this), this.domain + "/rest/api/latest/project");
}


JiraCommunicationHandler.prototype.tryJson = function() {
    this.getDataWithJSON(function(data) {
        if (data === 401) { //failed to authenticate
            console.log("Auth failed!")
            if (this.dataType === null) {
                alert("Wrong username or password");
            }
        } else if (data.toString() === "") {
            console.log("Auth required!")
            if (this.dataType === null) {
                alert("You need to supply authentication details");
            }
        } else {
            this.dataType = this.dataTypes.JSON;
        }
        console.log(this.dataType);
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
        error: function (errormessage) { callback("failed") }
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