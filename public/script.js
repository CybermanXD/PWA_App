async function getEnvVariable() {
    try {
        const response = await fetch('/.netlify/functions/env');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.GOOGLE_API_KEY;
    } catch (error) {
        console.error("Error fetching environment variable:", error);
        return null;
    }
}

async function generateNotes(novelName, authorName, apiKey) {
    const endpoint = `https://your-api-endpoint.com/generate?key=${apiKey}`;
    
    const prompt = `Please generate a detailed analysis of ${novelName} by ${authorName}, including an introduction, summary, and key themes.`;
    
    const requestBody = {
        prompt,
        maxOutputTokens: 1024
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result?.predictions?.length) {
            return result.predictions[0].output;
        } else {
            return "Error generating notes.";
        }
    } catch (error) {
        console.error("Error generating notes:", error);
        return "Error generating notes.";
    }
}

document.getElementById("generate-button").addEventListener("click", async () => {
    const novelName = document.getElementById("novel-name").value;
    const authorName = document.getElementById("author-name").value;

    if (novelName && authorName) {
        const apiKey = await getEnvVariable();
        if (apiKey) {
            const notes = await generateNotes(novelName, authorName, apiKey);
            document.getElementById("output").innerText = notes;

            document.getElementById("export-pdf-button").disabled = false;
            document.getElementById("export-doc-button").disabled = false;

            localStorage.setItem("generatedNotes", notes); // Save to localStorage for later export
        } else {
            document.getElementById("output").innerText = "Error retrieving API key.";
        }
    } else {
        document.getElementById("output").innerText = "Please provide both novel and author names.";
    }
});

document.getElementById("export-pdf-button").addEventListener("click", () => {
    const notes = localStorage.getItem("generatedNotes");
    if (notes) {
        const doc = new jsPDF();
        doc.text(notes, 10, 10);
        doc.save("notes.pdf");
    }
});

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
