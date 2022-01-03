const tokenTypes = require("./tokenTypes.js");
const Expr = require("./expr.js");
const Stmt = require("./stmt.js");

class ParserError extends Error { }

/**
 * O avaliador sintático (Parser) é responsável por transformar tokens do Lexador em estruturas de alto nível.
 * Essas estruturas de alto nível são as partes que executam lógica de programação de fato.
 */
module.exports = class Parser {
    constructor(tokens, Egua) {
        this.tokens = tokens;
        this.Egua = Egua;

        this.current = 0;
        this.loopDepth = 0;
    }

    synchronize() {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type === tokenTypes.SEMICOLON) return;

            switch (this.peek().type) {
                case tokenTypes.CLASSE:
                case tokenTypes.FUNCAO:
                case tokenTypes.VAR:
                case tokenTypes.PARA:
                case tokenTypes.SE:
                case tokenTypes.ENQUANTO:
                case tokenTypes.ESCREVA:
                case tokenTypes.RETORNA:
                    return;
            }

            this.advance();
        }
    }

    error(token, errorMessage) {
        this.Egua.error(token, errorMessage);
        return new ParserError();
    }

    consume(type, errorMessage) {
        if (this.check(type)) return this.advance();
        else throw this.error(this.peek(), errorMessage);
    }

    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    checkNext(type) {
        if (this.isAtEnd()) return false;
        return this.tokens[this.current + 1].type === type;
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    seek(positions) {
        return this.tokens[this.current + positions];
    }

    isAtEnd() {
        return this.peek().type === tokenTypes.EOF;
    }

    advance() {
        if (!this.isAtEnd()) this.current += 1;
        return this.previous();
    }

    match(...args) {
        for (let i = 0; i < args.length; i++) {
            let currentType = args[i];
            if (this.check(currentType)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    primary() {
        if (this.match(tokenTypes.SUPER)) {
            let keyword = this.previous();
            this.consume(tokenTypes.DOT, "Esperado '.' após 'super'.");
            let method = this.consume(
                tokenTypes.IDENTIFIER,
                "Esperado nome do método da superclasse."
            );
            return new Expr.Super(keyword, method);
        }
        if (this.match(tokenTypes.LEFT_SQUARE_BRACKET)) {
            let values = [];
            if (this.match(tokenTypes.RIGHT_SQUARE_BRACKET)) {
                return new Expr.Array([]);
            }
            while (!this.match(tokenTypes.RIGHT_SQUARE_BRACKET)) {
                let value = this.assignment();
                values.push(value);
                if (this.peek().type !== tokenTypes.RIGHT_SQUARE_BRACKET) {
                    this.consume(
                        tokenTypes.COMMA,
                        "Esperado vírgula antes da próxima expressão."
                    );
                }
            }
            return new Expr.Array(values);
        }
        if (this.match(tokenTypes.LEFT_BRACE)) {
            let keys = [];
            let values = [];
            if (this.match(tokenTypes.RIGHT_BRACE)) {
                return new Expr.Dictionary([], []);
            }
            while (!this.match(tokenTypes.RIGHT_BRACE)) {
                let key = this.assignment();
                this.consume(
                    tokenTypes.COLON,
                    "Esperado ':' entre chave e valor."
                );
                let value = this.assignment();

                keys.push(key);
                values.push(value);

                if (this.peek().type !== tokenTypes.RIGHT_BRACE) {
                    this.consume(
                        tokenTypes.COMMA,
                        "Esperado vígula antes da próxima expressão."
                    );
                }
            }
            return new Expr.Dictionary(keys, values);
        }
        if (this.match(tokenTypes.FUNCAO)) return this.functionBody("funcao");
        if (this.match(tokenTypes.FALSO)) return new Expr.Literal(false);
        if (this.match(tokenTypes.VERDADEIRO)) return new Expr.Literal(true);
        if (this.match(tokenTypes.NULO)) return new Expr.Literal(null);
        if (this.match(tokenTypes.ISTO)) return new Expr.Isto(this.previous());

        if (this.match(tokenTypes.IMPORTAR)) return this.importStatement();

        if (this.match(tokenTypes.NUMBER, tokenTypes.STRING)) {
            return new Expr.Literal(this.previous().literal);
        }

        if (this.match(tokenTypes.IDENTIFIER)) {
            return new Expr.Variable(this.previous());
        }

        if (this.match(tokenTypes.LEFT_PAREN)) {
            let expr = this.expression();
            this.consume(tokenTypes.RIGHT_PAREN, "Esperado ')' após a expressão.");
            return new Expr.Grouping(expr);
        }

        throw this.error(this.peek(), "Esperado expressão.");
    }

    finishCall(callee) {
        let args = [];
        if (!this.check(tokenTypes.RIGHT_PAREN)) {
            do {
                if (args.length >= 255) {
                    error(this.peek(), "Não pode haver mais de 255 argumentos.");
                }
                args.push(this.expression());
            } while (this.match(tokenTypes.COMMA));
        }

        let paren = this.consume(
            tokenTypes.RIGHT_PAREN,
            "Esperado ')' após os argumentos."
        );

        return new Expr.Call(callee, paren, args);
    }

    call() {
        let expr = this.primary();

        while (true) {
            if (this.match(tokenTypes.LEFT_PAREN)) {
                expr = this.finishCall(expr);
            } else if (this.match(tokenTypes.DOT)) {
                let name = this.consume(
                    tokenTypes.IDENTIFIER,
                    "Esperado nome do método após '.'."
                );
                expr = new Expr.Get(expr, name);
            } else if (this.match(tokenTypes.LEFT_SQUARE_BRACKET)) {
                let index = this.expression();
                let closeBracket = this.consume(
                    tokenTypes.RIGHT_SQUARE_BRACKET,
                    "Esperado ']' após escrita de index."
                );
                expr = new Expr.Subscript(expr, index, closeBracket);
            } else {
                break;
            }
        }

        return expr;
    }

    unary() {
        if (this.match(tokenTypes.BANG, tokenTypes.MINUS, tokenTypes.BIT_NOT)) {
            let operator = this.previous();
            let right = this.unary();
            return new Expr.Unary(operator, right);
        }

        return this.call();
    }

    exponent() {
        let expr = this.unary();

        while (this.match(tokenTypes.STAR_STAR)) {
            let operator = this.previous();
            let right = this.unary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    multiplication() {
        let expr = this.exponent();

        while (this.match(tokenTypes.SLASH, tokenTypes.STAR, tokenTypes.MODULUS)) {
            let operator = this.previous();
            let right = this.exponent();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    addition() {
        let expr = this.multiplication();

        while (this.match(tokenTypes.MINUS, tokenTypes.PLUS)) {
            let operator = this.previous();
            let right = this.multiplication();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    bitFill() {
        let expr = this.addition();

        while (this.match(tokenTypes.LESSER_LESSER, tokenTypes.GREATER_GREATER)) {
            let operator = this.previous();
            let right = this.addition();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    bitAnd() {
        let expr = this.bitFill();

        while (this.match(tokenTypes.BIT_AND)) {
            let operator = this.previous();
            let right = this.bitFill();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    bitOr() {
        let expr = this.bitAnd();

        while (this.match(tokenTypes.BIT_OR, tokenTypes.BIT_XOR)) {
            let operator = this.previous();
            let right = this.bitAnd();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    comparison() {
        let expr = this.bitOr();

        while (
            this.match(
                tokenTypes.GREATER,
                tokenTypes.GREATER_EQUAL,
                tokenTypes.LESS,
                tokenTypes.LESS_EQUAL
            )
        ) {
            let operator = this.previous();
            let right = this.bitOr();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    equality() {
        let expr = this.comparison();

        while (this.match(tokenTypes.BANG_EQUAL, tokenTypes.EQUAL_EQUAL)) {
            let operator = this.previous();
            let right = this.comparison();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    em() {
        let expr = this.equality();

        while (this.match(tokenTypes.EM)) {
            let operator = this.previous();
            let right = this.equality();
            expr = new Expr.Logical(expr, operator, right);
        }

        return expr;
    }

    e() {
        let expr = this.em();

        while (this.match(tokenTypes.E)) {
            let operator = this.previous();
            let right = this.em();
            expr = new Expr.Logical(expr, operator, right);
        }

        return expr;
    }

    ou() {
        let expr = this.e();

        while (this.match(tokenTypes.OU)) {
            let operator = this.previous();
            let right = this.e();
            expr = new Expr.Logical(expr, operator, right);
        }

        return expr;
    }

    assignment() {
        let expr = this.ou();

        if (this.match(tokenTypes.EQUAL)) {
            let equals = this.previous();
            let value = this.assignment();

            if (expr instanceof Expr.Variable) {
                let name = expr.name;
                return new Expr.Assign(name, value);
            } else if (expr instanceof Expr.Get) {
                let get = expr;
                return new Expr.Set(get.object, get.name, value);
            } else if (expr instanceof Expr.Subscript) {
                return new Expr.Assignsubscript(expr.callee, expr.index, value);
            }
            this.error(equals, "Tarefa de atribuição inválida");
        }

        return expr;
    }

    expression() {
        return this.assignment();
    }

    printStatement() {
        this.consume(
            tokenTypes.LEFT_PAREN,
            "Esperado '(' antes dos valores em escreva."
        );

        let value = this.expression();

        this.consume(
            tokenTypes.RIGHT_PAREN,
            "Esperado ')' após os valores em escreva."
        );
        this.consume(tokenTypes.SEMICOLON, "Esperado ';' após o valor.");

        return new Stmt.Escreva(value);
    }

    expressionStatement() {
        let expr = this.expression();
        this.consume(tokenTypes.SEMICOLON, "Esperado ';' após expressão.");
        return new Stmt.Expression(expr);
    }

    block() {
        let statements = [];

        while (!this.check(tokenTypes.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume(tokenTypes.RIGHT_BRACE, "Esperado '}' após o bloco.");
        return statements;
    }

    ifStatement() {
        this.consume(tokenTypes.LEFT_PAREN, "Esperado '(' após 'se'.");
        let condition = this.expression();
        this.consume(tokenTypes.RIGHT_PAREN, "Esperado ')' após condição do se.");

        let thenBranch = this.statement();

        let elifBranches = [];
        while (this.match(tokenTypes.SENAOSE)) {
            this.consume(tokenTypes.LEFT_PAREN, "Esperado '(' após 'senaose'.");
            let elifCondition = this.expression();
            this.consume(
                tokenTypes.RIGHT_PAREN,
                "Esperado ')' apóes codição do 'senaose."
            );

            let branch = this.statement();

            elifBranches.push({
                condition: elifCondition,
                branch
            });
        }

        let elseBranch = null;
        if (this.match(tokenTypes.SENAO)) {
            elseBranch = this.statement();
        }

        return new Stmt.Se(condition, thenBranch, elifBranches, elseBranch);
    }

    whileStatement() {
        try {
            this.loopDepth += 1;

            this.consume(tokenTypes.LEFT_PAREN, "Esperado '(' após 'enquanto'.");
            let condition = this.expression();
            this.consume(tokenTypes.RIGHT_PAREN, "Esperado ')' após condicional.");
            let body = this.statement();

            return new Stmt.Enquanto(condition, body);
        } finally {
            this.loopDepth -= 1;
        }
    }

    forStatement() {
        try {
            this.loopDepth += 1;

            this.consume(tokenTypes.LEFT_PAREN, "Esperado '(' após 'para'.");

            let initializer;
            if (this.match(tokenTypes.SEMICOLON)) {
                initializer = null;
            } else if (this.match(tokenTypes.VAR)) {
                initializer = this.varDeclaration();
            } else {
                initializer = this.expressionStatement();
            }

            let condition = null;
            if (!this.check(tokenTypes.SEMICOLON)) {
                condition = this.expression();
            }

            this.consume(
                tokenTypes.SEMICOLON,
                "Esperado ';' após valores da condicional"
            );

            let increment = null;
            if (!this.check(tokenTypes.RIGHT_PAREN)) {
                increment = this.expression();
            }

            this.consume(tokenTypes.RIGHT_PAREN, "Esperado ')' após cláusulas");

            let body = this.statement();

            return new Stmt.Para(initializer, condition, increment, body);
        } finally {
            this.loopDepth -= 1;
        }
    }

    breakStatement() {
        if (this.loopDepth < 1) {
            this.error(this.previous(), "'pausa' deve estar dentro de um loop.");
        }

        this.consume(tokenTypes.SEMICOLON, "Esperado ';' após 'pausa'.");
        return new Stmt.Pausa();
    }

    continueStatement() {
        if (this.loopDepth < 1) {
            this.error(this.previous(), "'continua' precisa estar em um laço de repetição.");
        }

        this.consume(tokenTypes.SEMICOLON, "Esperado ';' após 'continua'.");
        return new Stmt.Continua();
    }

    returnStatement() {
        let keyword = this.previous();
        let value = null;

        if (!this.check(tokenTypes.SEMICOLON)) {
            value = this.expression();
        }

        this.consume(tokenTypes.SEMICOLON, "Esperado ';' após o retorno.");
        return new Stmt.Retorna(keyword, value);
    }

    switchStatement() {
        try {
            this.loopDepth += 1;

            this.consume(
                tokenTypes.LEFT_PAREN,
                "Esperado '{' após 'escolha'."
            );
            let condition = this.expression();
            this.consume(
                tokenTypes.RIGHT_PAREN,
                "Esperado '}' após a condição de 'escolha'."
            );
            this.consume(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' antes do escopo do 'escolha'."
            );

            let branches = [];
            let defaultBranch = null;
            while (!this.match(tokenTypes.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.match(tokenTypes.CASO)) {
                    let branchConditions = [this.expression()];
                    this.consume(
                        tokenTypes.COLON,
                        "Esperado ':' após o 'caso'."
                    );

                    while (this.check(tokenTypes.CASO)) {
                        this.consume(tokenTypes.CASO, null);
                        branchConditions.push(this.expression());
                        this.consume(
                            tokenTypes.COLON,
                            "Esperado ':' após declaração do 'caso'."
                        );
                    }

                    let stmts = [];
                    do {
                        stmts.push(this.statement());
                    } while (
                        !this.check(tokenTypes.CASO) &&
                        !this.check(tokenTypes.PADRAO) &&
                        !this.check(tokenTypes.RIGHT_BRACE)
                    );

                    branches.push({
                        conditions: branchConditions,
                        stmts
                    });
                } else if (this.match(tokenTypes.PADRAO)) {
                    if (defaultBranch !== null)
                        throw new ParserError(
                            "Você só pode ter um 'padrao' em cada declaração de 'escolha'."
                        );

                    this.consume(
                        tokenTypes.COLON,
                        "Esperado ':' após declaração do 'padrao'."
                    );

                    let stmts = [];
                    do {
                        stmts.push(this.statement());
                    } while (
                        !this.check(tokenTypes.CASO) &&
                        !this.check(tokenTypes.PADRAO) &&
                        !this.check(tokenTypes.RIGHT_BRACE)
                    );

                    defaultBranch = {
                        stmts
                    };
                }
            }

            return new Stmt.Escolha(condition, branches, defaultBranch);
        } finally {
            this.loopDepth -= 1;
        }
    }

    importStatement() {
        this.consume(tokenTypes.LEFT_PAREN, "Esperado '(' após declaração.");

        let path = this.expression();

        let closeBracket = this.consume(
            tokenTypes.RIGHT_PAREN,
            "Esperado ')' após declaração."
        );

        return new Stmt.Importar(path, closeBracket);
    }

    tryStatement() {
        this.consume(tokenTypes.LEFT_BRACE, "Esperado '{' após a declaração 'tente'.");

        let tryBlock = this.block();

        let catchBlock = null;
        if (this.match(tokenTypes.PEGUE)) {
            this.consume(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' após a declaração 'pegue'."
            );

            catchBlock = this.block();
        }

        let elseBlock = null;
        if (this.match(tokenTypes.SENAO)) {
            this.consume(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' após a declaração 'pegue'."
            );

            elseBlock = this.block();
        }

        let finallyBlock = null;
        if (this.match(tokenTypes.FINALMENTE)) {
            this.consume(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' após a declaração 'pegue'."
            );

            finallyBlock = this.block();
        }

        return new Stmt.Tente(tryBlock, catchBlock, elseBlock, finallyBlock);
    }

    doStatement() {
        try {
            this.loopDepth += 1;

            let doBranch = this.statement();

            this.consume(
                tokenTypes.ENQUANTO,
                "Esperado declaração do 'enquanto' após o escopo do 'fazer'."
            );
            this.consume(
                tokenTypes.LEFT_PAREN,
                "Esperado '(' após declaração 'enquanto'."
            );

            let whileCondition = this.expression();

            this.consume(
                tokenTypes.RIGHT_PAREN,
                "Esperado ')' após declaração do 'enquanto'."
            );

            return new Stmt.Fazer(doBranch, whileCondition);
        } finally {
            this.loopDepth -= 1;
        }
    }

    statement() {
        if (this.match(tokenTypes.FAZER)) return this.doStatement();
        if (this.match(tokenTypes.TENTE)) return this.tryStatement();
        if (this.match(tokenTypes.ESCOLHA)) return this.switchStatement();
        if (this.match(tokenTypes.RETORNA)) return this.returnStatement();
        if (this.match(tokenTypes.CONTINUA)) return this.continueStatement();
        if (this.match(tokenTypes.PAUSA)) return this.breakStatement();
        if (this.match(tokenTypes.PARA)) return this.forStatement();
        if (this.match(tokenTypes.ENQUANTO)) return this.whileStatement();
        if (this.match(tokenTypes.SE)) return this.ifStatement();
        if (this.match(tokenTypes.ESCREVA)) return this.printStatement();
        if (this.match(tokenTypes.LEFT_BRACE)) return new Stmt.Block(this.block());

        return this.expressionStatement();
    }

    varDeclaration() {
        let name = this.consume(tokenTypes.IDENTIFIER, "Esperado nome de variável.");
        let initializer = null;
        if (this.match(tokenTypes.EQUAL)) {
            initializer = this.expression();
        }

        this.consume(
            tokenTypes.SEMICOLON,
            "Esperado ';' após a declaração da variável."
        );
        return new Stmt.Var(name, initializer);
    }

    function(kind) {
        let name = this.consume(tokenTypes.IDENTIFIER, `Esperado nome ${kind}.`);
        return new Stmt.Funcao(name, this.functionBody(kind));
    }

    functionBody(kind) {
        this.consume(tokenTypes.LEFT_PAREN, `Esperado '(' após o nome ${kind}.`);

        let parameters = [];
        if (!this.check(tokenTypes.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Não pode haver mais de 255 parâmetros");
                }

                let paramObj = {};

                if (this.peek().type === tokenTypes.STAR) {
                    this.consume(tokenTypes.STAR, null);
                    paramObj["type"] = "wildcard";
                } else {
                    paramObj["type"] = "standard";
                }

                paramObj['name'] = this.consume(
                    tokenTypes.IDENTIFIER,
                    "Esperado nome do parâmetro."
                );

                if (this.match(tokenTypes.EQUAL)) {
                    paramObj["default"] = this.primary();
                }

                parameters.push(paramObj);

                if (paramObj["type"] === "wildcard") break;
            } while (this.match(tokenTypes.COMMA));
        }

        this.consume(tokenTypes.RIGHT_PAREN, "Esperado ')' após parâmetros.");
        this.consume(tokenTypes.LEFT_BRACE, `Esperado '{' antes do escopo do ${kind}.`);

        let body = this.block();

        return new Expr.Funcao(parameters, body);
    }

    classDeclaration() {
        let name = this.consume(tokenTypes.IDENTIFIER, "Esperado nome da classe.");

        let superclass = null;
        if (this.match(tokenTypes.HERDA)) {
            this.consume(tokenTypes.IDENTIFIER, "Esperado nome da superclasse.");
            superclass = new Expr.Variable(this.previous());
        }

        this.consume(tokenTypes.LEFT_BRACE, "Esperado '{' antes do escopo da classe.");

        let methods = [];
        while (!this.check(tokenTypes.RIGHT_BRACE) && !this.isAtEnd()) {
            methods.push(this.function("método"));
        }

        this.consume(tokenTypes.RIGHT_BRACE, "Esperado '}' após o escopo da classe.");
        return new Stmt.Classe(name, superclass, methods);
    }

    declaration() {
        try {
            if (
                this.check(tokenTypes.FUNCAO) &&
                this.checkNext(tokenTypes.IDENTIFIER)
            ) {
                this.consume(tokenTypes.FUNCAO, null);
                return this.function("funcao");
            }
            if (this.match(tokenTypes.VAR)) return this.varDeclaration();
            if (this.match(tokenTypes.CLASSE)) return this.classDeclaration();

            return this.statement();
        } catch (error) {
            this.synchronize();
            return null;
        }
    }

    parse() {
        let statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }

        return statements
    }
};
