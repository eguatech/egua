const Scanner = require("./scanner.js");
const Parser = require("./parser.js");
const Interpreter = require("./interpreter.js");
const tokenTypes = require("./tokenTypes.js");

class Egua {
    constructor() {
        this.hadError = false;
        this.hadRuntimeError = false;
    }

    run(code) {
        const scanner = new Scanner(code, this);
        const tokens = scanner.scan();

        const parser = new Parser(tokens, this);
        const expression = parser.parse();

        if (this.hadError === true) return;

        let interpreter = new Interpreter(this);
        interpreter.interpret(expression);
    }

    report(line, where, message) {
        console.error(`[Linha: ${line}] Erro${where}: ${message}`);
        this.hadError = true;
    }

    error(token, errorMessage) {
        if (token.type === tokenTypes.EOF) {
            this.report(token.line, "no fim", errorMessage);
        } else {
            this.report(token.line, " no '" + token.lexeme + "'", errorMessage);
        }
    }

    throw(line, error) {
        throw new Error(line + " " + error);
    }

    runtimeError(error) {
        if (error.token && error.token.line) {
            console.error(`Erro: [Linha: ${error.token.line}] ${error.message}`);
        } else {
            console.error(error);
        }
        this.hadRuntimeError = true;
    }
}

module.exports = Egua;