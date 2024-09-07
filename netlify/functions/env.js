// netlify/functions/env.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async function(event, context) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API_KEY is not set" }),
        };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const prompt = JSON.parse(event.body).prompt;
        const result = await model.generateContent(prompt);
        return {
            statusCode: 200,
            body: JSON.stringify({ text: result.response.text() }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
