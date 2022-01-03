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
        this.scopes = new Stack();

        this.currentFunction = FunctionType.NONE;
        this.currentClass = ClassType.NONE;
        this.currentLoop = ClassType.NONE;
    }

    define(name) {
        if (this.scopes.isEmpty()) return;
        this.scopes.peek()[name.lexeme] = true;
    }

    declare(name) {
        if (this.scopes.isEmpty()) return;
        let scope = this.scopes.peek();
        if (scope.hasOwnProperty(name.lexeme))
            this.egua.error(
                name,
                "Variável com esse nome já declarada neste escopo."
            );
        scope[name.lexeme] = false;
    }

    beginScope() {
        this.scopes.push({});
    }

    endScope() {
        this.scopes.pop();
    }

    resolve(statements) {
        if (Array.isArray(statements)) {
            for (let i = 0; i < statements.length; i++) {
                statements[i].accept(this);
            }
        } else {
            statements.accept(this);
        }
    }

    resolveLocal(expr, name) {
        for (let i = this.scopes.stack.length - 1; i >= 0; i--) {
            if (this.scopes.stack[i].hasOwnProperty(name.lexeme)) {
                this.interpreter.resolve(expr, this.scopes.stack.length - 1 - i);
            }
        }
    }

    visitBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    }

    visitVariableExpr(expr) {
        if (
            !this.scopes.isEmpty() &&
            this.scopes.peek()[expr.name.lexeme] === false
        ) {
            throw new ResolverError(
                "Não é possível ler a variável local em seu próprio inicializador."
            );
        }
        this.resolveLocal(expr, expr.name);
        return null;
    }

    visitVarStmt(stmt) {
        this.declare(stmt.name);
        if (stmt.initializer !== null) {
            this.resolve(stmt.initializer);
        }
        this.define(stmt.name);
        return null;
    }

    visitAssignExpr(expr) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }

    resolveFunction(func, funcType) {
        let enclosingFunc = this.currentFunction;
        this.currentFunction = funcType;

        this.beginScope();
        let params = func.params;
        for (let i = 0; i < params.length; i++) {
            this.declare(params[i]["name"]);
            this.define(params[i]["name"]);
        }
        this.resolve(func.body);
        this.endScope();

        this.currentFunction = enclosingFunc;
    }

    visitFunctionStmt(stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt.func, FunctionType.FUNCAO);
        return null;
    }

    visitFunctionExpr(stmt) {
        this.resolveFunction(stmt, FunctionType.FUNCAO);
        return null;
    }

    visitTryStmt(stmt) {
        this.resolve(stmt.tryBranch);

        if (stmt.catchBranch !== null) this.resolve(stmt.catchBranch);
        if (stmt.elseBranch !== null) this.resolve(stmt.elseBranch);
        if (stmt.finallyBranch !== null) this.resolve(stmt.finallyBranch);
    }

    visitClassStmt(stmt) {
        let enclosingClass = this.currentClass;
        this.currentClass = ClassType.CLASSE;

        this.declare(stmt.name);
        this.define(stmt.name);

        if (
            stmt.superclass !== null &&
            stmt.name.lexeme === stmt.superclass.name.lexeme
        ) {
            this.egua.error("Uma classe não pode herdar de si mesma.");
        }

        if (stmt.superclass !== null) {
            this.currentClass = ClassType.SUBCLASS;
            this.resolve(stmt.superclass);
        }

        if (stmt.superclass !== null) {
            this.beginScope();
            this.scopes.peek()["super"] = true;
        }

        this.beginScope();
        this.scopes.peek()["isto"] = true;

        let methods = stmt.methods;
        for (let i = 0; i < methods.length; i++) {
            let declaration = FunctionType.METHOD;

            if (methods[i].name.lexeme === "isto") {
                declaration = FunctionType.CONSTRUTOR;
            }

            this.resolveFunction(methods[i].func, declaration);
        }

        this.endScope();

        if (stmt.superclass !== null) this.endScope();

        this.currentClass = enclosingClass;
        return null;
    }

    visitSuperExpr(expr) {
        if (this.currentClass === ClassType.NONE) {
            this.egua.error(expr.keyword, "Não pode usar 'super' fora de uma classe.");
        } else if (this.currentClass !== ClassType.SUBCLASS) {
            this.egua.error(
                expr.keyword,
                "Não se usa 'super' numa classe sem superclasse."
            );
        }

        this.resolveLocal(expr, expr.keyword);
        return null;
    }

    visitGetExpr(expr) {
        this.resolve(expr.object);
        return null;
    }

    visitExpressionStmt(stmt) {
        this.resolve(stmt.expression);
        return null;
    }

    visitIfStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);

        for (let i = 0; i < stmt.elifBranches.length; i++) {
            this.resolve(stmt.elifBranches[i].condition);
            this.resolve(stmt.elifBranches[i].branch);
        }

        if (stmt.elseBranch !== null) this.resolve(stmt.elseBranch);
        return null;
    }

    visitImportStmt(stmt) {
        this.resolve(stmt.path);
    }

    visitPrintStmt(stmt) {
        this.resolve(stmt.expression);
    }

    visitReturnStmt(stmt) {
        if (this.currentFunction === FunctionType.NONE) {
            this.egua.error(stmt.keyword, "Não é possível retornar do código do escopo superior.");
        }
        if (stmt.value !== null) {
            if (this.currentFunction === FunctionType.CONSTRUTOR) {
                this.egua.error(
                    stmt.keyword,
                    "Não pode retornar o valor do construtor."
                );
            }
            this.resolve(stmt.value);
        }
        return null;
    }

    visitSwitchStmt(stmt) {
        let enclosingType = this.currentLoop;
        this.currentLoop = LoopType.ESCOLHA;

        let branches = stmt.branches;
        let defaultBranch = stmt.defaultBranch;

        for (let i = 0; i < branches.length; i++) {
            this.resolve(branches[i]["stmts"]);
        }

        if (defaultBranch !== null) this.resolve(defaultBranch["stmts"]);

        this.currentLoop = enclosingType;
    }

    visitWhileStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        return null;
    }

    visitForStmt(stmt) {
        if (stmt.initializer !== null) {
            this.resolve(stmt.initializer);
        }
        if (stmt.condition !== null) {
            this.resolve(stmt.condition);
        }
        if (stmt.increment !== null) {
            this.resolve(stmt.increment);
        }

        let enclosingType = this.currentLoop;
        this.currentLoop = LoopType.ENQUANTO;
        this.resolve(stmt.body);
        this.currentLoop = enclosingType;

        return null;
    }

    visitDoStmt(stmt) {
        this.resolve(stmt.whileCondition);

        let enclosingType = this.currentLoop;
        this.currentLoop = LoopType.FAZER;
        this.resolve(stmt.doBranch);
        this.currentLoop = enclosingType;
        return null;
    }

    visitBinaryExpr(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    visitCallExpr(expr) {
        this.resolve(expr.callee);

        let args = expr.args;
        for (let i = 0; i < args.length; i++) {
            this.resolve(args[i]);
        }

        return null;
    }

    visitGroupingExpr(expr) {
        this.resolve(expr.expression);
        return null;
    }

    visitDictionaryExpr(expr) {
        for (let i = 0; i < expr.keys.length; i++) {
            this.resolve(expr.keys[i]);
            this.resolve(expr.values[i]);
        }
        return null;
    }

    visitArrayExpr(expr) {
        for (let i = 0; i < expr.values.length; i++) {
            this.resolve(expr.values[i]);
        }
        return null;
    }

    visitSubscriptExpr(expr) {
        this.resolve(expr.callee);
        this.resolve(expr.index);
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
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    visitUnaryExpr(expr) {
        this.resolve(expr.right);
        return null;
    }

    visitSetExpr(expr) {
        this.resolve(expr.value);
        this.resolve(expr.object);
        return null;
    }

    visitThisExpr(expr) {
        if (this.currentClass == ClassType.NONE) {
            this.egua.error(expr.keyword, "Não pode usar 'isto' fora da classe.");
        }
        this.resolveLocal(expr, expr.keyword);
        return null;
    }
};