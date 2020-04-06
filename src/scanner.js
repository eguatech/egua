const  tokenTypes = require("./tokenTypes.js");

const reservedWords = {
    e: tokenTypes.E,
    classe: tokenTypes.CLASSE,
    senao: tokenTypes.SENAO,
    falso: tokenTypes.FALSO,
    para: tokenTypes.PARA,
    funcao: tokenTypes.FUNCAO,
    se: tokenTypes.SE,
    nil: tokenTypes.NIL,
    ou: tokenTypes.OU,
    escreva: tokenTypes.ESCREVA,
    retorna: tokenTypes.RETORNA,
    super: tokenTypes.SUPER,
    isto: tokenTypes.ISTO,
    verdadeiro: tokenTypes.VERDADEIRO,
    var: tokenTypes.VAR,
    enquanto: tokenTypes.ENQUANTO
};

class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString() {
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}

class Scanner {
    constructor(code, Egua) {
        this.Egua = Egua;
        this.code = code;

        this.tokens = [];

        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    isDigit(c) {
        return c >= "0" && c <= "9";
    }

    isAlpha(c) {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
    }

    isAlphaNumeric(c) {
        return this.isDigit(c) || this.isAlpha(c);
    }

    endOfCode() {
        return this.current >= this.code.length;
    }

    advance() {
        this.current += 1;
        return this.code[this.current - 1];
    }

    addToken(type, literal = null) {
        const text = this.code.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    match(expected) {
        if (this.endOfCode()) {
            return false;
        }

        if (this.code[this.current] !== expected) {
            return false;
        }

        this.current += 1;
        return true;
    }

    peek() {
        if (this.endOfCode()) return "\0";
        return this.code.charAt(this.current);
    }

    peekNext() {
        if (this.current + 1 >= this.code.length) return "\0";
        return this.code.charAt(this.current + 1);
    }

    parseString() {
        while (this.peek() != '"' && !this.endOfCode()) {
            if (this.peek() == "\n") this.line = +1;
            this.advance();
        }

        if (this.endOfCode()) {
            this.Egua.throw(this.line, "Unterminated string.");
            return;
        }

        this.advance();

        let value = this.code.substring(this.start + 1, this.current - 1);
        this.addToken(tokenTypes.STRING, value);
    }

    parseNumber() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }

        if (this.peek() == "." && this.isDigit(this.peekNext())) {
            this.advance();

            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }

        const fullNumber = this.code.substring(this.start, this.current);
        this.addToken(tokenTypes.NUMBER, parseFloat(fullNumber));
    }

    identifyKeyword() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const c = this.code.substring(this.start, this.current);
        const type = c in reservedWords ? reservedWords[c] : tokenTypes.IDENTIFIER;

        this.addToken(type);
    }

    scanToken() {
        const c = this.advance();

        switch (c) {
            case "(":
                this.addToken(tokenTypes.LEFT_PAREN);
                break;
            case ")":
                this.addToken(tokenTypes.RIGHT_PAREN);
                break;
            case "{":
                this.addToken(tokenTypes.LEFT_BRACE);
                break;
            case "}":
                this.addToken(tokenTypes.RIGHT_BRACE);
                break;
            case ",":
                this.addToken(tokenTypes.COMMA);
                break;
            case ".":
                this.addToken(tokenTypes.DOT);
                break;
            case "-":
                this.addToken(tokenTypes.MINUS);
                break;
            case "+":
                this.addToken(tokenTypes.PLUS);
                break;
            case ";":
                this.addToken(tokenTypes.SEMICOLON);
                break;
            case "*":
                this.addToken(tokenTypes.STAR);
                break;
            case "!":
                this.addToken(this.match("=") ? tokenTypes.ANG_EQUAL : tokenTypes.BANG);
                break;
            case "=":
                this.addToken(
                    this.match("=") ? tokenTypes.EQUAL_EQUAL : tokenTypes.EQUAL
                );
                break;
            case "<":
                this.addToken(
                    this.match("=") ? tokenTypes.LESS_EQUAL : tokenTypes.LESS
                );
                break;
            case ">":
                this.addToken(
                    this.match("=") ? tokenTypes.GREATER_EQUAL : tokenTypes.GREATER
                );
                break;

            case "/":
                if (this.match("/")) {
                    while (this.peek() != "\n" && !this.endOfCode()) this.advance();
                } else {
                    this.addToken(SLASH);
                }
                break;

            case " ":
            case "\r":
            case "\t":
                // Ignore whitespace.
                break;

            case "\n":
                this.line += 1;
                break;

            case '"':
                this.parseString();
                break;

            default:
                if (this.isDigit(c)) this.parseNumber();
                else if (this.isAlpha(c)) this.identifyKeyword();
                else this.Egua.throw(this.line, "Unexpected character.");
        }
    }

    scan() {
        while (!this.endOfCode()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(tokenTypes.EOF, "", null, this.line));
        return this.tokens;
    }
}

module.exports = Scanner;