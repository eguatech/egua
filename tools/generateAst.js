const path = require("path");
const fs = require("fs");

var outputDir = process.argv[2] || "./";
if (!path.isAbsolute(outputDir)) outputDir = path.resolve(__dirname, outputDir);
if (!outputDir.endsWith("/") && !outputDir.endsWith("\\"))
    outputDir = outputDir + "/";

const defineType = function(file, baseName, className, fieldList) {
    file.write(`class ${className} extends ${baseName} {\n`);

    let fieldNames, fields;
    if (typeof fieldList === "string") {
        fields = fieldList.split(", ");
        fieldNames = fields.map(field => field.split(" ")[1]);
    } else {
        fields = [];
        fieldNames = [];
    }

    file.write(`  constructor(${fieldNames.join(", ")}) {\n`);
    file.write(`    super();\n`);
    fieldNames.forEach(fieldName => {
        file.write(`    this.${fieldName} = ${fieldName};\n`);
    });
    file.write(`  }\n\n`);

    file.write(`  accept(visitor) {\n`);
    file.write(`    return visitor.visit${className}${baseName}(this);\n`);
    file.write(`  }\n`);

    file.write(`}\n\n`);
};

const defineAst = function(baseName, types) {
    const writePath = outputDir + baseName + ".js";
    const file = fs.createWriteStream(writePath);

    file.write(`class ${baseName} {\n`);
    file.write("  accept(visitor) {}");
    file.write(`\n}\n\n`);

    let exportString = "";
    for (let key in types) {
        defineType(file, baseName, key, types[key]);
        exportString += `  ${key},\n`;
    }

    file.write("module.exports = {\n");
    file.write(exportString);
    file.write("}\n");

    file.end();
};

defineAst("Expr", {
    Assign: "Token name, Expr value",
    Binary: "Expr left, Token operator, Expr right",
    Grouping: "Expr expression",
    Literal: "Object value",
    Logical: "Expr left, Token operator, Expr right",
    Unary: "Token operator, Expr right",
    Variable: "Token name"
});

defineAst("Stmt", {
    Expression: "Expr expression",
    Block: "List statements",
    Escreva: "Expr expression",
    Enquanto: "Expr condition, Stmt body",
    Se: "Expression condition, Stmt thenBranch, Stmt elseBranch",
    Pausa: undefined,
    Var: "Token name, Expr initializer"
});