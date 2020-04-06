module.exports = class AstPrinter {
    escreva(expr) {
        return expr.accept(this);
    }

    visitBinaryExpr(expr) {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr) {
        return this.parenthesize("group", expr.expression);
    }

    visitLiteralExpr(expr) {
        if (expr === null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr) {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    parenthesize(...args) {
        let name = args[0];
        let exprs = args.slice(1, args.length);
        let string = `(`;

        string += `${name}`;

        for (let i in exprs) {
            string += ` ${exprs[i].accept(this)}`;
        }

        string += ")";

        return string;
    }
};