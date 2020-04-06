class Expr {
  accept(visitor) {}}

class Binary extends Expr {
  constructor (left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept (visitor) {
    return visitor.visitBinaryExpr(this)
  }
}

class Grouping extends Expr {
  constructor (expression) {
    super();
    this.expression = expression;
  }

  accept (visitor) {
    return visitor.visitGroupingExpr(this)
  }
}

class Literal extends Expr {
  constructor (value) {
    super();
    this.value = value;
  }

  accept (visitor) {
    return visitor.visitLiteralExpr(this)
  }
}

class Unary extends Expr {
  constructor (operator, right) {
    super();
    this.operator = operator;
    this.right = right;
  }

  accept (visitor) {
    return visitor.visitUnaryExpr(this)
  }
}

module.exports = {
  Binary,
  Grouping,
  Literal,
  Unary,
}
