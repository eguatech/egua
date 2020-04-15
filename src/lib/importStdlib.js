const StandardFN = require("../structures/standardFn.js");

const loadModule = function (modulePath) {
    let moduleData = require(modulePath);

    let keys = Object.keys(moduleData);
    for (let i = 0; i < keys.length; i++) {
        let currentFunc = moduleData[keys[i]];

        moduleData[keys[i]] = new StandardFN(currentFunc.length, currentFunc);
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