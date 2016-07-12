/**
 * Created by tomislavfabeta on 10/05/16.
 */
var HELPER = global.HELPER;
var CLASS = global.CLASS;
var FORMATTER = global.FORMATTER;

var fs = require("fs");

var runner = HELPER.runner;

var formatter = FORMATTER.formatter;
var formatPostman = FORMATTER.postman;
var formatApidoc = FORMATTER.apidoc;

var exportType = "apidoc";

var Docmaster = function(params){
    this.params = params;
    this.formatStructure = {};
    this.format = "postman";
    this.possibleApiRequestMethods = [
        "get",
        "post",
        "put",
        "del"
    ];
    this.apiRequestMethods = [];
};

Docmaster.prototype = {
    constructor: Docmaster,

    setEnvironment: function(enviroment){
        this.enviroment = enviroment;
        return this;
    },

    setInputPath: function(input){
        this.inputPath = input;
        return this;
    },

    setOutputPath: function(output){
        this.outputPath = output;
        return this;
    },

    setFormat: function(format){
        if (format){
            this.format = format;
        }

        return this;
    },

    setApiRequestMethods: function(apiRequestMethods){
        if (apiRequestMethods){
            this.apiRequestMethods = apiRequestMethods.toLowerCase().split(",");
        }

        return this;
    },

    export: function(done){
        var self = this;

        var fns = [
            this._getInputFile,
            this._inputFileToJson,
            this._importFormat,
            this._exportFormat,
            this._returnResult
        ];

        new runner(fns, this, function (err){
            done(err, self.result)
        })
    },

    getFile: function(path, done){
        var file;

        try {
            file = fs.readFileSync(path, 'utf8');
        }catch(err){
            console.log('FAILED TO OPEN FILE ' + path);
            return done(err);
        }

        return done(null, file);
    },

    fileToJson: function(file, done){

        try {
            file = JSON.parse(file);
        }  catch (err){
            return done(err);
        }

        done(null, file);
    },

    /*
    runner functions
     */


    _getInputFile: function(done){
        var self = this;

        this.getFile(this.inputPath, function(err, file){
            self.inputFile = file;
            done(err);
        });
    },

    _inputFileToJson: function(done){
        var self = this;

        this.fileToJson(this.inputFile, function(err, json){
            self.inputJson = json;
            done(err);
        })
    },

    _importFormat: function(done){
        var self = this;

        switch(this.format){

            case "postman":
                new formatPostman()
                    .setData(this.inputJson)
                    .setEnvironment(this.enviroment)
                    .setApiRequestsMethods(this.apiRequestMethods)
                    .setFormatter(new formatter())
                    .import(_done);
                break;

        }

        function _done(err, res) {
            self.formatStructure = res;
            done(err);
        }
    },

    _exportFormat: function(done){
        var self = this;
        
        switch(exportType){
            case "apidoc":
                
                new formatApidoc()
                    .setOutput(this.outputPath)
                    .setFormatter(this.formatStructure)
                    .export(_done);
                
                break;
        }

        function _done(err, res){
            // self.formatStructure = res;
            done(err);
        }
    },

    _returnResult: function(done){
        this.result = this.formatStructure;
        done();
    }
};

module.exports = Docmaster;