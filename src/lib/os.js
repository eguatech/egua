const fs = require("fs");
const RuntimeError = require("../errors.js").RuntimeError;

module.exports.ler = function(filepath, encoding = "utf-8") {
    if (filepath === null)
        throw new RuntimeError(
            this.token,
            "Você deve prover o caminho do arquivo para os.ler(caminho)."
        );

    try {
        let data = fs.readFileSync(filepath, encoding);
        return data;
    } catch (error) {
        throw new RuntimeError(this.token, `Erro ao ler o arquivo - ${error.code}.`);
    }
};

module.exports.escreva = function(filepath, data = "", encoding = "utf-8") {
    if (filepath === null)
        throw new RuntimeError(
            this.token,
            "Você deve prover o caminho do arquivo para os.escreva(arquivo)."
        );

    try {
        fs.writeFileSync(filepath, data, encoding);
        return null;
    } catch (error) {
        throw new RuntimeError(this.token, `Erro ao escrever o arquivo - ${error.code}.`);
    }
};

module.exports.apagar = function(path) {
    if (path === null)
        throw new RuntimeError(
            this.token,
            "Você deve prover o caminho do arquivo para os.apagar(arquivo)."
        );

    try {
        fs.unlinkSync(path);
        return null;
    } catch (error) {
        throw new RuntimeError(
            this.token,
            `Erro ao apagar o arquivo - ${error.code}.`
        );
    }
};

module.exports.criardir = function(path) {
    if (path === null)
        throw new RuntimeError(
            this.token,
            "Você deve prover o caminho do diretório para os.criardir(arquivo)."
        );

    try {
        fs.mkdirSync(path);
        return null;
    } catch (error) {
        throw new RuntimeError(
            this.token,
            `Erro ao criar o diretório - ${error.code}.`
        );
    }
};

module.exports.apagardir = function(path) {
    if (path === null)
        throw new RuntimeError(
            this.token,
            "Você deve prover o caminho do diretório para os.apagardir(arquivo)."
        );

    try {
        fs.rmdirSync(path, { recursive: true });
        return null;
    } catch (error) {
        throw new RuntimeError(
            this.token,
            `Erro ao apagar o diretório - ${error.code}.`
        );
    }
};

module.exports.listardir = function(path) {
    if (path === null)
        throw new RuntimeError(
            this.token,
            "Você deve prover o caminho do diretório para os.listdir(listardir)."
        );

    try {
        let folderContents = fs.readdirSync(path);
        return folderContents;
    } catch (error) {
        throw new RuntimeError(
            this.token,
            `Erro ao listar o conteúdo do diretório - ${error.code}.`
        );
    }
};