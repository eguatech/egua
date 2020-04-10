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

class Funcao extends Stmt {
    constructor(name, params, body) {
        super();
        this.name = name;
        this.params = params;
        this.body = body;
    }

    accept(visitor) {
        return visitor.visitFunctionStmt(this);
    }
}

class Retorna extends Stmt {
    constructor(keyword, value) {
        super();
        this.keyword = keyword;
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitReturnStmt(this);
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
        return visitor.visitEscrevaStmt(this);
    }
}

class Enquanto extends Stmt {
    constructor(condition, body) {
        super();
        this.condition = condition;
        this.body = body;
    }

    accept(visitor) {
        return visitor.visitWhileStmt(this);
    }
}

class Se extends Stmt {
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    accept(visitor) {
        return visitor.visitIfStmt(this);
    }
}

class Pausa extends Stmt {
    constructor() {
        super();
    }

    accept(visitor) {
        return visitor.visitBreakStmt(this);
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
    Funcao,
    Retorna,
    Block,
    Escreva,
    Enquanto,
    Se,
    Pausa,
    Var
};