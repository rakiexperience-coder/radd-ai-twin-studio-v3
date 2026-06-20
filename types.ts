
export type AspectRatio = '1:1' | '3:4' | '9:16';

export interface GenerationSettings {
  prompt: string;
  numImages: number;
  aspectRatio: AspectRatio;
  enhanceResolution: boolean;
}
