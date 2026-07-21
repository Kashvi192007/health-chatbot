export default async function handler(req, res) {

    // Sirf POST request allow karenge
    if (req.method !== "POST") {
        return res.status(405).json({
            reply: "Method Not Allowed"
        });
    }

    try {

        const { messages } = req.body;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: messages.map(m => ({
                        role: m.role === "assistant" ? "model" : "user",
                        parts: [
                            {
                                text: m.content
                            }
                        ]
                    }))
                })
            }
        );

        const data = await response.json();

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response.";

        res.status(200).json({
            reply
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            reply: "Server Error"
        });

    }

}