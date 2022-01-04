const tokenTypes = require("./tokenTypes.js");

const palavrasReservadas = {
    e: tokenTypes.E,
    em: tokenTypes.EM,
    classe: tokenTypes.CLASSE,
    senao: tokenTypes.SENAO,
    falso: tokenTypes.FALSO,
    para: tokenTypes.PARA,
    funcao: tokenTypes.FUNCAO,
    se: tokenTypes.SE,
    senaose: tokenTypes.SENAOSE,
    nulo: tokenTypes.NULO,
    ou: tokenTypes.OU,
    escreva: tokenTypes.ESCREVA,
    retorna: tokenTypes.RETORNA,
    super: tokenTypes.SUPER,
    isto: tokenTypes.ISTO,
    verdadeiro: tokenTypes.VERDADEIRO,
    var: tokenTypes.VAR,
    fazer: tokenTypes.FAZER,
    enquanto: tokenTypes.ENQUANTO,
    pausa: tokenTypes.PAUSA,
    continua: tokenTypes.CONTINUA,
    escolha: tokenTypes.ESCOLHA,
    caso: tokenTypes.CASO,
    padrao: tokenTypes.PADRAO,
    importar: tokenTypes.IMPORTAR,
    tente: tokenTypes.TENTE,
    pegue: tokenTypes.PEGUE,
    finalmente: tokenTypes.FINALMENTE,
    herda: tokenTypes.HERDA
};

class Token {
    constructor(tipo, lexeme, literal, linha) {
        this.tipo = tipo;
        this.lexeme = lexeme;
        this.literal = literal;
        this.linha = linha;
    }

    toString() {
        return this.tipo + " " + this.lexeme + " " + this.literal;
    }
}

/**
 * O Lexador é responsável por transformar o código em uma coleção de tokens de linguagem.
 * Cada token de linguagem é representado por um tipo, um lexema e informações da linha de código em que foi expresso.
 * Também é responsável por mapear as palavras reservadas da linguagem, que não podem ser usadas por outras
 * estruturas, tais como nomes de variáveis, funções, literais, classes e assim por diante.
 */
