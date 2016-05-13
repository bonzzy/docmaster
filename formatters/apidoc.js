/**
 * Created by tomislavfabeta on 10/05/16.
 */

var HELPER = global.HELPER;
var FORMATTER = global.FORMATTER;

var runner = HELPER.runner;
var formatter = FORMATTER.formatter;
var path = require('path');
var fs = require("fs");

var headerTemplate,paramTemplate, mainTemplate;

var formatPostmanCollection = function(){
    this.result = {};
    this.template = {};
    this.files = {
        root: "",
        folder: {
            "example": {
                "bla.txt" : "docmaster 1.0"
            }
        }
    };
};

formatPostmanCollection.prototype = {
    constructor: formatPostmanCollection,

    setFormatter: function(formatter){
        this.formatter = formatter;
        return this;
    },

    setData: function(data){
        this.data = data;
        return this;
    },

    setOutput: function(path){
        this.outputPath = path;
        this.files.root = this.outputPath;
        
        return this;
    },

    export: function(done){
        var self = this;
        var fns = [
            this._checkFormat,
            this._getApidocMainTemplate,
            this._getApidocHeaderTemplate,
            this._getApidocParamTemplate,
            this._apidocFormat,
            this._saveApidoc,
            this._returnResult
        ];

        new runner(fns, this, function(err){
            done(err, self.result);
        });
    },

    getFile: function(path, done){
        var file;

        try {
            file = fs.readFileSync(path, 'utf8');
        }catch(err){
            console.log('FAILED TO OPEN FILE ' + path, err);
            return done(err);
        }

        return done(null, file);
    },

    mkdir: function(path){
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
    },

    saveToFile: function(value, path, done){
        fs.writeFile(path, value, function(err) {
            console.log("ERR", err)
            if(err) {
                done(err);
            }

            done();
        });
    },

    fileToJson: function(file, done){

        try {
            file = JSON.parse(file);
        }  catch (err){
            return done(err);
        }

        done(null, file);
    },

    addParamsToTemplate: function (params, template) {
        for (var name in params){
            var value = params[name];

            template = template.replace("{{"+name+"}}", value);
            template = template.replace("{{"+name+"}}", value);

        }

        // if (params.method + " " +params.api_name == "POST /"){
        //     console.log("laskdjlksajd", template, "________", params)
        //     process.exit();
        // }

        return template;
    },

    getParamsTemplateFromRequest: function (request) {
        var templates = [];
        for (var key in request.data){
            var data = request.data[key];

            var params = {
                type: data.type,
                name: data.key,
                value: data.value
            };

            var template = this.addParamsToTemplate(params, paramTemplate);
            templates.push(template);
        }

        return templates.join("\r\n");
    },

    processCollection: function (collection) {
        this.files.folder[collection.name] = {};

        var folders = collection.folders;

        for (var key in folders){
            var folder = folders[key];

            this.processFolder(this.files.folder[collection.name], folder);
        }
    },

    processFolder: function(collectionPath, folder){
        collectionPath[folder.name] = {};

        var requests = folder.requests;

        for (var key in requests){
            var request = requests[key];

            this.processRequest(collectionPath[folder.name], folder.name,  request)
        }
    },

    processRequest: function(folderPath, apiGroup, request){
        // folderPath[request.name] = {};

        var success = {};
        var error = {};
        var apiParamsTemplate = this.getParamsTemplateFromRequest(request);

        var params = {
            method: request.method,
            url: request.url,
            api_description: request.description,
            api_name: request.name,
            api_group: apiGroup,
            api_description: request.description,
            api_headers: this.addParamsToTemplate({value: request.headers}, headerTemplate),
            api_params: apiParamsTemplate,
            api_success: JSON.stringify(success),
            api_error: JSON.stringify(error),
            api_version : "1.0",
        };

        folderPath[request.method + " " +request.name] = this.addParamsToTemplate(params, mainTemplate);

    },

    /*
     Runner functions
     */

    _checkFormat: function(done){
        if (this.formatter.type != "Docmaster_Formatter"){
            return done("Wrong instance of formatter");
        }
        
        done();
    },

    _getApidocMainTemplate: function(done){
        var self = this;
        var templatePath = path.resolve(__dirname , '../templates/apidoc/apidoc.js');

        this.getFile(templatePath, function(err, file){
            self.template.main = file;
            mainTemplate = file;
            done(err);
        });

    },

    _getApidocHeaderTemplate: function(done){
        var self = this;
        var templatePath = path.resolve(__dirname , '../templates/apidoc/header.js');

        this.getFile(templatePath, function(err, file){
            self.template.header = file;
            headerTemplate = file;
            done(err);
        });

    },

    _getApidocParamTemplate: function(done){
        var self = this;
        var templatePath = path.resolve(__dirname , '../templates/apidoc/param.js');

        this.getFile(templatePath, function(err, file){
            self.template.param = file;
            paramTemplate = file;
            done(err);
        });

    },

    _apidocFormat: function(done){
        for (var key in this.formatter.collections){
            var collection = this.formatter.collections[key];

            this.processCollection(collection);
        }
        done();
    },

    _saveApidoc: function(done){
console.log("____________!!!", "_saveApiDoc")
        var structure = this.files;
        var filePath = structure.root;

        this.mkdir(filePath);

        // console.log(this.files.folder.Zipt["ambassadors"])

        for (var collectionName in this.files.folder){
            var collection = this.files.folder[collectionName];
            var collectionPath = filePath + collectionName;
            this.mkdir(collectionPath);

            for (var groupName in collection){
                var group = collection[groupName];
                var groupPath = collectionPath + "/" + groupName;
                // this.mkdir(groupPath);

                var value = "";
                for (var api in group){
                    value += group[api];
                }

                groupName = groupName.replace("/","-");

                console.log(collectionPath + "/" + groupName+".js");

                this.saveToFile(value, collectionPath + "/" + groupName+".js", function(err, res){});

                // for (var fileName in group){
                //     this.saveToFile(group[fileName], groupPath + "/" + fileName+".js", function(err, res){});
                // }
            }
        }


        // for (var collectionName in structure.folder){
        //     var folder = structure.folder;
        //     var collectionPath = filePath + "/" + collectionName;
        //
        //     console.log("OBJECT ", folder);
        //     this.mkdir(collectionPath);
        //
        //     for (var folderName in folder){
        //         var folderPath = collectionPath + "/" + folderName;
        //         this.mkdir(folderPath);
        //
        //         for (var fileName in folder[folderName]){
        //             console.log(folder[folderName]);
        //             this.saveToFile(JSON.stringify(folder[folderName][fileName]), folderPath + "/" + fileName+".js", function(err, res){});
        //         }
        //     }
        //
        // }
        // done();
    },

    _returnResult: function(done){
        this.formatter.nesto = "Nesto";
        this.result =  this.formatter.nesto;

        // console.log("FILES", this.files.folder.Zipt.ambassadors);
        done();
    }
};

module.exports = formatPostmanCollection;

