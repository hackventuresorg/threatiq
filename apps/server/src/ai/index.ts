import Groq from "groq-sdk";
import { GROQ_API_KEY } from "../environments";

class GroqClient {
  private static instance: GroqClient | null = null;
  private client: Groq;

  private constructor() {
    this.client = new Groq({ apiKey: GROQ_API_KEY });
  }

  public static getInstance(): GroqClient {
    if (!GroqClient.instance) {
      GroqClient.instance = new GroqClient();
    }
    return GroqClient.instance;
  }

  public getClient(): Groq {
    return this.client;
  }

  public async detectThreat(imgUrl: string) {
    const detect = await this.client.chat.completions.create({
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
      const data = this.extractPureJson(rawContent);
      return data;
    } else {
      return { error: "failed to generate data" };
    }
  }

  public async analyzeImageBuffer(imageBuffer: Buffer) {
    try {
      const base64Image = imageBuffer.toString("base64");
      const imgUrl = `data:image/jpeg;base64,${base64Image}`;

      const result = await this.detectThreat(imgUrl);

      return {
        detected: result.suspicious === "Yes",
        type: result.weapon_detected ? "weapon" : "suspicious_behavior",
        confidence: result.confidence || 0,
        risk_score: result.risk_score || 0,
        details: {
          reason: result.reason,
          people_count: result.people_count,
          possible_actions: result.possible_actions,
          faces_visible: result.faces_visible,
        },
      };
    } catch (err: any) {
      console.error("Error analyzing image:", err.message);
      return { detected: false };
    }
  }

  //   public async analyseThreatData(threatData: any) {
  //     const analysis = await this.client.chat.completions.create({
  //       messages: [
  //         {
  //           role: "system",
  //           content: `
  //             You are a security analysis AI trained to interpret and provide recommendations based on threat detection data.

  //             Return your answer strictly in this JSON format:
  //             {
  //               "summary": string,                   // Brief summary of the situation
  //               "severity_level": "Low" | "Medium" | "High" | "Critical",
  //               "recommendations": string[],         // List of actionable recommendations
  //               "need_human_review": boolean,        // Whether human review is needed
  //               "immediate_action_required": boolean // Whether immediate action is required
  //             }
  //             `.trim(),
  //         },
  //         {
  //           role: "user",
  //           content: `Analyze this threat detection data and provide recommendations: ${JSON.stringify(threatData)}`,
  //         },
  //       ],
  //       model: "llama4-8b-preview",
  //       temperature: 0.7,
  //       max_completion_tokens: 1024,
  //       top_p: 1,
  //     });

  //     const rawContent = analysis.choices[0].message.content;
  //     if (rawContent) {
  //       const data = this.extractPureJson(rawContent);
  //       return data;
  //     } else {
  //       return { error: "failed to generate analysis" };
  //     }
  //   }

  private extractPureJson(content: string) {
    return JSON.parse(
      content
        .replace(/```json\s*/i, "")
        .replace(/```$/, "")
        .trim()
    );
  }
}

export const groqClient = GroqClient.getInstance();
