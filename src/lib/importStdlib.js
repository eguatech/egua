const fs = require("fs");
const path = require("path");

const loadModule = function(modulePath) {
    let absolutePath = path.resolve(__dirname, modulePath);
    return fs.readFileSync(absolutePath).toString();
};

module.exports = function(name) {
    switch (name) {
        case "os":
            return loadModule("./os.egua");
    }

    return null;
};