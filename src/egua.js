const Lexer = require("./lexer.js");
const Parser = require("./parser.js");
const Resolver = require("./resolver.js");
const Interpreter = require("./interpreter.js");
const tokenTypes = require("./tokenTypes.js");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

module.exports.Egua = class Egua {
    constructor(nomeArquivo) {
        this.nomeArquivo = nomeArquivo;

        this.teveErro = false;
        this.teveErroEmTempoDeExecucao = false;
    }

    runPrompt() {
        const interpreter = new Interpreter(this, process.cwd(), undefined);
        console.log("Console da Linguagem Egua v1.1.15");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "\negua> "
        });

        rl.prompt();

        rl.on("line", linha => {
            this.teveErro = false;
            this.teveErroEmTempoDeExecucao = false;

            this.run(linha, interpreter);
            rl.prompt();
        });
    }

    runfile(nomeArquivo) {
        this.nomeArquivo = path.basename(nomeArquivo);
        const interpretador = new Interpreter(this, process.cwd());

        const dadosDoArquivo = fs.readFileSync(nomeArquivo).toString();
        this.run(dadosDoArquivo, interpretador);

        if (this.teveErro) process.exit(65);
        if (this.teveErroEmTempoDeExecucao) process.exit(70);
    }

    run(code, interpretador) {
        const lexer = new Lexer(code, this);
        const simbolos = lexer.scan();

        if (this.teveErro === true) return;

        const analisar = new Parser(simbolos, this);
        const declaracoes = analisar.analisar();

        if (this.teveErro === true) return;

        const resolver = new Resolver(interpretador, this);
        resolver.resolver(declaracoes);

        if (this.teveErro === true) return;

        interpretador.interpretar(declaracoes);
    }

    reportar(linha, onde, mensagem) {
        if (this.nomeArquivo)
            console.error(
                `[Arquivo: ${this.nomeArquivo}] [Linha: ${linha}] Erro${onde}: ${mensagem}`
            );
        else console.error(`[Linha: ${linha}] Erro${onde}: ${mensagem}`);
        this.teveErro = true;
    }

    error(simbolo, mensagemDeErro) {
        if (simbolo.type === tokenTypes.EOF) {
            this.reportar(simbolo.line, " no final", mensagemDeErro);
        } else {
            this.reportar(simbolo.line, ` no '${simbolo.lexeme}'`, mensagemDeErro);
        }
    }

    lexerError(linha, caractere, mensagem) {
        this.reportar(linha, ` no '${caractere}'`, mensagem);
    }

    runtimeError(erro) {
        const linha = erro.token.line;
        if (erro.token && linha) {
            if (this.nomeArquivo)
                console.error(
                    `Erro: [Arquivo: ${this.nomeArquivo}] [Linha: ${erro.token.line}] ${erro.message}`
                );
            else console.error(`Erro: [Linha: ${erro.token.line}] ${erro.message}`);
        } else {
            console.error(`Erro: ${erro.message}`);
        }
        this.teveErroEmTempoDeExecucao = true;
    }
};