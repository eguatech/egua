const RuntimeError = require("./errors.js").RuntimeError;

module.exports = class Environment {
    constructor(enclosing) {
        this.enclosing = enclosing || null;
        this.values = {};
    }

    defineVar(varName, value) {
        this.values[varName] = value;
    }

    assignVarAt(distance, name, value) {
        this.ancestor(distance).values[name.lexeme] = value;
    }

    assignVar(name, value) {
        if (this.values[name.lexeme] !== undefined) {
            this.values[name.lexeme] = value;
            return;
        }

        if (this.enclosing != null) {
            this.enclosing.assignVar(name, value);
            return;
        }

        throw new RuntimeError(name, "Variável não definida '" + name.lexeme + "'.");
    }

    ancestor(distance) {
        let environment = this;
        for (let i = 0; i < distance; i++) {
            environment = environment.enclosing;
        }

        return environment;
    }

    getVarAt(distance, name) {
        return this.ancestor(distance).values[name];
    }

    getVar(token) {
        if (this.values[token.lexeme] !== undefined) {
            return this.values[token.lexeme];
        }

        if (this.enclosing !== null) return this.enclosing.getVar(token);

        throw new RuntimeError(token, "Variável não definida '" + token.lexeme + "'.");
    }
};