const Scanner = require("./scanner.js");
const Parser = require("./parser.js");
const tokenTypes = require("./tokenTypes.js");

class Egua {
    constructor() {
        this.hadError = false;
    }

    run(code) {
        const scanner = new Scanner(code, this);
        const tokens = scanner.scan();

        const parser = new Parser(tokens, this);
        const expression = parser.parse();

        if (this.hadError === true) return;
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
}

module.exports = Egua;