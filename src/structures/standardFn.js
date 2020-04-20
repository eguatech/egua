const Callable = require("./callable.js");

module.exports = class StandardFn extends Callable {
    constructor(arityValue, func) {
        super();
        this.arityValue = arityValue;
        this.func = func;
    }

    call(interpreter, args, token) {
        this.token = token;
        return this.func.apply(this, args);
    }

    toString() {
        return "<função>";
    }
};