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
    FUNCAO: "FUNCAO"
};

module.exports = class Resolver {
    constructor(interpreter, egua) {
        this.interpreter = interpreter;
        this.egua = egua;
        this.scopes = new Stack();

        this.currentFunction = FunctionType.NONE;
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
            this.declare(params[i]);
            this.define(params[i]);
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

    visitExpressionStmt(stmt) {
        this.resolve(stmt.expression);
        return null;
    }

    visitIfStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch !== null) this.resolve(stmt.elseBranch);
        return null;
    }

    visitEscrevaStmt(stmt) {
        this.resolve(stmt.expression);
    }

    visitReturnStmt(stmt) {
        if (this.currentFunction === FunctionType.NONE) {
            this.egua.error(stmt.keyword, "Não é possível retornar do código do escopo superior.");
        }
        if (stmt.value != null) {
            this.resolve(stmt.value);
        }
        return null;
    }

    visitWhileStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
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
};