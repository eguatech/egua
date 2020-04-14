const Lexer = require("./lexer.js");
const Parser = require("./parser.js");
const Resolver = require("./resolver.js");
const Interpreter = require("./interpreter.js");
const tokenTypes = require("./tokenTypes.js");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

module.exports.Egua = class Egua {
    constructor() {
        this.hadError = false;
        this.hadRuntimeError = false;
    }

    runPrompt() {
        const interpreter = new Interpreter(this, process.cwd(), undefined);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: ">>> "
        });

        rl.prompt();

        rl.on("line", line => {
            this.hadError = false;
            this.hadRuntimeError = false;

            this.run(line, interpreter);
            rl.prompt();
        });
    }

    runfile(filename) {
        let justFileName = path.basename(filename);
        const interpreter = new Interpreter(this, process.cwd(), justFileName);

        const fileData = fs.readFileSync(filename).toString();
        this.run(fileData, interpreter);

        if (this.hadError) process.exit(65);
        if (this.hadRuntimeError) process.exit(70);
    }

    run(code, interpreter) {
        const lexer = new Lexer(code, this);
        const tokens = lexer.scan();

        const parser = new Parser(tokens, this);
        const statements = parser.parse();

        if (this.hadError === true) return;

        const resolver = new Resolver(interpreter, this);
        resolver.resolve(statements);

        if (this.hadError === true) return;

        interpreter.interpret(statements);
    }

    report(line, where, message) {
        console.error(`[Linha: ${line}] Erro${where}: ${message}`);
        this.hadError = true;
    }

    error(token, errorMessage) {
        if (token.type === tokenTypes.EOF) {
            this.report(token.line, " no final", errorMessage);
        } else {
            this.report(token.line, " no '" + token.lexeme + "'", errorMessage);
        }
    }

    throw(line, error) {
        throw new Error(`Line ${line}. ${error}`);
    }

    runtimeError(error, fileName) {
        let line = error.token.line;
        if (error.token && line) {
            if (fileName)
                console.error(
                    `Erro: [Arquivo: ${fileName}] [Linha: ${error.token.line}] ${error.message}`
                );
            else console.error(`Erro: [Linha: ${error.token.line}] ${error.message}`);
        } else {
            console.error(error);
        }
        this.hadRuntimeError = true;
    }
};