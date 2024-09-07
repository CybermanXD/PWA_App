// netlify/functions/env.js
exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ GOOGLE_API_KEY: process.env.GOOGLE_API_KEY }),
    };
};
 
