class Stmt {
    accept(visitor) {}
}

class Expression extends Stmt {
    constructor (expression) {
        super();
        this.expression = expression;
    }

    accept (visitor) {
        return visitor.visitExpressionStmt(this)
    }
}

class Escreva extends Stmt {
    constructor (expression) {
        super();
        this.expression = expression;
    }

    accept (visitor) {
        return visitor.visitPrintStmt(this)
    }
}

module.exports = {
    Expression,
    Escreva,
}