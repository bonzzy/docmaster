/**
 * Created by tomislavfabeta on 10/05/16.
 */
var fs = require('fs');
var PATH = require('path');

var saveToGlobal = function (name, __path){
    var __path = PATH.resolve(__path);

    if (!global.hasOwnProperty(name)){
        global[name] = {};

    }

    this.folder = '';
    var self = this;

    var path = __path;

    var routes = fs.readdirSync(path);
    if (routes.length < 1){
        return ;
    }

    this.run = function (){
        routes.forEach(function (file) {

            if (fs.lstatSync(path+'/'+file).isDirectory()){

                if (file.indexOf('_') != 0){
                    var mapRunner = new runMapping(path+'/'+file);
                    mapRunner.folder = file+'/';
                    mapRunner.run();
                }

            }
            else if (file.indexOf('.js') != -1 && file.indexOf('.json') == -1 && file.indexOf('all') == -1) {
                var route = file.split('.')[0];
                var type = self.folder + route;
                global[name][route.toLowerCase()] = require(path + '/' + route);
            }
        });
    }

};


module.exports = saveToGlobal;