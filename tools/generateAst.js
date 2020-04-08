const path = require("path");
const fs = require("fs");

var outputDir = process.argv[2] || "./";
if (!path.isAbsolute(outputDir)) outputDir = path.resolve(__dirname, outputDir);
if (!outputDir.endsWith("/") && !outputDir.endsWith("\\"))
    outputDir = outputDir + "/";

const defineType = function(file, baseName, className, fieldList) {
    file.write(`class ${className} extends ${baseName} {\n`);

    let fieldNames;
    if (typeof fieldList === "string") {
        fieldNames = fieldList.split(", ");
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
    Assign: "name, value",
    Binary: "left, operator, right",
    Grouping: "expression",
    Literal: "value",
    Logical: "left, operator, right",
    Unary: "operator, right",
    Variable: "name"
});

defineAst("Stmt", {
    Expression: "expression",
    Block: "statements",
    Escreva: "expression",
    Enquanto: "condition, body",
    Se: "condition, thenBranch, elseBranch",
    Pausa: undefined,
    Var: "name, initializer"
});