const RuntimeError = require("./runtimeError.js");

module.exports = class Environment {
    constructor() {
        this.values = {};
    }

    defineVar(varName, value) {
        this.values[varName] = value;
    }

    assignVar(name, values) {
        if (this.values[name.lexeme] !== undefined) {
            this.values[name.lexeme] = value;
            return;
        }

        throw new RuntimeError(name, "Variável não definida '" + name.lexeme + "'.");
    }

    getVar(token) {
        if (this.values[token.lexeme] !== undefined) {
            return this.values[token.lexeme];
        }

        throw new RuntimeError(token, "Variável não definida '" + token.lexeme + "'.");
    }
};