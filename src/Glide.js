require("dotenv").config();

const axios = require("axios");

class Glide {
    constructor(apiKey, appID) {
        if (!apiKey) {
            throw new Error("Using Glideapps requires an API key.");
        }
        if (!appID) {
            throw new Error("Using Glideapps requires an App ID.");
        }

        this.apiKey = apiKey;
        this.appID = appID;
    }

    async addRow(row) {
        try {
            const { data } = await axios.post(
                "https://us-central1-glide-prod.cloudfunctions.net/mutateTables",
                {
                    appID: this.appID,
                    mutations: [
                        {
                            kind: "add-row-to-table",
                            tableName: "native-table-s9sxLTYp7zpeJAXlBYRq",
                            columnValues: row,
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            );

            return data;
        } catch (error) {
            console.log("addRow() ---", error);
            console.log("row:", row["Full Name"]);
            return false;
        }
    }

    formatRow(client, prospect) {
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

        return {
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
            Status: "New Lead",
            Response: prospect.Response || "",
            "Response Date": new Date(prospect["Response Date"]) || "", // Response Date
            "Year Built": Number(prospect["Year Built"]) || "",
            "Building Type": prospect["Building Type"] || "",
            Title: prospect.Title || "",
            Comments: prospect.Comments || "",
            Client: client, // Custom per client
            "Prospect Rating": 0,
            "Sales Rep": "",
            Filter: "",
        };
    }
}

module.exports = new Glide(process.env.GLIDE_API_KEY, process.env.APP_ID);
