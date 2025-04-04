import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
  });
  
  const generationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];
  
  const CHAT_HISTORY = [
    {
      role: "user",
      parts: [{
        text: `You are an expert travel planner. Always:
        1. Respond in strict JSON format
        2. Use REAL image URLs (no placeholders)
        3. Provide current, verifiable data
        4. Include all requested details
        5. Format coordinates as {lat, lng}`
      }]
    },
    {
      role: "model",
      parts: [{
        text: JSON.stringify({
          acknowledgement: "Understood. I will provide complete travel plans with real data in the requested JSON format."
        })
      }]
    }
  ];
  
  export const generateTravelPlan = async (prompt) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: CHAT_HISTORY
      });
  
      console.log("Sending prompt to AI:", prompt);
      const result = await chatSession.sendMessage(prompt);
      const response = result.response.text();
      
      console.log("Raw AI Response:", response);
      
      // Validate response contains required fields
      if (!response.includes('"travelPlan"') || 
          !response.includes('"hotels"') || 
          !response.includes('"itinerary"')) {
        throw new Error('Invalid response structure from AI');
      }
      
      const jsonResponse = JSON.parse(response);
      
      // Additional validation
      if (!jsonResponse.travelPlan || 
          !Array.isArray(jsonResponse.travelPlan.hotels) || 
          !Array.isArray(jsonResponse.travelPlan.itinerary)) {
        throw new Error('Missing required fields in AI response');
      }
      
      return jsonResponse;
      
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error(`Failed to generate travel plan: ${error.message}`);
    }
  };