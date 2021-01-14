const { RuntimeError } = require("../errors");

module.exports.time = function () {
    return +new Date();
};

module.exports.segundos = function () {
    return new Date().getSeconds();
};

module.exports.minutos = function () {
    return new Date().getMinutes();
};

module.exports.horas = function () {
    return new Date().getHours();
};

module.exports.horario = function (timestamp) {
    let timeFormatted = timestamp !== null ? new Date(timestamp) : new Date();
    return timeFormatted;
};