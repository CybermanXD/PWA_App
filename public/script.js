// public/script.js
async function generateNotes(novelName, authorName) {
    const endpoint = '/.netlify/functions/env';
    
    const prompt = `Please generate a detailed analysis of ${novelName} by ${authorName}, including an introduction, summary, and key themes.`;
    
    const requestBody = { prompt };

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
        return result.text;
    } catch (error) {
        console.error("Error generating notes:", error);
        return "Error generating notes.";
    }
}

document.getElementById("generate-button").addEventListener("click", async () => {
    const novelName = document.getElementById("novel-name").value;
    const authorName = document.getElementById("author-name").value;

    if (novelName && authorName) {
        const notes = await generateNotes(novelName, authorName);
        document.getElementById("output").innerText = notes;

        document.getElementById("export-pdf-button").disabled = false;
        document.getElementById("export-doc-button").disabled = false;

        localStorage.setItem("generatedNotes", notes); // Save to localStorage for later export
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
