import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: VITE_GEMINI_API_KEY not found in .env file");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });
const IMAGE_MODEL = "gemini-3-pro-image-preview";

async function generateImage(prompt: string, filename: string) {
  console.log(`Generating image for: ${prompt}`);
  try {
    const result = await genAI.models.generateContent({
      model: IMAGE_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        // @ts-ignore
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    const candidates = result.candidates;
    let imageBase64 = null;
    
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
             if (part.inlineData) {
                imageBase64 = part.inlineData.data;
                break;
             }
        }
    }

    if (imageBase64) {
      const buffer = Buffer.from(imageBase64, 'base64');
      const filepath = path.join(process.cwd(), 'public/images', filename);
      fs.writeFileSync(filepath, buffer);
      console.log(`Successfully saved image to ${filepath}`);
    } else {
      console.error(`No image data received for ${prompt}`);
    }
  } catch (error) {
    console.error(`Error generating image for ${prompt}:`, error);
  }
}

async function main() {
  const imagesToGenerate = [
    {
      prompt: "A hyper-realistic aerial view of a professional golf course hole. Lush green fairways winding through a mature forest. Large white sand bunkers with frayed edges. A tiered green protected by a small winding stream. Photorealistic, 8k, architectural visualization.",
      filename: "parkland-sample.png"
    },
    {
      prompt: "A hyper-realistic view of a traditional links golf course. Wind-swept sand dunes with tall fescue grass. Deep, dark pot bunkers with sod-walled faces. The ocean visible in the background under a dramatic sunset. Photorealistic, architectural visualization.",
      filename: "links-sample.png"
    },
    {
      prompt: "A hyper-realistic view of a desert golf course. Vibrant emerald green grass contrasting sharply with orange sand and rugged rock formations. Waste areas with cacti and desert scrub. Clear blue sky. Photorealistic, architectural visualization.",
      filename: "desert-sample.png"
    }
  ];

  const dir = path.join(process.cwd(), 'public/images');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const item of imagesToGenerate) {
    await generateImage(item.prompt, item.filename);
    console.log("Waiting 10 seconds before next request...");
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

main();
