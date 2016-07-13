/**
 * Created by tomislavfabeta on 10/05/16.
 */

var HELPER = global.HELPER;
var REQUEST = require("request");
var runner = HELPER.runner;
var _ = require("underscore");
var been = false;

var formatter = function(){
    this.type = "Docmaster_Formatter";
    this.collections = {};
    this.environments = {};
};

formatter.prototype = {
    constructor: formatter,

    newCollection: function(){
        return new collection();
    },

    newFolder: function(){
        return new folder();
    },

    newRequest: function(){
        return new request();
    },

    newEnvironment: function(){
        return new environment();
    }
};

module.exports = formatter;


function collection(){
    this.name;
    this.description;
    this.folders = {};
}

function folder(){
    this.name;
    this.description;
    this.collection_id;
    this.lastRevision = 0;
    this.requests = {};
}

function request(){
    this.name;
    this.description
    this.headers;
    this.url;
    this.pathVariables;
    this.method;
    this.data;
    this.dataMode;
    this.environment = {};
    this.responses = [];

    this.executeApiRequests = executeApiRequests;
    // this.extendWithEnvironment = extendWithEnvironment;
}

function environment(){
    this.name;
    this.description;
    this.values = {};
}

function executeApiRequests(methods, done){
    var requests = [];
    var context = this;
    // this.extendWithEnvironment();
    
    for (var key in methods){
        var method = methods[key];

        if (this.method.toLowerCase() == method.toLowerCase()){
            requests.push(executeApiRequest(this, method));
        }
    }
    
    new runner(requests, context, function(err){
        done(err, context.responses);
    })
}

function executeApiRequest(request, method){

    return function(done){

        // if (been){
        //     return done();
        // }
        //
        // been = true;

        /**
         * Replace request params with environment params
         */
        for (var key in this.environment.values){
            var row = this.environment.values[key];

            for (var requestKey in request){

                if (typeof request[requestKey] == "string"){
                    request[requestKey] = request[requestKey].replace("{{" + row.key + "}}", row.value);
                }

                if (requestKey == 'data'){
                    for (var dataKey in request[requestKey]){

                        if (typeof request[requestKey][dataKey].value == "string"){
                            request[requestKey][dataKey].value = request[requestKey][dataKey].value.replace("{{" + row.key + "}}", row.value);
                        }

                    }
                }

            }
        }

        /**
         * Headers from string to object
         */

        var headersArr = request.headers.split('\n');
        var headers = {};

        for (var key in headersArr){
            var row = headersArr[key];

            if (row){
                /**
                 * TODO dangerous ': '
                 * @type {Array}
                 */
                var rowArr = row.split(': ');
                headers[rowArr[0]] = rowArr[1];
            }

        }

        /**
         * Prepare body params
         */

        var body = {};
        for (var key in request.data){
            var row = request.data[key];

            body[row.key] = row.value;
        }

        // console.log(request);
        /**
         * Make Request
         * @type {{url: (*|string), method: *, headers: {}, body, checkServerIdentity: options.checkServerIdentity}}
         */
        var options = {
            url: request.url,
            method: method,
            headers: headers,
            body: JSON.stringify(body),
            checkServerIdentity: function (host, cert) {
                return undefined;
            }
        };

        function callback(error, response, body) {
            if (body){

                try{
                    body = JSON.parse(body);
                    request.responses.push({
                        responseCode: {
                            code:body.code || body.status
                        },
                        text: body
                    });

                    console.log("Request: ("+ request.method +") " +request.url+ " is finished!");
                    
                }catch (err){
                    console.log("something went wrong", err);
                }

            }

            done();
        }

        REQUEST(options, callback);
    }
}

