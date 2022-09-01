// payload={"text": "A very important thing has occurred! <https://alert-system.com/alerts/1234|Click here> for details!"}
require("dotenv").config();

const axios = require("axios");

module.exports = async (text) => {
    // notify me about this in Slack
    await axios.post(process.env.SLACK_ERROR_ALERTS, {
        text,
    });
};
