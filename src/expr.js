class Expr {
    accept(visitor) {}
}

class Assign extends Expr {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitAssignExpr(this);
    }
}

class Binary extends Expr {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}

class Funcao extends Expr {
    constructor(params, body) {
        super();
        this.params = params;
        this.body = body;
    }

    accept(visitor) {
        return visitor.visitFunctionExpr(this);
    }
}

class Call extends Expr {
    constructor(callee, paren, args) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }

    accept(visitor) {
        return visitor.visitCallExpr(this);
    }
}

class Get extends Expr {
    constructor(object, name) {
        super();
        this.object = object;
        this.name = name;
    }

    accept(visitor) {
        return visitor.visitGetExpr(this);
    }
}

class Grouping extends Expr {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}

class Literal extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}

class Logical extends Expr {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept(visitor) {
        return visitor.visitLogicalExpr(this);
    }
}

class Set extends Expr {
    constructor(object, name, value) {
        super();
        this.object = object;
        this.name = name;
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitSetExpr(this);
    }
}

class Isto extends Expr {
    constructor(keyword) {
        super();
        this.keyword = keyword;
    }

    accept(visitor) {
        return visitor.visitThisExpr(this);
    }
}

class Unary extends Expr {
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}

class Variable extends Expr {
    constructor(name) {
        super();
        this.name = name;
    }

    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
}

module.exports = {
    Assign,
    Binary,
    Funcao,
    Call,
    Get,
    Grouping,
    Literal,
    Logical,
    Set,
    Isto,
    Unary,
    Variable
};