import Groq from 'groq-sdk';
import User from '../models/User.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Generate code using a multi-agent pipeline
// @route   POST /api/ai/generate
// @access  Private
export const generateCode = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user._id;

    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    // --- Agent 1: The Architect ---
    const architectResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a MERN Stack Architect. Create a technical blueprint for the user's request. List the required files and briefly explain the architecture."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
    });

    const blueprint = architectResponse.choices[0].message.content;

    // --- Agent 2: The Developer (JSON Output Mode) ---
    const developerResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }, 
      messages: [
        {
          role: "system",
          content: `You are an expert full-stack developer. Based on this blueprint:
          ${blueprint}
          
          Generate the actual code for the project. 
          You MUST respond with a strictly valid JSON object. 
          The JSON must have a single top-level key called "files". 
          Inside "files", the keys should be the file paths (e.g., "src/App.jsx", "src/components/Header.jsx", "package.json") and the values must be the exact raw code for that file.
          DO NOT include any markdown formatting outside the JSON.`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const generatedData = JSON.parse(developerResponse.choices[0].message.content);

    // Deduct Credit
    const user = await User.findById(userId);
    if (user) {
      user.generationsCount += 1;
      await user.save();
    }

    res.status(200).json({
      blueprint: blueprint,
      files: generatedData.files, 
      generationsUsed: user ? user.generationsCount : 0
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: 'Error generating code. Please try again.' });
  }
};

// @desc    Modify a single file's code
// @route   POST /api/ai/modify
// @access  Private
export const modifyFile = async (req, res) => {
  try {
    const { prompt, currentCode, fileName } = req.body;
    const userId = req.user._id;

    if (!prompt || !currentCode) {
      return res.status(400).json({ message: 'Prompt and current code are required' });
    }

    // --- The Editor Agent ---
    const editorResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert developer modifying an existing file named: ${fileName}.
          
          Here is the current code:
          \n\n${currentCode}\n\n
          
          Update this code exactly as the user requests. 
          IMPORTANT: Return ONLY the raw updated code. Do NOT include markdown code blocks (like \`\`\`javascript). Do NOT include any explanations. Just output the raw code so it can be directly injected into a file.`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5, 
    });

    let updatedCode = editorResponse.choices[0].message.content;

    // Failsafe: Strip markdown code blocks if the AI stubbornly adds them
    if (updatedCode.startsWith('```')) {
      updatedCode = updatedCode.replace(/```[a-z]*\n/gi, '').replace(/```$/g, '');
    }

    // Optional: Deduct credits here if you want to charge for edits
    const user = await User.findById(userId);
    if (user) {
      user.generationsCount += 1;
      await user.save();
    }

    res.status(200).json({ code: updatedCode });

  } catch (error) {
    console.error("AI Modification Error:", error);
    res.status(500).json({ message: 'Error modifying code.' });
  }
};