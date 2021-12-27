const RuntimeError = require("../errors.js").RuntimeError,
    StandardFn = require("../structures/standardFn.js"),
    EguaModule = require("../structures/module.js");

const loadModule = function (moduleName, modulePath) {
    let moduleData;
    try {
        moduleData = require(modulePath);
    } catch (erro) {
        throw new RuntimeError(moduleName, `Biblioteca ${moduleName} não encontrada para importação.`);
    }
     
    let newModule = new EguaModule(moduleName);

    let keys = Object.keys(moduleData);
    for (let i = 0; i < keys.length; i++) {
        let currentItem = moduleData[keys[i]];

        if (typeof currentItem === "function") {
            newModule[keys[i]] = new StandardFn(currentItem.length, currentItem);
        } else {
            newModule[keys[i]] = currentItem;
        }
    }

    return newModule;
};

require("./tempo.js");
require("./eguamat.js");

module.exports = function (name) {
    switch (name) {
        case "tempo":
            return loadModule("tempo", "./tempo.js");
        case "eguamat":
            return loadModule("eguamat", "./eguamat.js");
        default:
            return loadModule(name, name);
    }
};