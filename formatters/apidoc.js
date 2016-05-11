/**
 * Created by tomislavfabeta on 10/05/16.
 */

var HELPER = global.HELPER;
var runner = HELPER.runner;

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
    },

    export: function(done){
        var self = this;
        var fns = [
            this._checkFormat,
            this._apidocFormat,
            this._returnResult
        ];

        new runner(fns, this, function(err){
            done(err, self.result);
        });
    },

    /*
     Runner functions
     */

    _checkFormat: function(done){
        done();
    },

    _apidocFormat: function(done){
        done();
    },

    _returnResult: function(done){
        this.formatter.nesto = "Nesto";
        this.result =  this.formatter.nesto;
        done();
    }
};

module.exports = formatPostmanCollection;
