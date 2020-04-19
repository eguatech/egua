const RuntimeError = require("../errors.js").RuntimeError;

module.exports.aprox = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.aprox(número)."
    );

  return Math.round(num);
}

module.exports.raizq = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.raizq(número)."
    );

  return Math.sqrt(num);
}

/* module.exports.floor = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.floor(número)."
    );

  return Math.floor(num);
} */

module.exports.sen = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.sen(número)."
    );

  return Math.sin(num);
}

module.exports.cos = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "You must provide a number to math.cos(number)."
    );

  return Math.cos(num);
}

module.exports.tan = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "You must provide a number to math.tan(number)."
    );

  return Math.tan(num);
}

module.exports.radians = function(angle) {
  if (isNaN(angle) || angle === null)
    throw new RuntimeError(
      this.token,
      "You must provide an angle to math.radians(angle)."
    );

  return angle * (Math.PI / 180);
}

module.exports.degrees = function(angle) {
  if (isNaN(angle) || angle === null)
    throw new RuntimeError(
      this.token,
      "You must provide an angle to math.degrees(angle)."
    );

  return angle * (180 / Math.PI);
} 

module.exports.Pi = Math.PI; 