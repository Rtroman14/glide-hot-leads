const functions = require("@google-cloud/functions-framework");

const Airtable = require("./src/Airtable");
const Glide = require("./src/Glide");
const slackNotification = require("./src/slackNotification");

functions.http("glide-app-leads", async (req, res) => {
    if (req.method === "POST") {
        let { recordID, baseID, client } = req.body;

        if (!client) {
            await slackNotification(`Need to define client! \nbaseID: ${baseID}`);
            throw new Error("Need to define client");
        }

        try {
            const prospect = await Airtable.getRecord(baseID, recordID);

            let address = "";

            if ("Address" in prospect) {
                address = prospect.Address;
            } else {
                if ("Street" in prospect) {
                    address = `${prospect.Street}, ${prospect.City || ""}, ${prospect.Zip || ""} ${
                        prospect.State || ""
                    }`;
                }
            }

            const row = {
                "Full Name": prospect["Full Name"] || "",
                "First Name": prospect["First Name"] || "",
                "Last Name": prospect["Last Name"] || "",
                "Phone Number": prospect["Phone Number"] || "",
                "Square Feet": Number(prospect["Square Feet"]) || "",
                Address: address || "",
                Street: prospect.Street || "",
                City: prospect.City || "",
                State: prospect.State || "",
                Zip: Number(prospect.Zip) || "",
                Email: prospect.Email || "",
                Status: "New Lead" || "",
                Response: prospect.Response || "",
                "New Lead Date": new Date(prospect["Response Date"]) || "", // Response Date
                "Year Built": Number(prospect["Year Built"]) || "",
                "Building Type": prospect["Building Type"] || "",
                Title: prospect.Title || "",
                Comments: prospect.Comments || "",
                Client: client, // Custom per client
                "Prospect Rating": 0,
                "Sales Rep": "",
                Filter: "",
            };

            const [newRow] = await Glide.addRow(row);

            console.log(
                `NEW LEAD! | rowID: ${newRow.rowID} | client: ${client} |baseID: ${baseID} | recordID: ${recordID}`
            );

            res.send(newRow);
        } catch (error) {
            console.log("glideAppLeads()", error);

            await slackNotification(
                `Error with: baseID: ${baseID} | recordID: ${recordID} --> ${error.message}`
            );

            res.send(error);
        }
    }
});

// * For Airtable Scripts
// const inputConfig = input.config();

// const body = {
//     recordID: inputConfig.recordID,
//     baseID: "",
//     client: "",
// };

// const response = await fetch("https://google.com/glideAppLeads", {
//     method: "POST",
//     body: JSON.stringify(body),
//     headers: {
//         "Content-Type": "application/json",
//     },
// });
