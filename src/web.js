const Lexer = require("./lexer.js");
const Parser = require("./parser.js");
const Resolver = require("./resolver.js");
const Interpreter = require("./interpreter.js");
const tokenTypes = require("./tokenTypes.js");

module.exports.Egua = class Egua {
  constructor(filename) {
    this.filename = filename;

    this.hadError = false;
    this.hadRuntimeError = false;
  }

  runBlock(code) {
    const interpreter = new Interpreter(this, process.cwd());

    const lexer = new Lexer(code, this);
    const tokens = lexer.scan();

    if (this.hadError === true) return;

    const parser = new Parser(tokens, this);
    const statements = parser.parse();

    if (this.hadError === true) return;

    const resolver = new Resolver(interpreter, this);
    resolver.resolve(statements);

    if (this.hadError === true) return;

    interpreter.interpret(statements);
  }

  report(line, where, message) {
    if (this.filename)
      console.error(
        `[Arquivo: ${this.filename}] [Linha: ${line}] Erro${where}: ${message}`
      );
    else console.error(`[Linha: ${line}] Erro${where}: ${message}`);
    this.hadError = true;
  }

  error(token, errorMessage) {
    if (token.type === tokenTypes.EOF) {
      this.report(token.line, " no fim", errorMessage);
    } else {
      this.report(token.line, ` no '${token.lexeme}'`, errorMessage);
    }
  }

  lexerError(line, char, msg) {
    this.report(line, ` no '${char}'`, msg);
  }

  runtimeError(error) {
    let line = error.token.line;
    if (error.token && line) {
      if (this.filename)
        console.error(
          `Erro: [Arquivo: ${this.filename}] [Linha: ${error.token.line}] ${error.message}`
        );
      else console.error(`Erro: [Linha: ${error.token.line}] ${error.message}`);
    } else {
      console.error(error);
    }
    this.hadRuntimeError = true;
  }
};