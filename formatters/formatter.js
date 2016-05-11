/**
 * Created by tomislavfabeta on 10/05/16.
 */


var formatter = function(){
    this.collections = [];
};

formatter.prototype = {
    constructor: formatter,

    newCollection: function(name){
        var collection = new collection();
        
    }
};

module.exports = formatter;


function collection(){
    this.name;
    this.description;
    this.folders = [];


    this.folder = folder;

}

function folder(){
    this.name;
    this.description;
    this.lastRevision = 0;
    this.requests = [];
    this.request = request;
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
}