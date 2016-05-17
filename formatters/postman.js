/**
 * Created by tomislavfabeta on 10/05/16.
 */

var HELPER = global.HELPER;
var runner = HELPER.runner;
var _ = require("underscore");

var formatPostmanCollection = function(){
    this.result = {};

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

    import: function(done){
        var self = this;
        var fns = [
            this._checkJsonData,
            this._checkPostmanDumpData,
            this._formatEnviroments,
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

        if (!folder.hasOwnProperty("collection_id")){
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
            errMessage = type + " folder not set";
        }

        if (!request.hasOwnProperty("data")){
            errMessage = type + " data not set";
        }

        return errMessage;
    },

    checkEnviromentFormat: function (enviroment) {
        var type = "Enviroment";
        var errMessage;

        if (!enviroment.hasOwnProperty("id")){
            errMessage = type + " id not set";
        }

        if (!enviroment.hasOwnProperty("name")){
            errMessage = type + " name not set";
        }

        if (!enviroment.hasOwnProperty("values")){
            errMessage = type + " values not set";
        }

        return errMessage;
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
            var collection_id = folder.collection_id;

            var collection = this.formatter.collections[collection_id];

            collection.folders[id] = this.formatter.newFolder();
            collection.folders[id].name = name;
            collection.folders[id].description = description;
            collection.folders[id].lastRevision = lastRevision;
            collection.folders[id].collection_id = collection_id;
        }

    },

    formatRequests: function(requests){
        var formated = {};
        var folder, collection;

        for (var key in requests) {
            var request = requests[key];

            if (this.checkRequestFormat(request)) {
                continue;
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
                continue;
            }

            var collection = this.formatter.collections[collection_id];
            var folder = collection.folders[folder_id];

            console.log("___________________________",folder_id, collection.folders)


            folder.requests[id] = this.formatter.newRequest();

            folder.requests[id] = this.formatter.newFolder();
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

            if (!_.isArray(data)){
                console.log("DATA",data);

            }

        }

        // console.log(collection.folders)
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

        // for (var key in this.json){
        //     console.log(key);
        // }
        if (!this.json.hasOwnProperty("version")){
            message.push("Postman data version not set!");
        }

        if (!this.json.hasOwnProperty("collections") || (_.isArray(this.json.collections) && this.json.collections.length == 0)){
            message.push("Postman collections is empty!");
        }

        if (!this.json.hasOwnProperty(("environments")) || (_.isArray(this.json.environments) && this.json.environments.length == 0)){
            message.push("Postman enviroment is empty!");
        }

        if (!this.json.hasOwnProperty("collections") && this.json.hasOwnProperty("name") && this.json.hasOwnProperty("folders")){
            message = [];
            this.json.collections = [this.json];

            for (var key in this.json.collections[0].folders){
                var row = this.json.collections[0].folders[key];

                row.collection_id = this.json.collections[0].id;
            }
            console.log("lsakdjsaljdlaksjdlasjdkakdjsa", this.json.collections[0].id)
        }

        if (message.length > 0){
            return done(message.join(" "));
        }

        done();
    },

    _formatEnviroments: function(done){
        var enviroments = this.json.enviroments;

        for (var key in enviroments) {
            var enviroment = enviroments[key];

            if (this.checkEnviromentFormat(enviroment)) {
                continue;
            }

            var id = enviroment.id;
            var name = enviroment.name;
            var values = enviroment.values;

            this.formatter.enviroments[id] = this.formatter.newEnviroment();
            this.formatter.enviroments[id].id = id;
            this.formatter.enviroments[id].name = name;
            this.formatter.enviroments[id].values = values;
        }

        done();
    },

    _formatCollections: function(done){
        var collections = this.json.collections;

        for (var key in collections){
            var collection = collections[key];

            if (this.checkCollectionFormat(collection)){
                continue;
            }

            var id = collection.id;
            var name = collection.name;
            var description = collection.description;
            var folders = collection.folders;
            var requests = collection.requests;

            this.formatter.collections[id] = this.formatter.newCollection();
            this.formatter.collections[id].name = name;
            this.formatter.collections[id].description = description;

            this.formatFolders(folders);
            this.formatRequests(requests);
            // this.formatter.collections[id].folders = this.formatter.newFolder();

        }

        done();
    },

    _returnResult: function(done){
        this.result =  this.formatter;
        done();
    }
};

module.exports = formatPostmanCollection;
