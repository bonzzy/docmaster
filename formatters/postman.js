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

    import: function(done){
        var self = this;
        var fns = [
            this._getPostmanDump,
            this._checkPostmanDumpData,
            this._formatPostmanDumpData,
            this._returnResult
        ];

        new runner(fns, this, function(err){
            done(err, self.result);
        });
    },

    /*
    Runner functions
     */

    _getPostmanDump: function(done){
        done();
    },

    _checkPostmanDumpData: function(done){
        done();
    },

    _formatPostmanDumpData: function(done){
        done();
    },

    _returnResult: function(done){
        this.formatter.nesto = "Nesto";
        this.result =  this.formatter.nesto;
        done();
    }
};

module.exports = formatPostmanCollection;