module.exports = class Lexer {
    constructor(codigo, Egua) {
        this.Egua = Egua;
        this.codigo = codigo;

        this.simbolos = [];

        this.inicio = 0;
        this.atual = 0;
        this.linha = 1;
    }

    eDigito(c) {
        return c >= "0" && c <= "9";
    }

    eAlfabeto(c) {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
    }

    eAlfabetoOuDigito(c) {
        return this.eDigito(c) || this.eAlfabeto(c);
    }

    endOfCode() {
        return this.atual >= this.codigo.length;
    }

    avancar() {
        this.atual += 1;
        return this.codigo[this.atual - 1];
    }

    adicionarSimbolo(tipo, literal = null) {
        const texto = this.codigo.substring(this.inicio, this.atual);
        this.simbolos.push(new Token(tipo, texto, literal, this.linha));
    }

    match(esperado) {
        if (this.endOfCode()) {
            return false;
        }

        if (this.codigo[this.atual] !== esperado) {
            return false;
        }

        this.atual += 1;
        return true;
    }

    peek() {
        if (this.endOfCode()) return "\0";
        return this.codigo.charAt(this.atual);
    }

    peekNext() {
        if (this.atual + 1 >= this.codigo.length) return "\0";
        return this.codigo.charAt(this.atual + 1);
    }

    voltar() {
        return this.codigo.charAt(this.atual - 1);
    }

    analisarTexto(stringChar = '"') {
        while (this.peek() !== stringChar && !this.endOfCode()) {
            if (this.peek() === "\n") this.linha = +1;
            this.avancar();
        }

        if (this.endOfCode()) {
            this.Egua.lexerError(
                this.linha,
                this.voltar(),
                "Texto não finalizado."
            );
            return;
        }

        this.avancar();

        let value = this.codigo.substring(this.inicio + 1, this.atual - 1);
        this.adicionarSimbolo(tokenTypes.STRING, value);
    }

    analisarNumero() {
        while (this.eDigito(this.peek())) {
            this.avancar();
        }

        if (this.peek() == "." && this.eDigito(this.peekNext())) {
            this.avancar();

            while (this.eDigito(this.peek())) {
                this.avancar();
            }
        }

        const fullNumber = this.codigo.substring(this.inicio, this.atual);
        this.adicionarSimbolo(tokenTypes.NUMBER, parseFloat(fullNumber));
    }

    identificarPalavraChave() {
        while (this.eAlfabetoOuDigito(this.peek())) {
            this.avancar();
        }

        const c = this.codigo.substring(this.inicio, this.atual);
        const tipo = c in palavrasReservadas ? palavrasReservadas[c] : tokenTypes.IDENTIFIER;

        this.adicionarSimbolo(tipo);
    }

    scanToken() {
        const char = this.avancar();

        switch (char) {
            case "[":
                this.adicionarSimbolo(tokenTypes.LEFT_SQUARE_BRACKET);
                break;
            case "]":
                this.adicionarSimbolo(tokenTypes.RIGHT_SQUARE_BRACKET);
                break;
            case "(":
                this.adicionarSimbolo(tokenTypes.LEFT_PAREN);
                break;
            case ")":
                this.adicionarSimbolo(tokenTypes.RIGHT_PAREN);
                break;
            case "{":
                this.adicionarSimbolo(tokenTypes.LEFT_BRACE);
                break;
            case "}":
                this.adicionarSimbolo(tokenTypes.RIGHT_BRACE);
                break;
            case ",":
                this.adicionarSimbolo(tokenTypes.COMMA);
                break;
            case ".":
                this.adicionarSimbolo(tokenTypes.DOT);
                break;
            case "-":
                if (this.match("=")) {
                    this.adicionarSimbolo(tokenTypes.MENOR_IGUAL);
                }
                this.adicionarSimbolo(tokenTypes.MINUS);
                break;
            case "+":
                if (this.match("=")) {
                    this.adicionarSimbolo(tokenTypes.MAIS_IGUAL);
                }
                this.adicionarSimbolo(tokenTypes.PLUS);
                break;
            case ":":
                this.adicionarSimbolo(tokenTypes.COLON);
                break;
            case ";":
                this.adicionarSimbolo(tokenTypes.SEMICOLON);
                break;
            case "%":
                this.adicionarSimbolo(tokenTypes.MODULUS);
                break;
            case "*":
                if (this.peek() === "*") {
                    this.avancar();
                    this.adicionarSimbolo(tokenTypes.STAR_STAR);
                    break;
                }
                this.adicionarSimbolo(tokenTypes.STAR);
                break;
            case "!":
                this.adicionarSimbolo(
                    this.match("=") ? tokenTypes.BANG_EQUAL : tokenTypes.BANG
                );
                break;
            case "=":
                this.adicionarSimbolo(
                    this.match("=") ? tokenTypes.EQUAL_EQUAL : tokenTypes.EQUAL
                );
                break;

            case "&":
                this.adicionarSimbolo(tokenTypes.BIT_AND);
                break;

            case "~":
                this.adicionarSimbolo(tokenTypes.BIT_NOT);
                break;

            case "|":
                this.adicionarSimbolo(tokenTypes.BIT_OR);
                break;

            case "^":
                this.adicionarSimbolo(tokenTypes.BIT_XOR);
                break;

            case "<":
                if (this.match("=")) {
                    this.adicionarSimbolo(tokenTypes.LESS_EQUAL);
                } else if (this.match("<")) {
                    this.adicionarSimbolo(tokenTypes.LESSER_LESSER);
                } else {
                    this.adicionarSimbolo(tokenTypes.LESS);
                }
                break;

            case ">":
                if (this.match("=")) {
                    this.adicionarSimbolo(tokenTypes.GREATER_EQUAL);
                } else if (this.match(">")) {
                    this.adicionarSimbolo(tokenTypes.GREATER_GREATER);
                } else {
                    this.adicionarSimbolo(tokenTypes.GREATER);
                }
                break;

            case "/":
                if (this.match("/")) {
                    while (this.peek() != "\n" && !this.endOfCode()) this.avancar();
                } else {
                    this.adicionarSimbolo(tokenTypes.SLASH);
                }
                break;

            // Esta sessão ignora espaços em branco na tokenização
            case " ":
            case "\r":
            case "\t":
                break;

            // tentativa de pulhar linha com \n que ainda não funciona
            case "\n":
                this.linha += 1;
                break;

            case '"':
                this.analisarTexto('"');
                break;

            case "'":
                this.analisarTexto("'");
                break;

            default:
                if (this.eDigito(char)) this.analisarNumero();
                else if (this.eAlfabeto(char)) this.identificarPalavraChave();
                else this.Egua.lexerError(this.linha, char, "Caractere inesperado.");
        }
    }

    scan() {
        while (!this.endOfCode()) {
            this.inicio = this.atual;
            this.scanToken();
        }

        this.simbolos.push(new Token(tokenTypes.EOF, "", null, this.linha));
        return this.simbolos;
    }
};