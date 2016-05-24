/**
 * Created by tomislavfabeta on 10/05/16.
 */

var saveToGlobal = require("../helpers/saveToGlobal");

new saveToGlobal("HELPER", __dirname + "/../helpers/").run();
new saveToGlobal("FORMATTER", __dirname + "/../formatters/").run();
new saveToGlobal("CLASS", __dirname + "/../classes/").run();
