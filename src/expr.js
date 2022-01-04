class Expr {
    aceitar(visitor) {}
}

class Assign extends Expr {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }

    aceitar(visitor) {
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

    aceitar(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}

class Funcao extends Expr {
    constructor(params, body) {
        super();
        this.params = params;
        this.body = body;
    }

    aceitar(visitor) {
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

    aceitar(visitor) {
        return visitor.visitCallExpr(this);
    }
}

class Get extends Expr {
    constructor(object, name) {
        super();
        this.object = object;
        this.name = name;
    }

    aceitar(visitor) {
        return visitor.visitGetExpr(this);
    }
}

class Grouping extends Expr {
    constructor(expression) {
        super();
        this.expression = expression;
    }

    aceitar(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}

class Literal extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }

    aceitar(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}

class Array extends Expr {
    constructor(values) {
        super();
        this.values = values;
    }

    aceitar(visitor) {
        return visitor.visitArrayExpr(this);
    }
}

class Dictionary extends Expr {
    constructor(keys, values) {
        super();
        this.keys = keys;
        this.values = values;
    }

    aceitar(visitor) {
        return visitor.visitDictionaryExpr(this);
    }
}

class Subscript extends Expr {
    constructor(callee, index, closeBracket) {
        super();
        this.callee = callee;
        this.index = index;
        this.closeBracket = closeBracket;
    }

    aceitar(visitor) {
        return visitor.visitSubscriptExpr(this);
    }
}

class Assignsubscript extends Expr {
    constructor(obj, index, value) {
        super();
        this.obj = obj;
        this.index = index;
        this.value = value;
    }

    aceitar(visitor) {
        return visitor.visitAssignsubscriptExpr(this);
    }
}

class Logical extends Expr {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    aceitar(visitor) {
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

    aceitar(visitor) {
        return visitor.visitSetExpr(this);
    }
}

class Super extends Expr {
    constructor(keyword, method) {
        super();
        this.keyword = keyword;
        this.method = method;
    }

    aceitar(visitor) {
        return visitor.visitSuperExpr(this);
    }
}

class Isto extends Expr {
    constructor(keyword) {
        super();
        this.keyword = keyword;
    }

    aceitar(visitor) {
        return visitor.visitThisExpr(this);
    }
}

class Unary extends Expr {
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }

    aceitar(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}

class Variable extends Expr {
    constructor(name) {
        super();
        this.name = name;
    }

    aceitar(visitor) {
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
    Array,
    Dictionary,
    Subscript,
    Assignsubscript,
    Logical,
    Set,
    Super,
    Isto,
    Unary,
    Variable
};