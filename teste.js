const Egua = require("./src/egua.js");
const main = new Egua();

main.run(`
para (var i=0; i < 10; i = i+1) {
  escreva("a");
 }
`);