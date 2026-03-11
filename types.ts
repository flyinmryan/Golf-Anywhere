
export interface GolfStyleOption {
  id: string;
  label: string;
  description: string;
  category: 'terrain' | 'bunkering' | 'greens' | 'aesthetic';
  imageUrl?: string;
}

export interface GeneratedImage {
  id: string; // Unique ID for tracking
  url: string;
  prompt: string;
  title?: string; // Short AI-generated title
  timestamp: number;
}

export type ViewType = 'main' | 'aerial' | 'perspective';

export interface UploadedImages {
  main: string | null; // base64
  aerial: string | null; // base64
  perspective: string | null; // base64
}

export interface AppState {
  step: 'upload' | 'style' | 'generating' | 'result';
  images: UploadedImages;
  selectedStyle: string;
  customPrompt: string;
  styleReferenceImage: string | null; // New: User uploaded style reference
  styleReferenceUrl: string | null;   // New: YouTube/TikTok URL
  generatedResult: GeneratedImage | null;
  history: GeneratedImage[]; // Track versions for undo/redo
  theme: 'light' | 'dark';
  isMarketingModalOpen: boolean; // Hook for CTAs
}

// Augment the global Window interface for AIStudio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
