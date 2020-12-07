class Stmt {
    accept(visitor) { }
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
    constructor(name, func) {
        super();
        this.name = name;
        this.func = func;
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

class Classe extends Stmt {
    constructor(name, superclass, methods) {
        super();
        this.name = name;
        this.superclass = superclass;
        this.methods = methods;
    }

    accept(visitor) {
        return visitor.visitClassStmt(this);
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

class Importar extends Stmt {
    constructor(path, closeBracket) {
        super();
        this.path = path;
        this.closeBracket = closeBracket;
    }

    accept(visitor) {
        return visitor.visitImportStmt(this);
    }
}

class Fazer extends Stmt {
    constructor(doBranch, whileCondition) {
      super();
      this.doBranch = doBranch;
      this.whileCondition = whileCondition;
    }
  
    accept(visitor) {
      return visitor.visitDoStmt(this);
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

class Para extends Stmt {
    constructor(initializer, condition, increment, body) {
        super();
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    accept(visitor) {
        return visitor.visitForStmt(this);
    }
}

class Tente extends Stmt {
    constructor(tryBranch, catchBranch, elseBranch, finallyBranch) {
        super();
        this.tryBranch = tryBranch;
        this.catchBranch = catchBranch;
        this.elseBranch = elseBranch;
        this.finallyBranch = finallyBranch;
    }

    accept(visitor) {
        return visitor.visitTryStmt(this);
    }
}

class Se extends Stmt {
    constructor(condition, thenBranch, elifBranches, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elifBranches = elifBranches;
        this.elseBranch = elseBranch;
    }

    accept(visitor) {
        return visitor.visitIfStmt(this);
    }
}

class Escolha extends Stmt {
    constructor(condition, branches, defaultBranch) {
        super();
        this.condition = condition;
        this.branches = branches;
        this.defaultBranch = defaultBranch;
    }

    accept(visitor) {
        return visitor.visitSwitchStmt(this);
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

class Continua extends Stmt {
    constructor() {
        super();
    }

    accept(visitor) {
        return visitor.visitContinueStmt(this);
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
    Classe,
    Block,
    Escreva,
    Importar,
    Fazer,
    Enquanto,
    Para,
    Tente,
    Se,
    Escolha,
    Pausa,
    Continua,
    Var
};