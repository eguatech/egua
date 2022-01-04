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

        this.atual = 0;
        this.ciclos = 0;
    }

    sincronizar() {
        this.avancar();

        while (!this.isAtEnd()) {
            if (this.voltar().type === tokenTypes.SEMICOLON) return;

            switch (this.peek().tipo) {
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

            this.avancar();
        }
    }

    error(token, errorMessage) {
        this.Egua.error(token, errorMessage);
        return new ParserError();
    }

    consumir(tipo, errorMessage) {
        if (this.verificar(tipo)) return this.avancar();
        else throw this.error(this.peek(), errorMessage);
    }

    verificar(tipo) {
        if (this.isAtEnd()) return false;
        return this.peek().tipo === tipo;
    }

    verificarProximo(tipo) {
        if (this.isAtEnd()) return false;
        return this.tokens[this.atual + 1].tipo === tipo;
    }

    peek() {
        return this.tokens[this.atual];
    }

    voltar() {
        return this.tokens[this.atual - 1];
    }

    seek(posicao) {
        return this.tokens[this.atual + posicao];
    }

    isAtEnd() {
        return this.peek().tipo === tokenTypes.EOF;
    }

    avancar() {
        if (!this.isAtEnd()) this.atual += 1;
        return this.voltar();
    }

    match(...args) {
        for (let i = 0; i < args.length; i++) {
            let currentType = args[i];
            if (this.verificar(currentType)) {
                this.avancar();
                return true;
            }
        }

        return false;
    }

    primario() {
        if (this.match(tokenTypes.SUPER)) {
            let keyword = this.voltar();
            this.consumir(tokenTypes.DOT, "Esperado '.' após 'super'.");
            let method = this.consumir(
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
                let value = this.atribuir();
                values.push(value);
                if (this.peek().tipo !== tokenTypes.RIGHT_SQUARE_BRACKET) {
                    this.consumir(
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
                let key = this.atribuir();
                this.consumir(
                    tokenTypes.COLON,
                    "Esperado ':' entre chave e valor."
                );
                let value = this.atribuir();

                keys.push(key);
                values.push(value);

                if (this.peek().tipo !== tokenTypes.RIGHT_BRACE) {
                    this.consumir(
                        tokenTypes.COMMA,
                        "Esperado vígula antes da próxima expressão."
                    );
                }
            }
            return new Expr.Dictionary(keys, values);
        }
        if (this.match(tokenTypes.FUNCAO)) return this.corpoDaFuncao("funcao");
        if (this.match(tokenTypes.FALSO)) return new Expr.Literal(false);
        if (this.match(tokenTypes.VERDADEIRO)) return new Expr.Literal(true);
        if (this.match(tokenTypes.NULO)) return new Expr.Literal(null);
        if (this.match(tokenTypes.ISTO)) return new Expr.Isto(this.voltar());

        if (this.match(tokenTypes.IMPORTAR)) return this.importStatement();

        if (this.match(tokenTypes.NUMBER, tokenTypes.STRING)) {
            return new Expr.Literal(this.voltar().literal);
        }

        if (this.match(tokenTypes.IDENTIFIER)) {
            return new Expr.Variable(this.voltar());
        }

        if (this.match(tokenTypes.LEFT_PAREN)) {
            let expr = this.expression();
            this.consumir(tokenTypes.RIGHT_PAREN, "Esperado ')' após a expressão.");
            return new Expr.Grouping(expr);
        }

        throw this.error(this.peek(), "Esperado expressão.");
    }

    finalizarChamada(callee) {
        let argumentos = [];
        if (!this.verificar(tokenTypes.RIGHT_PAREN)) {
            do {
                if (argumentos.length >= 255) {
                    error(this.peek(), "Não pode haver mais de 255 argumentos.");
                }
                argumentos.push(this.expression());
            } while (this.match(tokenTypes.COMMA));
        }

        let parenteseDireito = this.consumir(
            tokenTypes.RIGHT_PAREN,
            "Esperado ')' após os argumentos."
        );

        return new Expr.Call(callee, parenteseDireito, argumentos);
    }

    chamar() {
        let expr = this.primario();

        while (true) {
            if (this.match(tokenTypes.LEFT_PAREN)) {
                expr = this.finalizarChamada(expr);
            } else if (this.match(tokenTypes.DOT)) {
                let name = this.consumir(
                    tokenTypes.IDENTIFIER,
                    "Esperado nome do método após '.'."
                );
                expr = new Expr.Get(expr, name);
            } else if (this.match(tokenTypes.LEFT_SQUARE_BRACKET)) {
                let index = this.expression();
                let closeBracket = this.consumir(
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

    unario() {
        if (this.match(tokenTypes.BANG, tokenTypes.MINUS, tokenTypes.BIT_NOT)) {
            const operador = this.voltar();
            const direito = this.unario();
            return new Expr.Unary(operador, direito);
        }

        return this.chamar();
    }

    exponent() {
        let expr = this.unario();

        while (this.match(tokenTypes.STAR_STAR)) {
            const operador = this.voltar();
            const direito = this.unario();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    multiplicar() {
        let expr = this.exponent();

        while (this.match(tokenTypes.SLASH, tokenTypes.STAR, tokenTypes.MODULUS)) {
            const operador = this.voltar();
            const direito = this.exponent();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    adicionar() {
        let expr = this.multiplicar();

        while (this.match(tokenTypes.MINUS, tokenTypes.PLUS)) {
            const operador = this.voltar();
            const direito = this.multiplicar();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    bitFill() {
        let expr = this.adicionar();

        while (this.match(tokenTypes.LESSER_LESSER, tokenTypes.GREATER_GREATER)) {
            const operador = this.voltar();
            const direito = this.adicionar();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    bitE() {
        let expr = this.bitFill();

        while (this.match(tokenTypes.BIT_AND)) {
            const operador = this.voltar();
            const direito = this.bitFill();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    bitOu() {
        let expr = this.bitE();

        while (this.match(tokenTypes.BIT_OR, tokenTypes.BIT_XOR)) {
            const operador = this.voltar();
            const direito = this.bitE();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    comparar() {
        let expr = this.bitOu();

        while (
            this.match(
                tokenTypes.GREATER,
                tokenTypes.GREATER_EQUAL,
                tokenTypes.LESS,
                tokenTypes.LESS_EQUAL
            )
        ) {
            const operador = this.voltar();
            const direito = this.bitOu();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    equality() {
        let expr = this.comparar();

        while (this.match(tokenTypes.BANG_EQUAL, tokenTypes.EQUAL_EQUAL)) {
            const operador = this.voltar();
            const direito = this.comparar();
            expr = new Expr.Binary(expr, operador, direito);
        }

        return expr;
    }

    em() {
        let expr = this.equality();

        while (this.match(tokenTypes.EM)) {
            const operador = this.voltar();
            const direito = this.equality();
            expr = new Expr.Logical(expr, operador, direito);
        }

        return expr;
    }

    e() {
        let expr = this.em();

        while (this.match(tokenTypes.E)) {
            const operador = this.voltar();
            const direito = this.em();
            expr = new Expr.Logical(expr, operador, direito);
        }

        return expr;
    }

    ou() {
        let expr = this.e();

        while (this.match(tokenTypes.OU)) {
            const operador = this.voltar();
            const direito = this.e();
            expr = new Expr.Logical(expr, operador, direito);
        }

        return expr;
    }

    atribuir() {
        const expr = this.ou();

        if (this.match(tokenTypes.EQUAL) || this.match(tokenTypes.MAIS_IGUAL)) {
            const igual = this.voltar();
            const valor = this.atribuir();

            if (expr instanceof Expr.Variable) {
                const nome = expr.name;
                return new Expr.Assign(nome, valor);
            } else if (expr instanceof Expr.Get) {
                const get = expr;
                return new Expr.Set(get.object, get.name, valor);
            } else if (expr instanceof Expr.Subscript) {
                return new Expr.Assignsubscript(expr.callee, expr.index, valor);
            }
            this.error(igual, "Tarefa de atribuição inválida");
        }

        return expr;
    }

    expression() {
        return this.atribuir();
    }

    declaracaoMostrar() {
        this.consumir(
            tokenTypes.LEFT_PAREN,
            "Esperado '(' antes dos valores em escreva."
        );

        const valor = this.expression();

        this.consumir(
            tokenTypes.RIGHT_PAREN,
            "Esperado ')' após os valores em escreva."
        );
        this.consumir(tokenTypes.SEMICOLON, "Esperado ';' após o valor.");

        return new Stmt.Escreva(valor);
    }

    expressionStatement() {
        const expr = this.expression();
        this.consumir(tokenTypes.SEMICOLON, "Esperado ';' após expressão.");
        return new Stmt.Expression(expr);
    }

    block() {
        const declaracoes = [];

        while (!this.verificar(tokenTypes.RIGHT_BRACE) && !this.isAtEnd()) {
            declaracoes.push(this.declaracao());
        }

        this.consumir(tokenTypes.RIGHT_BRACE, "Esperado '}' após o bloco.");
        return declaracoes;
    }

    declaracaoSe() {
        this.consumir(tokenTypes.LEFT_PAREN, "Esperado '(' após 'se'.");
        let condition = this.expression();
        this.consumir(tokenTypes.RIGHT_PAREN, "Esperado ')' após condição do se.");

        let thenBranch = this.statement();

        let elifBranches = [];
        while (this.match(tokenTypes.SENAOSE)) {
            this.consumir(tokenTypes.LEFT_PAREN, "Esperado '(' após 'senaose'.");
            let elifCondition = this.expression();
            this.consumir(
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
            this.ciclos += 1;

            this.consumir(tokenTypes.LEFT_PAREN, "Esperado '(' após 'enquanto'.");
            const condicao = this.expression();
            this.consumir(tokenTypes.RIGHT_PAREN, "Esperado ')' após condicional.");
            const corpo = this.statement();

            return new Stmt.Enquanto(condicao, corpo);
        } finally {
            this.ciclos -= 1;
        }
    }

    forStatement() {
        try {
            this.ciclos += 1;

            this.consumir(tokenTypes.LEFT_PAREN, "Esperado '(' após 'para'.");

            let initializer;
            if (this.match(tokenTypes.SEMICOLON)) {
                initializer = null;
            } else if (this.match(tokenTypes.VAR)) {
                initializer = this.declaracaoDeVariavel();
            } else {
                initializer = this.expressionStatement();
            }

            let condition = null;
            if (!this.verificar(tokenTypes.SEMICOLON)) {
                condition = this.expression();
            }

            this.consumir(
                tokenTypes.SEMICOLON,
                "Esperado ';' após valores da condicional"
            );

            let incrementar = null;
            if (!this.verificar(tokenTypes.RIGHT_PAREN)) {
                incrementar = this.expression();
            }

            this.consumir(tokenTypes.RIGHT_PAREN, "Esperado ')' após cláusulas");

            const corpo = this.statement();

            return new Stmt.Para(initializer, condition, incrementar, corpo);
        } finally {
            this.ciclos -= 1;
        }
    }

    breakStatement() {
        if (this.ciclos < 1) {
            this.error(this.voltar(), "'pausa' deve estar dentro de um loop.");
        }

        this.consumir(tokenTypes.SEMICOLON, "Esperado ';' após 'pausa'.");
        return new Stmt.Pausa();
    }

    declaracaoContinue() {
        if (this.ciclos < 1) {
            this.error(this.voltar(), "'continua' precisa estar em um laço de repetição.");
        }

        this.consumir(tokenTypes.SEMICOLON, "Esperado ';' após 'continua'.");
        return new Stmt.Continua();
    }

    declaracaoRetorna() {
        const palavraChave = this.voltar();
        let valor = null;

        if (!this.verificar(tokenTypes.SEMICOLON)) {
            valor = this.expression();
        }

        this.consumir(tokenTypes.SEMICOLON, "Esperado ';' após o retorno.");
        return new Stmt.Retorna(palavraChave, valor);
    }

    declaracaoEscolha() {
        try {
            this.ciclos += 1;

            this.consumir(
                tokenTypes.LEFT_PAREN,
                "Esperado '{' após 'escolha'."
            );
            let condition = this.expression();
            this.consumir(
                tokenTypes.RIGHT_PAREN,
                "Esperado '}' após a condição de 'escolha'."
            );
            this.consumir(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' antes do escopo do 'escolha'."
            );

            const branches = [];
            let defaultBranch = null;
            while (!this.match(tokenTypes.RIGHT_BRACE) && !this.isAtEnd()) {
                if (this.match(tokenTypes.CASO)) {
                    let branchConditions = [this.expression()];
                    this.consumir(
                        tokenTypes.COLON,
                        "Esperado ':' após o 'caso'."
                    );

                    while (this.verificar(tokenTypes.CASO)) {
                        this.consumir(tokenTypes.CASO, null);
                        branchConditions.push(this.expression());
                        this.consumir(
                            tokenTypes.COLON,
                            "Esperado ':' após declaração do 'caso'."
                        );
                    }

                    let stmts = [];
                    do {
                        stmts.push(this.statement());
                    } while (
                        !this.verificar(tokenTypes.CASO) &&
                        !this.verificar(tokenTypes.PADRAO) &&
                        !this.verificar(tokenTypes.RIGHT_BRACE)
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

                    this.consumir(
                        tokenTypes.COLON,
                        "Esperado ':' após declaração do 'padrao'."
                    );

                    let stmts = [];
                    do {
                        stmts.push(this.statement());
                    } while (
                        !this.verificar(tokenTypes.CASO) &&
                        !this.verificar(tokenTypes.PADRAO) &&
                        !this.verificar(tokenTypes.RIGHT_BRACE)
                    );

                    defaultBranch = {
                        stmts
                    };
                }
            }

            return new Stmt.Escolha(condition, branches, defaultBranch);
        } finally {
            this.ciclos -= 1;
        }
    }

    importStatement() {
        this.consumir(tokenTypes.LEFT_PAREN, "Esperado '(' após declaração.");

        const caminho = this.expression();

        let closeBracket = this.consumir(
            tokenTypes.RIGHT_PAREN,
            "Esperado ')' após declaração."
        );

        return new Stmt.Importar(caminho, closeBracket);
    }

    tryStatement() {
        this.consumir(tokenTypes.LEFT_BRACE, "Esperado '{' após a declaração 'tente'.");

        let tryBlock = this.block();

        let catchBlock = null;
        if (this.match(tokenTypes.PEGUE)) {
            this.consumir(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' após a declaração 'pegue'."
            );

            catchBlock = this.block();
        }

        let elseBlock = null;
        if (this.match(tokenTypes.SENAO)) {
            this.consumir(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' após a declaração 'pegue'."
            );

            elseBlock = this.block();
        }

        let finallyBlock = null;
        if (this.match(tokenTypes.FINALMENTE)) {
            this.consumir(
                tokenTypes.LEFT_BRACE,
                "Esperado '{' após a declaração 'pegue'."
            );

            finallyBlock = this.block();
        }

        return new Stmt.Tente(tryBlock, catchBlock, elseBlock, finallyBlock);
    }

    doStatement() {
        try {
            this.ciclos += 1;

            const doBranch = this.statement();

            this.consumir(
                tokenTypes.ENQUANTO,
                "Esperado declaração do 'enquanto' após o escopo do 'fazer'."
            );
            this.consumir(
                tokenTypes.LEFT_PAREN,
                "Esperado '(' após declaração 'enquanto'."
            );

            const whileCondition = this.expression();

            this.consumir(
                tokenTypes.RIGHT_PAREN,
                "Esperado ')' após declaração do 'enquanto'."
            );

            return new Stmt.Fazer(doBranch, whileCondition);
        } finally {
            this.ciclos -= 1;
        }
    }

    statement() {
        if (this.match(tokenTypes.FAZER)) return this.doStatement();
        if (this.match(tokenTypes.TENTE)) return this.tryStatement();
        if (this.match(tokenTypes.ESCOLHA)) return this.declaracaoEscolha();
        if (this.match(tokenTypes.RETORNA)) return this.declaracaoRetorna();
        if (this.match(tokenTypes.CONTINUA)) return this.declaracaoContinue();
        if (this.match(tokenTypes.PAUSA)) return this.breakStatement();
        if (this.match(tokenTypes.PARA)) return this.forStatement();
        if (this.match(tokenTypes.ENQUANTO)) return this.whileStatement();
        if (this.match(tokenTypes.SE)) return this.declaracaoSe();
        if (this.match(tokenTypes.ESCREVA)) return this.declaracaoMostrar();
        if (this.match(tokenTypes.LEFT_BRACE)) return new Stmt.Block(this.block());

        return this.expressionStatement();
    }

    declaracaoDeVariavel() {
        let name = this.consumir(tokenTypes.IDENTIFIER, "Esperado nome de variável.");
        let initializer = null;
        if (this.match(tokenTypes.EQUAL) || this.match(tokenTypes.MAIS_IGUAL)) {
            initializer = this.expression();
        }

        this.consumir(
            tokenTypes.SEMICOLON,
            "Esperado ';' após a declaração da variável."
        );
        return new Stmt.Var(name, initializer);
    }

    funcao(kind) {
        const nome = this.consumir(tokenTypes.IDENTIFIER, `Esperado nome ${kind}.`);
        return new Stmt.Funcao(nome, this.corpoDaFuncao(kind));
    }

    corpoDaFuncao(kind) {
        this.consumir(tokenTypes.LEFT_PAREN, `Esperado '(' após o nome ${kind}.`);

        let parametros = [];
        if (!this.verificar(tokenTypes.RIGHT_PAREN)) {
            do {
                if (parametros.length >= 255) {
                    this.error(this.peek(), "Não pode haver mais de 255 parâmetros");
                }

                let paramObj = {};

                if (this.peek().tipo === tokenTypes.STAR) {
                    this.consumir(tokenTypes.STAR, null);
                    paramObj["type"] = "wildcard";
                } else {
                    paramObj["type"] = "standard";
                }

                paramObj['name'] = this.consumir(
                    tokenTypes.IDENTIFIER,
                    "Esperado nome do parâmetro."
                );

                if (this.match(tokenTypes.EQUAL)) {
                    paramObj["default"] = this.primario();
                }

                parametros.push(paramObj);

                if (paramObj["type"] === "wildcard") break;
            } while (this.match(tokenTypes.COMMA));
        }

        this.consumir(tokenTypes.RIGHT_PAREN, "Esperado ')' após parâmetros.");
        this.consumir(tokenTypes.LEFT_BRACE, `Esperado '{' antes do escopo do ${kind}.`);

        const corpo = this.block();

        return new Expr.Funcao(parametros, corpo);
    }

    declaracaoDeClasse() {
        const nome = this.consumir(tokenTypes.IDENTIFIER, "Esperado nome da classe.");

        let superClasse = null;
        if (this.match(tokenTypes.HERDA)) {
            this.consumir(tokenTypes.IDENTIFIER, "Esperado nome da superclasse.");
            superClasse = new Expr.Variable(this.voltar());
        }

        this.consumir(tokenTypes.LEFT_BRACE, "Esperado '{' antes do escopo da classe.");

        const metodos = [];
        while (!this.verificar(tokenTypes.RIGHT_BRACE) && !this.isAtEnd()) {
            metodos.push(this.funcao("método"));
        }

        this.consumir(tokenTypes.RIGHT_BRACE, "Esperado '}' após o escopo da classe.");
        return new Stmt.Classe(nome, superClasse, metodos);
    }

    declaracao() {
        try {
            if (
                this.verificar(tokenTypes.FUNCAO) &&
                this.verificarProximo(tokenTypes.IDENTIFIER)
            ) {
                this.consumir(tokenTypes.FUNCAO, null);
                return this.funcao("funcao");
            }
            if (this.match(tokenTypes.VAR)) return this.declaracaoDeVariavel();
            if (this.match(tokenTypes.CLASSE)) return this.declaracaoDeClasse();

            return this.statement();
        } catch (error) {
            this.sincronizar();
            return null;
        }
    }

    analisar() {
        const declaracoes = [];
        while (!this.isAtEnd()) {
            declaracoes.push(this.declaracao());
        }

        return declaracoes
    }
};
