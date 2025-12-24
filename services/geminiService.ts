
import { GoogleGenAI } from "@google/genai";
import { VerificationResult, GroundingSource } from "../types";

export async function verifyContent(
  text: string, 
  imageUri?: string
): Promise<VerificationResult> {
  const ai = new GoogleGenAI({ apiKey: 'AIzaSyDkSB_tpv5ikGvyYBOEUAMTCsqgyxs7EJs' || '' });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are VeriFact, a specialized investigative agent designed to debunk WhatsApp and social media misinformation.
    
    TASK: Analyze the provided content (text/image) for truthfulness. 
    
    CONTEXTUAL CLUES:
    - Look for "Chain Letter" indicators (e.g., "Forward to 10 friends", "Urgent warning from NASA/WHO").
    - Detect emotional manipulation or "Clickbait" styles.
    - Check if the claim has been debunked by major fact-checking organizations (FactCheck.org, Snopes, Reuters, etc.).
    
    OUTPUT REQUIREMENTS:
    1. TRUST_SCORE: 0-100 (100 = Absolutely True, 0 = Complete Scam/Fake).
    2. VERDICT: One of [Reliable, Partially True, Misleading, Fake].
    3. SUMMARY: A bold, headline-style summary of the reality.
    4. FINDINGS: Concise bullet points of why this is true or false. Explain the "Scam Pattern" if applicable.
    
    Structure your markdown response:
    # TRUST_SCORE: [Number]
    # VERDICT: [Category]
    # SUMMARY: [Headline]
    # FINDINGS: [Bullets]
  `;

  const contents: any[] = [{ text: text || "Analyze this screenshot content" }];
  
  if (imageUri) {
    const base64Data = imageUri.split(',')[1];
    const mimeType = imageUri.split(';')[0].split(':')[1];
    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const textOutput = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const scoreMatch = textOutput.match(/TRUST_SCORE:\s*(\d+)/i);
    const verdictMatch = textOutput.match(/VERDICT:\s*(\w+(?:\s\w+)?)/i);
    const summaryMatch = textOutput.match(/SUMMARY:\s*([^\n#]+)/i);
    const findingsMatch = textOutput.match(/FINDINGS:\s*([\s\S]*)/i);

    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Reference Source",
        uri: chunk.web.uri
      }))
      // Filter out duplicate URIs
      .filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    return {
      score: scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : 50,
      verdict: (verdictMatch ? verdictMatch[1].trim() : 'Unknown') as any,
      summary: summaryMatch ? summaryMatch[1].trim() : "Unable to verify claim.",
      details: findingsMatch ? findingsMatch[1].trim() : "No detailed findings available.",
      sources,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Verification error:", error);
    throw new Error("I'm having trouble connecting to my verification databases. Please try again.");
  }
}
