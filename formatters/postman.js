/**
 * Created by tomislavfabeta on 10/05/16.
 */

var HELPER = global.HELPER;
var runner = HELPER.runner;
var _ = require("underscore");

var formatPostmanCollection = function(){
    this.result = {};
    this.environment = {};
    this.apiRequestMethods = [];

    this._formatPostmanDumpData = [
        this._formatCollections
    ];
};

formatPostmanCollection.prototype = {
    constructor: formatPostmanCollection,

    setData: function(json){
        this.json = json;
        return this;
    },

    setFormatter: function(formatter){
        this.formatter = formatter;
        return this;
    },

    setApiRequestsMethods: function(methods){
        this.apiRequestMethods = methods || [];
        return this;
    },

    setEnvironment: function(environment){
        this.environment.name = environment;
        return this;
    },

    import: function(done){
        var self = this;
        var fns = [
            this._checkJsonData,
            this._checkPostmanDumpData,
            this._formatEnvironments,
            this._formatPostmanDumpData,
            this._returnResult
        ];

        new runner(fns, this, function(err){
            done(err, self.result);
        });
    },

    checkCollectionFormat: function(collection){
        var type = "Collection";
        var errMessage;

        if (!collection.hasOwnProperty("id")){
            errMessage = type + " id not set";
        }

        if (!collection.hasOwnProperty("name")){
            errMessage = type + " name not set";
        }

        if (!collection.hasOwnProperty("folders")){
            errMessage = type + " folders not set";
        }

        if (!collection.hasOwnProperty("requests")){
            errMessage = type + " requests not set";
        }

        return errMessage;
    },

    checkFolderFormat: function(folder){
        var type = "Folder";
        var errMessage;

        if (!folder.hasOwnProperty("id")){
            errMessage = type + " id not set";
        }

        if (!folder.hasOwnProperty("name")){
            errMessage = type + " name not set";
        }

        if (!folder.hasOwnProperty("collection_id") && !folder.hasOwnProperty("collection")){
            errMessage = type + " collection_id not set";
        }

        return errMessage;
    },

    checkRequestFormat: function (request) {
        var type = "Request";
        var errMessage;

        if (!request.hasOwnProperty("id")){
            errMessage = type + " id not set";
        }

        if (!request.hasOwnProperty("url")){
            errMessage = type + " url not set";
        }

        if (!request.hasOwnProperty("method")){
            errMessage = type + " method not set";
        }

        if (!request.hasOwnProperty("folder")){
            for (var folderId in global.namespace.folder){
                var folder = global.namespace.folder[folderId];

                if (_.isArray(folder.order)){
                    for (var key in folder.order){
                        var requestId = folder.order[key];
                        if (request.id == requestId){
                            request.folder = folderId;
                        }
                    }
                }
            }

            if (!request.folder){
                errMessage = type + " folder not set";
            }
        }

        if (!request.hasOwnProperty("data")){
            errMessage = type + " data not set";
        }

        return errMessage;
    },

    checkEnviromentFormat: function (environment) {
        var type = "Enviroment";
        var errMessage;

        if (!environment.hasOwnProperty("id")){
            errMessage = type + " id not set";
        }

        if (!environment.hasOwnProperty("name")){
            errMessage = type + " name not set";
        }

        if (!environment.hasOwnProperty("values")){
            errMessage = type + " values not set";
        }

        return errMessage;
    },

    saveToGlobal: function(type, key, value){
        if (!global.namespace){
            global.namespace = {};
        }

        if (!global.namespace[type]){
            global.namespace[type] = {};
        }

        global.namespace[type][key] = value;
    },

    formatFolders: function(folders){
        var formated = {};
        var collection;

        for (var key in folders) {
            var folder = folders[key];

            if (this.checkFolderFormat(folder)) {
                continue;
            }

            var id = folder.id;
            var name = folder.name;
            var description = folder.description;
            var lastRevision = folder.lastRevision;
            var collection_id = folder.collection_id || folder.collection;

            var collection = this.formatter.collections[collection_id];

            collection.folders[id] = this.formatter.newFolder();
            collection.folders[id].name = name;
            collection.folders[id].description = description;
            collection.folders[id].lastRevision = lastRevision;
            collection.folders[id].collection_id = collection_id;

            this.saveToGlobal('folder', id, folder);
        }

    },

    formatRequests: function(requests, done){
        var formated = {};
        var folder, collection;

        var fns = [];

        for (var key in requests) {
            // var request = requests[key];

            // if (this.checkRequestFormat(request)) {
            //     continue;
            // }
            //
            // var id = request.id;
            // var name = request.name;
            // var description = request.description;
            // var headers = request.headers;
            // var url = request.url;
            // var pathVariables = request.pathVariables;
            // var method = request.method;
            // var dataMode = request.dataMode;
            // var data = request.data;
            // var collection_id = request.collectionId;
            // var folder_id = request.folder;
            // var responses = request.responses;
            //
            // if (!folder_id){
            //     continue;
            // }
            //
            // var collection = this.formatter.collections[collection_id];
            // var folder = collection.folders[folder_id];
            //
            // if (!folder){
            //     continue;
            // }

            var prepareRunnerFunction = function(request, _id){

                return function(next){

                    if (this.checkRequestFormat(request)) {
                        return next();
                    }

                    var id = request.id;
                    var name = request.name;
                    var description = request.description;
                    var headers = request.headers;
                    var url = request.url;
                    var pathVariables = request.pathVariables;
                    var method = request.method;
                    var dataMode = request.dataMode;
                    var data = request.data;
                    var collection_id = request.collectionId;
                    var folder_id = request.folder;
                    var responses = request.responses;

                    if (!folder_id){
                        return next();
                    }

                    var collection = this.formatter.collections[collection_id];
                    var folder = collection.folders[folder_id];

                    if (!folder){
                        return next();
                    }

                    folder.requests[id] = this.formatter.newRequest();
                    folder.requests[id].name = name;
                    folder.requests[id].description = description;
                    folder.requests[id].headers = headers;
                    folder.requests[id].url = url;
                    folder.requests[id].pathVariables = pathVariables;
                    folder.requests[id].method = method;
                    folder.requests[id].dataMode = dataMode;
                    folder.requests[id].data = data || [];
                    folder.requests[id].collection_id = collection_id;
                    folder.requests[id].responses = responses || [];
                    folder.requests[id].environment = this.environment || {};

                    // folder.requests[id].executeApiRequests(this.apiRequestMethods, next);
                    next();
                };
            };

            fns.push(prepareRunnerFunction(requests[key]));
        }

        new runner(fns, this, function(){
            done();
        });
    },


    /*
    Runner functions
     */

    _checkJsonData: function(done){
        if (!_.isObject(this.json)){
            return done("Postman data not json!")
        }

        done();
    },

    _checkPostmanDumpData: function(done){
        var message = [];

        if (!this.json.hasOwnProperty("version")){
            message.push("Postman data version not set!");
        }

        if (!this.json.hasOwnProperty("collections") || (_.isArray(this.json.collections) && this.json.collections.length == 0)){
            message.push("Postman collections is empty!");
        }

        if (!this.json.hasOwnProperty(("environments")) || (_.isArray(this.json.environments) && this.json.environments.length == 0)){
            message.push("Postman environment is empty!");
        }

        if (!this.json.hasOwnProperty("collections") && this.json.hasOwnProperty("name") && this.json.hasOwnProperty("folders")){
            message = [];
            this.json.collections = [this.json];

            for (var key in this.json.collections[0].folders){
                var row = this.json.collections[0].folders[key];

                row.collection_id = this.json.collections[0].id;
            }

        }

        if (message.length > 0){
            return done(message.join(" "));
        }

        done();
    },

    _formatEnvironments: function(done){
        var environments = this.json.environments;

        // console.log(this.json);
        for (var key in environments) {
            var environment = environments[key];

            if (this.checkEnviromentFormat(environment)) {
                continue;
            }

            var id = environment.id;
            var name = environment.name;
            var values = environment.values;

            if (name == this.environment.name){
                this.environment.values = values;
                this.environment.id = id;
                // console.log(this.environment);

            }

            this.formatter.environments[id] = this.formatter.newEnvironment();
            this.formatter.environments[id].id = id;
            this.formatter.environments[id].name = name;
            this.formatter.environments[id].values = values;
        }

        done();
    },

    _formatCollections: function(done){
        var collections = this.json.collections;

        var fns = [];


        for (var key in collections){
            var collection = collections[key];

            if (this.checkCollectionFormat(collection)){
                continue;
            }

            var prepareCollectionFunction = function(collection){
                return function(next){
                    var id = collection.id;
                    var name = collection.name;
                    var description = collection.description;
                    var folders = collection.folders;
                    var requests = collection.requests;

                    console.log("Collection "+name+" has " + folders.length + " folders!");
                    this.formatter.collections[id] = this.formatter.newCollection();
                    this.formatter.collections[id].name = name;
                    this.formatter.collections[id].description = description;

                    this.formatFolders(folders);
                    this.formatRequests(requests, next);
                };
            };

            fns.push(prepareCollectionFunction(collection));
            // this.formatter.collections[id].folders = this.formatter.newFolder();
        }

        new runner(fns, this, done);
    },

    _returnResult: function(done){
        this.result =  this.formatter;
        done();
    }
};

module.exports = formatPostmanCollection;
