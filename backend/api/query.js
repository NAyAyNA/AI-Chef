import axios from "axios";

export default async function handler(req, res) {
    // Enable CORS for all origins or specify a particular origin (e.g., 'http://localhost:5173')
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or replace '*' with your frontend's URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow headers

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Send 200 OK response for OPTIONS
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
    const HF_API_KEY = process.env.HF_API_KEY;
    //old: const url = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
    //mistralai/Mistral-7B-Instruct-v0.2
    try {
        console.log("REQ BODY:", req.body);
        const response = await axios.post(
            HF_API_URL,
            {
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                messages: [
                    { role: "user", content: req.body }
                ],
                max_tokens: 300
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 20000 // Set timeout to 20 seconds
            }
        );
        res.json(response.data);
        console.log("🔥 QUERY.JS DEPLOYED - HF ROUTER FIXED");
    } catch (err) {
        console.error("Hugging Face API Error:", err.response?.data || err.message);

        if (err.code === 'ECONNABORTED') {
            // Handle timeout error specifically
            return res.status(504).json({ error: "Request Timeout" });
        }

        res.status(500).json({ error: "Error fetching data" });
    }
}
