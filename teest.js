const Airtable = require("./src/Airtable");
const Glide = require("./src/Glide");

const slackNotification = require("./src/slackNotification");

(async () => {
    let req = {
        recordID: "rec17kH2XBIzMjxB2",
        baseID: "app1BLhbl2zNvxsTR",
        client: "farharoofing.com",
    };

    try {
        await slackNotification("This is a preview", req, "error message");
    } catch (error) {
        console.log("glideAppLeads()", error);
    }
})();
