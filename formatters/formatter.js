/**
 * Created by tomislavfabeta on 10/05/16.
 */


var formatter = function(){
    this.type = "Docmaster_Formatter";
    this.collections = {};
    this.enviroments = {};
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

    newEnviroment: function(){
        return new enviroment();
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
}

function enviroment(){
    this.name;
    this.description;
    this.values = {};
}