/**
 * Created by tomislavfabeta on 10/05/16.
 */

var HELPER = global.HELPER;
var FORMATTER = global.FORMATTER;

var runner = HELPER.runner;
var formatter = FORMATTER.formatter;
var path = require('path');
var fs = require("fs");

var formatPostmanCollection = function(){
    this.result = {};
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

    export: function(done){
        var self = this;
        var fns = [
            this._checkFormat,
            this._getApidocTemplate,
            this._apidocFormat,
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

    fileToJson: function(file, done){

        try {
            file = JSON.parse(file);
        }  catch (err){
            return done(err);
        }

        done(null, file);
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

    _getApidocTemplate: function(done){
        var self = this;
        var templatePath = path.resolve(__dirname , '../templates/apidoc/apidoc.js');

        this.getFile(templatePath, function(err, file){
            self.template = file;

            done(err);
        });

    },

    _apidocFormat: function(done){
        console.log(this.template)
        
        done();
    },

    _returnResult: function(done){
        this.formatter.nesto = "Nesto";
        this.result =  this.formatter.nesto;
        done();
    }
};

module.exports = formatPostmanCollection;

