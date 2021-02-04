const RuntimeError = require("../errors.js").RuntimeError;

// Retorna uma data completa
module.exports.tempo = function () {
	return new Date();
};

// Retorna os segundos atuais do sistema
module.exports.segundos = function () {
	return new Date().getSeconds();
};

// Retorna os minutos atuais do sistema
module.exports.minutos = function () {
	return new Date().getMinutes();
};

// Retorna a hora atual do sistema
module.exports.horas = function () {
	return new Date().getHours();
};

// Retorna a data completa que foi passada por parâmetro
module.exports.horario = function (timestamp) {
	const regex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;

	if (typeof timestamp !== 'string' || !regex.test(timestamp)){
		throw new RuntimeError(
			this.token,
			"O parâmetro passado deve ser um texto com a data no formato PT-BR. Ex: '01/01/2014'"
		);
	}
	
	const date = new Date(convertDateFromPtbrToISO(timestamp));
	const timezoneOffset = date.getTimezoneOffset();

	return new Date(date.getTime() + timezoneOffset * 60 * 1000);
}

function convertDateFromPtbrToISO(date) {
  const day  = date.split("/")[0];
  const month  = date.split("/")[1];
  const year  = date.split("/")[2];

	return `${year}-${month}-${day}`;
}