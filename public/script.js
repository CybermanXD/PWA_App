// Function to fetch the environment variable from Netlify
async function getEnvVariable() {
    const response = await fetch('/.netlify/functions/env');
    const data = await response.json();
    return data.GOOGLE_API_KEY;
}

// Function to call Google Generative AI
async function generateNotes(novelName, authorName, apiKey) {
    const endpoint = `https://generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${apiKey}`;
    
    const prompt = `Please generate a detailed analysis of ${novelName} by ${authorName}, including an introduction, summary, and key themes.`;
    
    const requestBody = {
        prompt,
        maxOutputTokens: 1024
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    
    if (result?.predictions?.length) {
        return result.predictions[0].output;
    }

    return "Error generating notes.";
}

// Handle the 'Generate Notes' button click
document.getElementById("generate-button").addEventListener("click", async () => {
    const novelName = document.getElementById("novel-name").value;
    const authorName = document.getElementById("author-name").value;

    if (novelName && authorName) {
        const apiKey = await getEnvVariable();
        const notes = await generateNotes(novelName, authorName, apiKey);
        document.getElementById("output").innerText = notes;

        document.getElementById("export-pdf-button").disabled = false;
        document.getElementById("export-doc-button").disabled = false;

        localStorage.setItem("generatedNotes", notes); // Save to localStorage for later export
    } else {
        document.getElementById("output").innerText = "Please provide both novel and author names.";
    }
});

// Export to PDF
document.getElementById("export-pdf-button").addEventListener("click", () => {
    const notes = localStorage.getItem("generatedNotes");
    if (notes) {
        const doc = new jsPDF();
        doc.text(notes, 10, 10);
        doc.save("notes.pdf");
    }
});

// Export to DOC
document.getElementById("export-doc-button").addEventListener("click", () => {
    const notes = localStorage.getItem("generatedNotes");
    if (notes) {
        const blob = new Blob([notes], { type: "application/msword" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "notes.doc";
        link.click();
    }
});
 
