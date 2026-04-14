
import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Mountain, Check, ExternalLink } from 'lucide-react';
import { searchImages, SearchResult } from '../services/searchService';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('golf course site');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen && !hasSearched) {
      handleSearch();
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchImages(query);
      setResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Search size={20} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Search Landscapes</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Find the perfect site for your course</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for terrain (e.g., 'Rolling hills', 'Coastal cliff', 'Desert')..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
               />
            </div>
            <button 
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && results.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
               <Loader2 size={40} className="animate-spin text-emerald-500" />
               <p className="text-sm font-medium animate-pulse">Searching global archives...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {results.map((result) => (
                 <div 
                    key={result.id}
                    className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md"
                    onClick={() => onSelect(result.url)}
                 >
                    <img 
                      src={result.thumbnail} 
                      alt={`Landscape by ${result.author}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                       <p className="text-[10px] text-white/80 font-medium">By {result.author}</p>
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-white font-bold">Select Landscape</span>
                          <Check size={14} className="text-emerald-400" />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          ) : hasSearched ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
               <Mountain size={48} className="opacity-20" />
               <p className="text-sm font-medium">No landscapes found for "{query}"</p>
               <button 
                onClick={() => { setQuery('rolling green hills'); handleSearch(); }}
                className="text-emerald-600 text-sm font-bold hover:underline"
               >
                 Try "rolling green hills"
               </button>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
               <Mountain size={48} className="opacity-20" />
               <p className="text-sm font-medium">Enter a location or terrain type to begin</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
           <span>Source: Unsplash API</span>
           <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
             <ExternalLink size={10} />
             <span>High Resolution Ready</span>
           </div>
        </div>
      </div>
    </div>
  );
};
