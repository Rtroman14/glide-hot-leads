const { glideAppLeads } = require("./index");

(async () => {
    try {
        const res = await glideAppLeads();

        console.log(res);
    } catch (error) {
        console.log(error);
    }
})();
