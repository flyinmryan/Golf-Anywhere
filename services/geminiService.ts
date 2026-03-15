import { GoogleGenAI, Type } from "@google/genai";
import { GolfStyleOption } from "../types";

// We create a fresh instance every time to ensure we capture the latest API key
const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    console.warn("Gemini API key not found in env or localStorage");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateTitleFromPrompt = async (promptText: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Summarize this golf course design description into a catchy, specific title of 4 words or less. Description: "${promptText}"`,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: 'text/plain',
      }
    });
    const text = await response.response;
    return text.text()?.trim().replace(/^"|"$/g, '') || "New Design";
  } catch (e) {
    console.error("Title generation failed", e);
    return "New Design";
  }
};

import { STYLES } from "../data/styleOptions";

export const analyzeUserImage = async (base64Image: string): Promise<{ terrain: 'Inland' | 'Coastal' | 'Arid' | 'All'; recommendedStyleId?: string | null }> => {
  const ai = getAiClient();
  
  // Flatten styles for the prompt
  const availableStyles = STYLES.flatMap(cat => cat.items.map(item => ({
    id: item.id,
    label: item.label,
    desc: item.desc,
    category: cat.category
  })));

  try {
    const [mimeType, data] = base64Image.split(';base64,');
    
    const prompt = `
      Analyze the landscape in this photo.
      
      1. Determine the terrain type ('Inland', 'Coastal', or 'Arid').
      2. Recommend the ONE best matching golf course architectural style from the list below to start with.
         - Choose a style that would complement the existing topography, vegetation, and climate.
         - Consider the most natural fit for the land provided.
      
      Available Styles:
      ${JSON.stringify(availableStyles.map(s => ({ id: s.id, label: s.label, desc: s.desc, category: s.category })), null, 2)}
      
      Return STRICT JSON:
      {
        "terrain": "Inland" | "Coastal" | "Arid",
        "recommendedStyleId": "string (must match one of the IDs above)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: [
        {
          inlineData: {
            mimeType: mimeType.split(':')[1] || 'image/jpeg',
            data: data
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 },
      }
    });
    
    const res = await response.response;
    const text = res.text();
    if (!text) return { terrain: 'All', recommendedStyleId: null };
    
    const result = JSON.parse(text);
    return {
      terrain: result.terrain || 'All',
      recommendedStyleId: result.recommendedStyleId || null
    };
    
  } catch (e) {
    console.warn("Analysis failed, defaulting to All", e);
    return { terrain: 'All', recommendedStyleId: null };
  }
};

