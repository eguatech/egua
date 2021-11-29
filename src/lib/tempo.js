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

/**
 * Retorna uma instância de Date do JavaScript da data passada por parâmetro, no formato DD/MM/AAAA.
 * @param {string} dataComoTexto A data a ser convertida como texto, no formato DD/MM/AAAA.
 * @returns A data como um objeto Date to JavaScript.
 */
module.exports.textoParaData = function (dataComoTexto) {
	const regex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/;

	if (typeof dataComoTexto !== 'string' || !regex.test(dataComoTexto)) {
		throw new RuntimeError(
			this.token,
			"O parâmetro passado deve ser um texto com a data no formato DD/MM/AAAA. Ex: '01/01/2014'"
		);
	}

	const date = new Date(converterDataPtParaIso(dataComoTexto));
	const timezoneOffset = date.getTimezoneOffset();

	return new Date(date.getTime() + timezoneOffset * 60 * 1000);
}

function converterDataPtParaIso(date) {
	const day = date.split("/")[0];
	const month = date.split("/")[1];
	const year = date.split("/")[2];

	return `${year}-${month}-${day}`;
}