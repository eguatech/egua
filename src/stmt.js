class Stmt {
    accept(visitor) {}
}

class Expression extends Stmt {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitExpressionStmt(this)
    }
}

class Block extends Stmt {
    constructor(statements) {
        super();
        this.statements = statements;
    }

    accept(visitor) {
        return visitor.visitBlockStmt(this);
    }
}

class Escreva extends Stmt {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitPrintStmt(this);
    }
}

class Var extends Stmt {
    constructor(name, initializer) {
        super();
        this.name = name;
        this.initializer = initializer;
    }

    accept(visitor) {
        return visitor.visitVarStmt(this);
    }
}

module.exports = {
    Expression,
    Block,
    Escreva,
    Var
};