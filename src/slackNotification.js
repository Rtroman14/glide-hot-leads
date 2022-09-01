// payload={"text": "A very important thing has occurred! <https://alert-system.com/alerts/1234|Click here> for details!"}
require("dotenv").config();

const axios = require("axios");

module.exports = async (preview, req, error) => {
    const googleCloudLogs =
        "https://console.cloud.google.com/functions/details/us-central1/glide-app-leads?env=gen2&cloudshell=false&project=plenary-atrium-361021&tab=logs";
    // notify me about this in Slack
    await axios.post(process.env.SLACK_ERROR_ALERTS, {
        text: preview,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `<${googleCloudLogs}|${error}> \n>*client*: ${
                        req.client || ""
                    } \n>*baseID*: <https://airtable.com/${req.baseID}|${
                        req.baseID
                    }> \n>*recordID*: ${req.recordID || ""}`,
                },
            },
        ],
    });
};
