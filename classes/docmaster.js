/**
 * Created by tomislavfabeta on 10/05/16.
 */
var HELPER = global.HELPER;
var CLASS = global.CLASS;
var FORMATTER = global.FORMATTER;

var runner = HELPER.runner;
var formatter = FORMATTER.formatter;
var formatPostman = FORMATTER.postman;

var exportType = "apidoc";

var Docmaster = function(params){
    this.params = params;
    this.formatStructure = {};
    this.format = "postman";
};

Docmaster.prototype = {
    constructor: Docmaster,

    setInputPath: function(input){
        this.input = input;
        return this;
    },

    setOutputPath: function(output){
        this.output = output;
        return this;
    },

    setFormat: function(format){
        if (format){
            this.format = format;
        }

        return this;
    },

    export: function(done){
        var self = this;

        var fns = [
            this._getFile,
            this._importFormat,
            this._exportFormat,
            this._returnResult
        ];

        new runner(fns, this, function (err){
            done(err, self.result)
        })
    },

    /*
    runner functions
     */

    _importFormat: function(done){
        var self = this;

        switch(this.format){

            case "postman":
                new formatPostman()
                    .setFormatter(new formatter())
                    .import(_done);
                break;

        }

        function _done(err, res) {
            self.formatStructure = res;
            done();
        }
    },

    _exportFormat: function(done){
        var self = this;
        
        switch(exportType){
            case "apidoc":
                
                new formatApidoc()
                    .setData(this.formatStructure)
                    .export(_done);
                
                break;
        }

        function _done(err, res){
            self.formatStructure = res;
            done();
        }
    },

    _returnResult: function(done){
        this.result = this.formatStructure;
        done();
    }
};

module.exports = Docmaster;