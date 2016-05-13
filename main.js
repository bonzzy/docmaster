/**
 * Created by tomislavfabeta on 10/05/16.
 */

require("./global/all");

var CLASS = global.CLASS;
var docmaster = new CLASS.docmaster();

docmaster.setEnviroment("rudi_local_zipt");
docmaster.setInputPath("/Users/tomislavfabeta/work/postmanDocumentation/Backup.postman_dump");
docmaster.setOutputPath("/Users/tomislavfabeta/work/postmanDocumentation/OutputDoc/");
docmaster.setFormat("postman");
docmaster.export(done);

function done(err, res){
    if (!err){
        console.log("DONE", err, res.collections["81838fb2-8e1d-25fe-ee3d-16a93429a5da"].folders["286539d9-3c5b-e104-d852-9d23528d31d1"])
    }

    console.log("Error!", err);
}