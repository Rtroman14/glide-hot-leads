require("dotenv").config();

const Airtable = require("airtable");

class AirtableApi {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("Using Airtable requires an API key.");
        }

        this.apiKey = apiKey;
    }

    async config(baseID) {
        try {
            return new Airtable({ apiKey: this.apiKey }).base(baseID);
        } catch (error) {
            console.log("NO API KEY PROVIDED ---", error);
        }
    }

    async getRecord(baseID, recordID) {
        try {
            const base = await this.config(baseID);

            const res = await base("Prospects").find(recordID);

            return { ...res.fields, id: recordID };
        } catch (error) {
            console.log("ERROR - getRecord() ---", error);
            return false;
        }
    }

    async getView(baseID, table, view) {
        try {
            const base = await this.config(baseID);

            const records = await base(table).select({ view }).all();

            const contacts = records.map((record) => {
                return {
                    ...record.fields,
                    recordID: record.getId(),
                };
            });

            return contacts;
        } catch (error) {
            console.log("getView() ---", error);
            return false;
        }
    }
}

module.exports = new AirtableApi(process.env.AIRTABLE_API_KEY);
