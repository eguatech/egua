const RuntimeError = require("../errors.js").RuntimeError;

module.exports.aprox = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.aprox(número)."
    );

  return Math.round(num);
};

module.exports.raizq = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.raizq(número)."
    );

  return Math.sqrt(num);
};

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
};

module.exports.cos = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.cos(número)."
    );

  return Math.cos(num);
};

module.exports.tan = function(num) {
  if (isNaN(num) || num === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.tan(número)."
    );

  return Math.tan(num);
};

module.exports.radiano = function(angle) {
  if (isNaN(angle) || angle === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.radiano(Ângulo)."
    );

  return angle * (Math.PI / 180);
};

module.exports.graus = function(angle) {
  if (isNaN(angle) || angle === null)
    throw new RuntimeError(
      this.token,
      "Você deve prover um número para mat.graus(ângulo)."
    );

  return angle * (180 / Math.PI);
};

module.exports.pi = Math.PI; 