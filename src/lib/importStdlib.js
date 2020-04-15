const StandardFN = require("../structures/standardFn.js");

const loadModule = function (modulePath) {
    let moduleData = require(modulePath);

    let keys = Object.keys(moduleData);
    for (let i = 0; i < keys.length; i++) {
        moduleData[keys[i]] = new StandardFN(moduleData[keys[i]].length, moduleData[keys[i]]);
    }

    return moduleData;
};

module.exports = function (name) {
    switch (name) {
        case "os":
            return loadModule("./os.js");
    }

    return null;
};