const axios = require("axios");

exports.executeCode = async (req, res) => {
    const { language, code } = req.body;

    const submissionData = {
        source_code: code,
        language_id: language,
        stdin: "",
    };

    try {
        const response = await axios.post("https://judge0-ce.p.rapidapi.com/submissions", submissionData, {
            headers: {
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            },
        });

        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Execution failed" });
    }
};
