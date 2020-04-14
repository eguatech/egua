const StandardFn = require("../structures/standardFn.js");
const Expr = require("../expr.js");

/**
 * 
 */
module.exports = function(globals) {
  globals.defineVar(
    "clock",
    new StandardFn(0, function() {
      return Date.now() / 1000;
    })
  );

  globals.defineVar(
    "tamanho",
    new StandardFn(1, function(obj) {
      return obj.length;
    })
  );

  globals.defineVar(
    "texto",
    new StandardFn(1, function(value) {
      return `${value}`;
    })
  );

  globals.defineVar(
    "real",
    new StandardFn(1, function(value) {
      if (!/^-{0,1}\d+$/.test(value) && !/^\d+\.\d+$/.test(value))
        throw new RuntimeError(
          this.token,
          "Somente números podem passar para real."
        );
      return parseFloat(value);
    })
  );

  globals.defineVar(
    "inteiro",
    new StandardFn(1, function(value) {
      if (value === undefined || value === null) {
        throw new RuntimeError(
          this.token,
          "Somente números podem passar para inteiro."
        );
      }

      if (!/^-{0,1}\d+$/.test(value) && !/^\d+\.\d+$/.test(value)) {
        throw new RuntimeError(
          this.token,
          "Somente números podem passar para inteiro."
        );
      }

      return parseInt(value);
    })
  );

    globals.defineVar("exports", {});

  return globals;
};