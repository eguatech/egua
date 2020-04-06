const Egua = require("./src/egua.js");
const main = new Egua();

main.run(`
var a = 2;
var b = 5;
escreva a+b;
`);