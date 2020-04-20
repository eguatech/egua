module.exports.time = function () {
    return +new Date();
};

module.exports.hora = function (timestamp) {
    let timeFormatted = timestamp !== null ? new Date(timestamp) : new Date();
    return timeFormatted;
};

module.exports.dormir = function (ms) {
    let now = new Date().getTime();
    while (new Date().getTime() < now + ms) { }
    return null;
};