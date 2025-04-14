import { groq } from ".";

export async function detectThreat(imgUrl: string) {
  const detect = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are a computer vision AI assistant trained to analyze surveillance camera images and detect potentially suspicious or theft-related behavior.
          
          Return your answer **strictly in this raw JSON format only** — do not use markdown, backticks, or any explanation.
          
          JSON structure:
          {
            "suspicious": "Yes" | "No",
            "risk_score": number,              // 0 to 10
            "confidence": number,              // 0.0 to 1.0
            "reason": string,                  // Short explanation
            "weapon_detected": boolean,        // true or false
            "faces_visible": number,           // Count of visible faces
            "people_count": number,            // Count of people in image
            "possible_actions": string[]       // e.g., ["hiding item", "watching cashier"]
          }
          
          ⚠️ Output only raw JSON. Do not wrap it in backticks, markdown, or add any commentary.
          `.trim(),
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image from a store's CCTV for theft or threat detection.",
          },
          {
            type: "image_url",
            image_url: {
              url: `${imgUrl}`,
            },
          },
        ],
      },
    ],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
  });

  const rawContent = detect.choices[0].message.content;
  if (rawContent) {
    const data = extractPureJson(rawContent);
    return data;
  } else {
    return { error: "failed to generate data" };
  }
}

function extractPureJson(content: string) {
  return JSON.parse(
    content
      .replace(/```json\s*/i, "") 
      .replace(/```$/, "") 
      .trim()
  );
}
