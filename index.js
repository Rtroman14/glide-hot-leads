const functions = require("@google-cloud/functions-framework");

const Airtable = require("./src/Airtable");
const Glide = require("./src/Glide");
const slackNotification = require("./src/slackNotification");

functions.http("glide-app-leads", async (req, res) => {
    if (req.method === "GET") {
        res.send("POST request only!");
    }

    if (req.method === "POST") {
        let { recordID, baseID, client } = req.body;

        if (!client) {
            await slackNotification("Client not defined!", req, "Need to define client");
            throw new Error("Need to define client");
        }

        try {
            const prospect = await Airtable.getRecord(baseID, recordID);

            const row = Glide.formatRow(client, prospect);

            const [newRow] = await Glide.addRow(row);

            console.log(
                `NEW LEAD! | rowID: ${newRow.rowID} | client: ${client} |baseID: ${baseID} | recordID: ${recordID}`
            );

            res.send(newRow);
        } catch (error) {
            console.log("glideAppLeads()", error.message);

            await slackNotification(`Error with baseID: ${baseID}`, req, error.message);

            res.send(error);
        }
    }
});