export const generateStyleSuggestions = async (
  baseContext: string
): Promise<GolfStyleOption[]> => {
  const ai = getAiClient();
  
  const prompt = `
    Suggest 6 world-class, distinct golf course architectural styles or features for a design app. 
    Context: ${baseContext}.
    
    Return a JSON list. 
    Each item should have:
    - id: unique string
    - label: short, punchy name (e.g. "Island Green", "Pot Bunkers")
    - description: A clear, visual description of the feature or style and how it impacts the landscape.
    - category: one of ["terrain", "bunkering", "greens", "aesthetic"] (lowercase)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ['id', 'label', 'description', 'category']
          }
        }
      }
    });

    const res = await response.response;
    const text = res.text();
    if (!text) return [];
    
    const parsed = JSON.parse(text);
    
    return parsed.map((item: any) => ({
      ...item,
      category: (item.category?.toLowerCase() as any) || 'aesthetic'
    })) as GolfStyleOption[];
    
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [
      { 
        id: '1', 
        label: 'Elevated Tees', 
        description: 'Tee boxes perched high above the fairway for dramatic vistas.', 
        category: 'terrain',
      },
      { 
        id: '2', 
        label: 'Wasted Bunkers', 
        description: 'Large, unraked sandy areas that blend into the natural scrub.', 
        category: 'bunkering',
      },
      { 
        id: '3', 
        label: 'Double Green', 
        description: 'A massive shared green serving two different holes.', 
        category: 'greens',
      },
    ];
  }
};

export const generateGolfCourseImage = async (
  images: { main: string | null; aerial: string | null; perspective: string | null },
  styleDescription: string,
  styleReferenceImage: string | null = null,
  styleReferenceUrl: string | null = null,
  onThinking?: (thought: string) => void
): Promise<string> => {
  const ai = getAiClient();
  
  const parts: any[] = [];
  
  if (images.main) {
    const [mimeType, data] = images.main.split(';base64,');
    parts.push({
      inlineData: {
        mimeType: mimeType.split(':')[1] || 'image/jpeg',
        data: data
      }
    });
  }
  if (images.aerial) {
    const [mimeType, data] = images.aerial.split(';base64,');
    parts.push({
      inlineData: {
        mimeType: mimeType.split(':')[1] || 'image/jpeg',
        data: data
      }
    });
  }

  if (styleReferenceImage) {
    const [mimeType, data] = styleReferenceImage.split(';base64,');
    parts.push({
      inlineData: {
        mimeType: mimeType.split(':')[1] || 'image/jpeg',
        data: data
      }
    });
  }

  let promptText = `
    You are a world-class golf course architect and visual artist.
    
    TASK: Design and render a professional golf course hole on the LANDSCAPE provided in the first image(s).
    
    STYLE INSTRUCTION: "${styleDescription}"
    ${styleReferenceUrl ? `DESIGN INSPIRATION URL: ${styleReferenceUrl} (Incorporate the architectural vibe from this course).` : ''}
  `;

  if (styleReferenceImage) {
    promptText += `
    CRITICAL: The FINAL image provided in the input sequence is a REFERENCE IMAGE for the design style.
    - Extract the architectural elements (bunkering style, grass type, green design) from that Reference Image.
    - Apply it seamlessly to the Landscape provided in the first images.
    `;
  }

  promptText += `
    Output Requirement:
    - Generate a single high-resolution, hyper-realistic architectural visualization.
    - Maintain the core topography and landmark features of the original landscape.
    - Seamlessly integrate fairways, greens, bunkers, and hazards as if they were professionally constructed on that site.
    - Ensure lighting, shadows, and textures are photorealistic.
    - Avoid any human figures, golf carts, or non-natural structures unless requested.
    - The output should be a single 16:9 panoramic view of the redesigned landscape.
  `;

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-image-preview',
      contents: parts,
      config: {
        imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
        },
        thinkingConfig: {
            includeThoughts: true
        }
      }
    });

    let finalImageProp: any = null;

    for await (const chunk of response) {
        for (const part of chunk.candidates?.[0]?.content?.parts || []) {
            if (part.thought && onThinking) {
                onThinking(part.text || '');
            }
            if (part.inlineData) {
                finalImageProp = part.inlineData;
            }
        }
    }

    if (finalImageProp) {
        return `data:${finalImageProp.mimeType};base64,${finalImageProp.data}`;
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};

export const refineGolfCourseImage = async (
  currentImage: string,
  refinementInstruction: string,
  styleReferenceImage: string | null = null,
  styleReferenceUrl: string | null = null,
  onThinking?: (thought: string) => void
): Promise<string> => {
  const ai = getAiClient();
  
  const parts: any[] = [];

  const [mimeType, data] = currentImage.split(';base64,');
  parts.push({
    inlineData: {
      mimeType: mimeType.split(':')[1] || 'image/jpeg',
      data: data
    }
  });

  if (styleReferenceImage) {
    const [refMimeType, refData] = styleReferenceImage.split(';base64,');
    parts.push({
      inlineData: {
        mimeType: refMimeType.split(':')[1] || 'image/jpeg',
        data: refData
      }
    });
  }

  let promptText = `
    You are a professional golf course architect editing a design visualization.
    
    IMAGE CONTEXT:
    - The FIRST image provided is the "Current Design Result".
    ${styleReferenceImage ? '- The SECOND image provided is a "Style/Feature Reference".' : ''}
    
    INSTRUCTION: "${refinementInstruction}"
    ${styleReferenceUrl ? `DESIGN INSPIRATION URL: ${styleReferenceUrl}` : ''}
    
    RULES:
    1. MODIFY ONLY the architectural elements (greens, bunkers, fairways, hazards) according to the instruction. 
    ${styleReferenceImage ? '2. USE the style/texture from the second image as the source of truth for the change.' : ''}
    3. PRESERVE the existing landscape's topography and natural features that were not part of the instruction.
    4. Ensure the changes look like they were naturally integrated into the site.
  `;

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-image-preview',
      contents: parts,
      config: {
        imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
        },
        thinkingConfig: {
            includeThoughts: true
        }
      }
    });

    let finalImageProp: any = null;

    for await (const chunk of response) {
        for (const part of chunk.candidates?.[0]?.content?.parts || []) {
            if (part.thought && onThinking) {
                 onThinking(part.text || '');
            }
            if (part.inlineData) {
                finalImageProp = part.inlineData;
            }
        }
    }

    if (finalImageProp) {
        return `data:${finalImageProp.mimeType};base64,${finalImageProp.data}`;
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image refinement failed:", error);
    throw error;
  }
};