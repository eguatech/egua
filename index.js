const Egua = require("./src/egua.js").Egua;

const main = function() {
    let args = process.argv;

    const egua = new Egua();
    if (args.length === 2) {
        egua.runPrompt();
    } else {
        egua.runfile(args[2]);
    }
};

main();