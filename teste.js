const Egua = require("./src/egua.js");
const main = new Egua();

main.run(`
var a = "a";
var b = "b";
var c = "c";
{
  var a = "fora a";
  var b = "fora b";
  {
    var a = "dentro a";
    escreva a;
    escreva b;
    escreva c;
  }
  escreva a;
  escreva b;
  escreva c;
}
escreva a;
escreva b;
escreva c;
`);