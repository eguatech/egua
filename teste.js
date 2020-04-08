const Egua = require("./src/egua.js");
const main = new Egua();

main.run(`
var a = 0;
var b = 1;

enquanto(a < 10000) {
    escreva a;
    a = a + 1;
}
escreva b;

`);