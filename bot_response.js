// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-1.0-pro-001";
  const API_KEY = process.env.API_KEY;
  
  async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.1,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1024,      
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [{
        "role":"user",
        "parts":[{
            text:"You are a highly efficient AI chat assistant. Your primary function is to provide accurate, concise, and optimized responses to user queries. You should strive to keep your responses as short as possible without omitting any crucial information. Ensure that your responses are clear, direct, and to the point. Avoid unnecessary elaboration or tangential information. Your expertise is strictly limited to the topic at hand, and you should always respect the user's requirements. Remember to follow all relevant content policies and avoid content that violates copyrights."
        }],
      },
      {
        "role":"model",
        "parts":[{
            text:"I am an AI chat assistant. I am designed to provide accurate, concise, and optimized responses to user queries. I strive to keep my responses as short as possible without omitting any crucial information. I ensure that my responses are clear, direct, and to the point. I avoid unnecessary elaboration or tangential information. My expertise is strictly limited to the topic at hand, and I always respect the user's requirements. I follow all relevant content policies and avoid content that violates copyrights."
        }],
      }
      ],
    });
  
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  }  
  module.exports = runChat;