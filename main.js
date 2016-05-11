/**
 * Created by tomislavfabeta on 10/05/16.
 */

require("./global/all");

var CLASS = global.CLASS;
var docmaster = new CLASS.docmaster();

docmaster.setInputPath("/Users/tomislavfabeta/work/postmanDocumentation/Zipt.json.postman_collection");
docmaster.setOutputPath("/Users/tomislavfabeta/work/postmanDocumentation/OutputDoc/");
docmaster.setFormat("postman");
docmaster.export(done);

function done(err, res){
    console.log("DONE", err, res)
}