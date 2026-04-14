
export interface SearchResult {
  id: string;
  url: string;
  thumbnail: string;
  author: string;
  source: string;
}

export const searchImages = async (query: string): Promise<SearchResult[]> => {
  const apiKey = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
  const cx = import.meta.env.VITE_GOOGLE_SEARCH_CX;

  if (!apiKey || !cx) {
    console.warn("Google Search API Key or CX ID missing. Falling back to curated landscapes.");
    return getCuratedLandscapes(query);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=10`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Google Search failed");
    }
    
    const data = await response.json();
    
    if (!data.items) return [];

    return data.items.map((item: any, index: number) => ({
      id: item.id || `google-${index}`,
      url: item.link,
      thumbnail: item.image.thumbnailLink,
      author: item.displayLink,
      source: 'Google Images'
    }));
  } catch (error) {
    console.error("Google Search API Error:", error);
    return getCuratedLandscapes(query);
  }
};

const getCuratedLandscapes = (query: string): SearchResult[] => {
  // Fallback curated landscapes for golf course architecture
  const landscapes = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=400&auto=format&fit=crop',
      author: 'Jerry Zhang',
      source: 'Unsplash'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=400&auto=format&fit=crop',
      author: 'Luca Bravo',
      source: 'Unsplash'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop',
      author: 'Sebastian Unrau',
      source: 'Unsplash'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400&auto=format&fit=crop',
      author: 'Pietro De Grandi',
      source: 'Unsplash'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop',
      author: 'Kal Visu',
      source: 'Unsplash'
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1434725039720-bb76ca52786b?q=80&w=1600&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1434725039720-bb76ca52786b?q=80&w=400&auto=format&fit=crop',
      author: 'Simeon Muller',
      source: 'Unsplash'
    }
  ];

  if (!query) return landscapes;
  
  // Simple "search" within our curated list
  return landscapes.filter(l => 
    l.author.toLowerCase().includes(query.toLowerCase()) || 
    query.toLowerCase().includes('landscape') ||
    query.toLowerCase().includes('golf')
  );
};
