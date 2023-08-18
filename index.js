const Egua = require("./src/egua.js").Egua;

const main = function () {
    let args = process.argv;

    const egua = new Egua();

    switch (args.length) {
        case 2:
            egua.runPrompt();
            break;
        case 3:
            egua.runfile(args[2]);
            break;
        case 4:
            if (args[2] !== "avaliar") {
                console.error(
                    `Esperado parâmetro 'avaliar', recebido '${args[2]}'`
                );
                return;
            }
            egua.runstring(args[3]);
            break;
        default:
            console.error("Número inválido de parâmetros");
    }
};

main();