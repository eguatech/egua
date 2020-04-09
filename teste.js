const Egua = require("./src/egua.js");
const main = new Egua();

main.run(`
para (var i = 2; i < 100; i = i**2) {
  escreva(i);
 }
`);