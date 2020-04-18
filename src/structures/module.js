module.exports = class EguaModule {
    constructor(name) {
        if (name !== undefined) this.name = name;
    }

    toString() {
        return this.name ? `<module ${this.name}>` : "<module>";
    }
};