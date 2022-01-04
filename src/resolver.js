class ResolverError extends Error {
    constructor(msg) {
        super(msg);
        this.message = msg;
    }
}

class Stack {
    constructor() {
        this.stack = [];
    }

    push(item) {
        this.stack.push(item);
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    peek() {
        if (this.isEmpty()) throw new Error("Pilha vazia.");
        return this.stack[this.stack.length - 1];
    }

    pop() {
        if (this.isEmpty()) throw new Error("Pilha vazia.");
        return this.stack.pop();
    }
}

const FunctionType = {
    NONE: "NONE",
    FUNCAO: "FUNCAO",
    CONSTRUTOR: "CONSTRUTOR",
    METHOD: "METHOD"
};

const ClassType = {
    NONE: "NONE",
    CLASSE: "CLASSE",
    SUBCLASS: "SUBCLASS"
};

const LoopType = {
    NONE: "NONE",
    ENQUANTO: "ENQUANTO",
    ESCOLHA: "ESCOLHA",
    PARA: "PARA",
    FAZER: "FAZER"
};

/**
 * O Resolvedor (Resolver) é responsável por catalogar todos os identificadores complexos, como por exemplo: funções, classes, variáveis, 
 * e delimitar os escopos onde esses identificadores existem. 
 * Exemplo: uma classe A declara dois métodos chamados M e N. Todas as variáveis declaradas dentro de M não podem ser vistas por N, e vice-versa.
 * No entanto, todas as variáveis declaradas dentro da classe A podem ser vistas tanto por M quanto por N.
 */
module.exports = class Resolver {
    constructor(interpreter, egua) {
        this.interpreter = interpreter;
        this.egua = egua;
        this.escopos = new Stack();

        this.FuncaoAtual = FunctionType.NONE;
        this.ClasseAtual = ClassType.NONE;
        this.cicloAtual = ClassType.NONE;
    }

    definir(name) {
        if (this.escopos.isEmpty()) return;
        this.escopos.peek()[name.lexeme] = true;
    }

    declarar(name) {
        if (this.escopos.isEmpty()) return;
        let escopo = this.escopos.peek();
        if (escopo.hasOwnProperty(name.lexeme))
            this.egua.error(
                name,
                "Variável com esse nome já declarada neste escopo."
            );
            escopo[name.lexeme] = false;
    }

    inicioDoEscopo() {
        this.escopos.push({});
    }

    finalDoEscopo() {
        this.escopos.pop();
    }

    resolver(statements) {
        if (Array.isArray(statements)) {
            for (let i = 0; i < statements.length; i++) {
                statements[i].aceitar(this);
            }
        } else {
            statements.aceitar(this);
        }
    }

    resolverLocal(expr, name) {
        for (let i = this.escopos.stack.length - 1; i >= 0; i--) {
            if (this.escopos.stack[i].hasOwnProperty(name.lexeme)) {
                this.interpreter.resolver(expr, this.escopos.stack.length - 1 - i);
            }
        }
    }

    visitBlockStmt(stmt) {
        this.inicioDoEscopo();
        this.resolver(stmt.statements);
        this.finalDoEscopo();
        return null;
    }

    visitVariableExpr(expr) {
        if (
            !this.escopos.isEmpty() &&
            this.escopos.peek()[expr.name.lexeme] === false
        ) {
            throw new ResolverError(
                "Não é possível ler a variável local em seu próprio inicializador."
            );
        }
        this.resolverLocal(expr, expr.name);
        return null;
    }

    visitVarStmt(stmt) {
        this.declarar(stmt.name);
        if (stmt.initializer !== null) {
            this.resolver(stmt.initializer);
        }
        this.definir(stmt.name);
        return null;
    }

    visitAssignExpr(expr) {
        this.resolver(expr.value);
        this.resolverLocal(expr, expr.name);
        return null;
    }

    resolverFuncao(funcao, funcType) {
        let enclosingFunc = this.FuncaoAtual;
        this.FuncaoAtual = funcType;

        this.inicioDoEscopo();
        let parametros = funcao.params;
        for (let i = 0; i < parametros.length; i++) {
            this.declarar(parametros[i]["name"]);
            this.definir(parametros[i]["name"]);
        }
        this.resolver(funcao.body);
        this.finalDoEscopo();

        this.FuncaoAtual = enclosingFunc;
    }

    visitFunctionStmt(stmt) {
        this.declarar(stmt.name);
        this.definir(stmt.name);

        this.resolverFuncao(stmt.func, FunctionType.FUNCAO);
        return null;
    }

    visitFunctionExpr(stmt) {
        this.resolverFuncao(stmt, FunctionType.FUNCAO);
        return null;
    }

    visitTryStmt(stmt) {
        this.resolver(stmt.tryBranch);

        if (stmt.catchBranch !== null) this.resolver(stmt.catchBranch);
        if (stmt.elseBranch !== null) this.resolver(stmt.elseBranch);
        if (stmt.finallyBranch !== null) this.resolver(stmt.finallyBranch);
    }

    visitClassStmt(stmt) {
        let enclosingClass = this.ClasseAtual;
        this.ClasseAtual = ClassType.CLASSE;

        this.declarar(stmt.name);
        this.definir(stmt.name);

        if (
            stmt.superclass !== null &&
            stmt.name.lexeme === stmt.superclass.name.lexeme
        ) {
            this.egua.error("Uma classe não pode herdar de si mesma.");
        }

        if (stmt.superclass !== null) {
            this.ClasseAtual = ClassType.SUBCLASS;
            this.resolver(stmt.superclass);
        }

        if (stmt.superclass !== null) {
            this.inicioDoEscopo();
            this.escopos.peek()["super"] = true;
        }

        this.inicioDoEscopo();
        this.escopos.peek()["isto"] = true;

        let metodos = stmt.methods;
        for (let i = 0; i < metodos.length; i++) {
            let declaracao = FunctionType.METHOD;

            if (metodos[i].name.lexeme === "isto") {
                declaracao = FunctionType.CONSTRUTOR;
            }

            this.resolverFuncao(metodos[i].func, declaracao);
        }

        this.finalDoEscopo();

        if (stmt.superclass !== null) this.finalDoEscopo();

        this.ClasseAtual = enclosingClass;
        return null;
    }

    visitSuperExpr(expr) {
        if (this.ClasseAtual === ClassType.NONE) {
            this.egua.error(expr.keyword, "Não pode usar 'super' fora de uma classe.");
        } else if (this.ClasseAtual !== ClassType.SUBCLASS) {
            this.egua.error(
                expr.keyword,
                "Não se usa 'super' numa classe sem superclasse."
            );
        }

        this.resolverLocal(expr, expr.keyword);
        return null;
    }

    visitGetExpr(expr) {
        this.resolver(expr.object);
        return null;
    }

    visitExpressionStmt(stmt) {
        this.resolver(stmt.expression);
        return null;
    }

    visitIfStmt(stmt) {
        this.resolver(stmt.condition);
        this.resolver(stmt.thenBranch);

        for (let i = 0; i < stmt.elifBranches.length; i++) {
            this.resolver(stmt.elifBranches[i].condition);
            this.resolver(stmt.elifBranches[i].branch);
        }

        if (stmt.elseBranch !== null) this.resolver(stmt.elseBranch);
        return null;
    }

    visitImportStmt(stmt) {
        this.resolver(stmt.path);
    }

    visitPrintStmt(stmt) {
        this.resolver(stmt.expression);
    }

    visitReturnStmt(stmt) {
        if (this.FuncaoAtual === FunctionType.NONE) {
            this.egua.error(stmt.keyword, "Não é possível retornar do código do escopo superior.");
        }
        if (stmt.value !== null) {
            if (this.FuncaoAtual === FunctionType.CONSTRUTOR) {
                this.egua.error(
                    stmt.keyword,
                    "Não pode retornar o valor do construtor."
                );
            }
            this.resolver(stmt.value);
        }
        return null;
    }

    visitSwitchStmt(stmt) {
        let enclosingType = this.cicloAtual;
        this.cicloAtual = LoopType.ESCOLHA;

        let branches = stmt.branches;
        let defaultBranch = stmt.defaultBranch;

        for (let i = 0; i < branches.length; i++) {
            this.resolver(branches[i]["stmts"]);
        }

        if (defaultBranch !== null) this.resolver(defaultBranch["stmts"]);

        this.cicloAtual = enclosingType;
    }

    visitWhileStmt(stmt) {
        this.resolver(stmt.condition);
        this.resolver(stmt.body);
        return null;
    }

    visitForStmt(stmt) {
        if (stmt.initializer !== null) {
            this.resolver(stmt.initializer);
        }
        if (stmt.condition !== null) {
            this.resolver(stmt.condition);
        }
        if (stmt.increment !== null) {
            this.resolver(stmt.increment);
        }

        let enclosingType = this.cicloAtual;
        this.cicloAtual = LoopType.ENQUANTO;
        this.resolver(stmt.body);
        this.cicloAtual = enclosingType;

        return null;
    }

    visitDoStmt(stmt) {
        this.resolver(stmt.whileCondition);

        let enclosingType = this.cicloAtual;
        this.cicloAtual = LoopType.FAZER;
        this.resolver(stmt.doBranch);
        this.cicloAtual = enclosingType;
        return null;
    }

    visitBinaryExpr(expr) {
        this.resolver(expr.left);
        this.resolver(expr.right);
        return null;
    }

    visitCallExpr(expr) {
        this.resolver(expr.callee);

        let args = expr.args;
        for (let i = 0; i < args.length; i++) {
            this.resolver(args[i]);
        }

        return null;
    }

    visitGroupingExpr(expr) {
        this.resolver(expr.expression);
        return null;
    }

    visitDictionaryExpr(expr) {
        for (let i = 0; i < expr.keys.length; i++) {
            this.resolver(expr.keys[i]);
            this.resolver(expr.values[i]);
        }
        return null;
    }

    visitArrayExpr(expr) {
        for (let i = 0; i < expr.values.length; i++) {
            this.resolver(expr.values[i]);
        }
        return null;
    }

    visitSubscriptExpr(expr) {
        this.resolver(expr.callee);
        this.resolver(expr.index);
        return null;
    }

    visitContinueStmt(stmt) {
        return null;
    }

    visitBreakStmt(stmt) {
        return null;
    }

    visitAssignsubscriptExpr(expr) {
        return null;
    }

    visitLiteralExpr(expr) {
        return null;
    }

    visitLogicalExpr(expr) {
        this.resolver(expr.left);
        this.resolver(expr.right);
        return null;
    }

    visitUnaryExpr(expr) {
        this.resolver(expr.right);
        return null;
    }

    visitSetExpr(expr) {
        this.resolver(expr.value);
        this.resolver(expr.object);
        return null;
    }

    visitThisExpr(expr) {
        if (this.ClasseAtual == ClassType.NONE) {
            this.egua.error(expr.keyword, "Não pode usar 'isto' fora da classe.");
        }
        this.resolverLocal(expr, expr.keyword);
        return null;
    }
};