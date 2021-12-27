const RuntimeError = require("../errors.js").RuntimeError;

module.exports = class EguaInstance {
    constructor(creatorClass) {
        this.creatorClass = creatorClass;
        this.fields = {};
    }

    get(name) {
        if (this.fields.hasOwnProperty(name.lexeme)) {
            return this.fields[name.lexeme];
        }

        let method = this.creatorClass.findMethod(name.lexeme);
        if (method) return method.bind(this);

        throw new RuntimeError(name, "Método indefinido não recuperado.");
    }

    set(name, value) {
        this.fields[name.lexeme] = value;
    }

    toString() {
        return "<Objeto " + this.creatorClass.name + ">";
    }
};
