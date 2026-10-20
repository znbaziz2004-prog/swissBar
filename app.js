// cPanel Root Node.js Application Startup File
const path = require("path");
module.paths.push(path.resolve(__dirname, "backend/node_modules"));
const app = require("./backend/src/server.js");
module.exports = app;
