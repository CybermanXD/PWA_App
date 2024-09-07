// netlify/functions/env.js
exports.handler = async function(event, context) {
    if (!process.env.GOOGLE_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "GOOGLE_API_KEY is not set" }),
        };
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({ GOOGLE_API_KEY: process.env.GOOGLE_API_KEY }),
    };
};

