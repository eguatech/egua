const Callable = require("./callable.js");

module.exports = class EguaClass extends Callable {
    constructor(name, superclass, methods) {
        super();
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
    }

    findMethod(name) {
        if (this.methods.hasOwnProperty(name)) {
            return this.methods[name];
        }

        if (this.superclass !== null) {
            return this.superclass.findMethod(name);
        }

        return undefined;
    }

    toString() {
        return this.name;
    }

    arity() {
        let initializer = this.findMethod("construtor");
        return initializer ? initializer.arity() : 0;
    }

    call(interpreter, args) {
        let instance = new EguaInstance(this);

        let initializer = this.findMethod("construtor");
        if (initializer) {
            initializer.bind(instance).call(interpreter, args);
        }

        return instance;
    }
};