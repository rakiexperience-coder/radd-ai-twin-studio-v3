
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

/**
 * Generates images based on a reference image and a detailed prompt.
 * @param base64Image The base64 encoded reference image string.
 * @param mimeType The MIME type of the image.
 * @param prompt The user's creative prompt.
 * @param numberOfImages The number of images to generate.
 * @param aspectRatio The aspect ratio for the images.
 * @returns A promise that resolves to an array of base64 image strings.
 */
export const generateImages = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  numberOfImages: number,
  aspectRatio: AspectRatio,
): Promise<string[]> => {
  // Initialize right before use to ensure the most up-to-date key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const generatedImages: string[] = [];

  for (let i = 0; i < numberOfImages; i++) {
    const primaryPrompt = `
**Creative Brief:**
**Task:** Generate a new, artistic, editorial-style photograph.
**Reference Image:** Use the provided photo strictly for subject identity and facial feature preservation.
**Scene & Style:** The creative concept is: "${prompt}". The style should be high-end, professional, and visually compelling.
**Important:** Do not replicate the background or clothing from the reference. Create a completely new image based on the scene description. The final output must have an aspect ratio of ${aspectRatio}.
`;

    const retryPrompt = `
**Creative Brief (Artistic Interpretation):**
**Task:** Generate a stylized, elegant artwork inspired by the reference photo.
**Reference Image:** Use for identity resemblance only. The goal is an artistic piece, not a photograph.
**Scene & Style:** The creative concept is: "${prompt}". Focus on mood, lighting, and composition.
**Important:** The result must be a new creation, not an edit. The final output must have an aspect ratio of ${aspectRatio}.
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: { parts: [imagePart, { text: primaryPrompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
          temperature: 0.4,
        },
      });

      const candidate = response.candidates?.[0];
      if (!candidate || (candidate.finishReason && candidate.finishReason !== 'STOP')) {
        throw new Error('Primary generation blocked');
      }

      const imageResponsePart = candidate.content?.parts?.find(part => part.inlineData);
      if (imageResponsePart?.inlineData) {
        generatedImages.push(imageResponsePart.inlineData.data);
      } else {
        throw new Error('No image data');
      }
    } catch (error) {
      console.warn('Attempting retry with softer prompt...');
      
      const retryResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: { parts: [imagePart, { text: retryPrompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
          temperature: 0.5,
        },
      });
      
      const retryCandidate = retryResponse.candidates?.[0];
      if (!retryCandidate || (retryCandidate.finishReason && retryCandidate.finishReason !== 'STOP')) {
        const reason = retryCandidate?.finishReason || 'Unknown';
        throw new Error(`Blocked by safety filter (${reason}). Try a safer prompt.`);
      }
      
      const retryImageResponsePart = retryCandidate.content?.parts?.find(part => part.inlineData);
      if (retryImageResponsePart?.inlineData) {
        generatedImages.push(retryImageResponsePart.inlineData.data);
      } else {
        throw new Error('Generation failed.');
      }
    }
  }

  return generatedImages;
};

