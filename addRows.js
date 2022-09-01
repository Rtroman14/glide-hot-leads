const Airtable = require("./src/Airtable");
const Glide = require("./src/Glide");

const isThisMonth = require("date-fns/isThisMonth");

const BASE_ID = "appLVlpoe7RYAQfm9"; // Integrity
const client = "iprdenver.com";

(async () => {
    try {
        let hotLeads = await Airtable.getView(BASE_ID, "Prospects", "Hot Leads");
        hotLeads = hotLeads.filter((lead) => isThisMonth(new Date(lead["Response Date"])));

        const glideFormatedProspects = hotLeads.map((prospect) =>
            Glide.formatRow(client, prospect)
        );

        console.log("Total hot leads:", hotLeads.length);

        for (let formatedProspect of glideFormatedProspects) {
            const [newRow] = await Glide.addRow(formatedProspect);

            console.log(`NEW LEAD! | rowID: ${newRow.rowID} | client: ${client}`);
        }
    } catch (error) {
        console.log(error);
    }
})();
