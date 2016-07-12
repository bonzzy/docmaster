#!/usr/bin/env node

require("./global/all");
var CLASS = global.CLASS;
var docmaster = new CLASS.docmaster();

if (process.argv.length <= 2){
    console.log("Please set input and output file path!");
    process.exit(-1);
}

var defaultParams = {
    "-o": {description:"Output file", varName:"output"},
    "-i": {description:"Input file", varName:"input"},
    "-env": {description:"Postman environment", varName:"environment"},
    "-req": {description:"Call all api requests with defined methods (GET,POST,PUT,DEL) (default is '-req GET')", varName:"apiRequestMethods"},
    "--iformat": {description:"Input format", varName:"inputFormat"}
};
var params = {
    "environment": null,
    "inputFormat": "postman",
    "apiRequestMethods": "GET"
    // "apiRequestMethods": "GET,POST"
};

for (var i = 2; i<process.argv.length; i++){
    var param = process.argv[i];

    if (defaultParams.hasOwnProperty(param)){
        i = i+1;

        if (process.argv.length <= i){
            console.log("Missing parameter ("+param+")");
            process.exit(-1);
        }

        param = defaultParams[param].varName;

        params[param] = process.argv[i];
    }

}

// if (!params["input"] || !params["output"]){
//     console.log("Missing parameter!");
//     process.exit(-1);
// }

docmaster.setEnvironment(params.environment);
docmaster.setInputPath(params.input);
docmaster.setOutputPath(params.output);
docmaster.setFormat(params.inputFormat);
docmaster.setApiRequestMethods(params.apiRequestMethods);
docmaster.export(done);

function done(err, res){
    if (err){
        console.log("Error! - ", err);
    }else{
        console.log("");
        console.log("Finished!");
        // console.log("__________________");
        // console.log(res);
        // console.log("__________________");
        console.log("");
    }
}