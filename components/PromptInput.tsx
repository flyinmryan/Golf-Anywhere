
import React, { useRef, useState } from 'react';
import { Edit3, Dices, X, Youtube, ImageIcon, Link as LinkIcon, Wand2, Play, Trash2 } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  onImageUpload: (base64: string | null) => void;
  image: string | null;
  onUrlAdd: (url: string | null) => void;
  url: string | null;
  onSubmit?: () => void;
  isGenerating?: boolean;
  placeholder?: string;
  label?: React.ReactNode;
  enableSurpriseMe?: boolean;
  onSurpriseMe?: () => void;
  submitLabel?: string;
  inputClassName?: string;
}

const getYoutubeMeta = (url: string) => {
  if (!url) return { id: null, isYoutube: false };
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return { id, isYoutube: !!id };
};

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onImageUpload,
  image,
  onUrlAdd,
  url,
  onSubmit,
  isGenerating = false,
  placeholder = "Describe your design...",
  label,
  enableSurpriseMe = false,
  onSurpriseMe,
  submitLabel = "Generate",
  inputClassName = "min-h-[80px]"
}) => {
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [tempLink, setTempLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { id: ytId, isYoutube } = getYoutubeMeta(url || '');
  const ytThumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    if (tempLink.trim()) {
      onUrlAdd(tempLink.trim());
      setTempLink('');
      setIsLinkInputOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full group">
      {/* Header / Label */}
      <div className="flex justify-between items-end mb-2 px-1">
        <label className="text-[10px] font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
          {label || (
            <>
              <Edit3 size={12} className="text-emerald-500" />
              Design Details
            </>
          )}
        </label>
        {enableSurpriseMe && onSurpriseMe && (
          <button
            onClick={onSurpriseMe}
            className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md transition-colors"
          >
            <Dices size={12} /> Randomize
          </button>
        )}
      </div>

      <div className={`
        relative shadow-lg rounded-xl bg-white dark:bg-gray-900 border transition-all duration-200
        ${isGenerating ? 'opacity-70 pointer-events-none' : ''}
        border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500
      `}>
        
        {/* Input Area */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-4 pt-4 pb-2 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 font-medium resize-none ${inputClassName}`}
          disabled={isGenerating}
        />

        {/* Media Cards Area */}
        {(image || url) && (
          <div className="px-4 pb-4 animate-fadeIn">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Image Card */}
                {image && (
                  <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group/card">
                     <img src={image} alt="Reference" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                     <div className="absolute bottom-2 left-3">
                        <p className="text-white text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                            <ImageIcon size={10} /> Design Reference
                        </p>
                     </div>
                     <button 
                        onClick={() => onImageUpload(null)}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover/card:opacity-100"
                     >
                        <Trash2 size={12} />
                     </button>
                  </div>
                )}

                {/* Video/URL Card */}
                {url && (
                   <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 group/card">
                      {ytThumbnail ? (
                        <>
                          <img src={ytThumbnail} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                <Play size={16} fill="currentColor" />
                             </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                             <div className="flex flex-col items-center gap-1 text-gray-400">
                                <LinkIcon size={16} />
                                <span className="text-[10px] font-bold">LINKED CONTENT</span>
                             </div>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                      
                      <div className="absolute bottom-2 left-3 right-10">
                         <p className="text-white text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                             {isYoutube ? <Youtube size={10} className="text-red-500" /> : <LinkIcon size={10} />}
                             {isYoutube ? 'Video Inspiration' : 'Design Link'}
                         </p>
                      </div>

                      <button 
                        onClick={() => onUrlAdd(null)}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover/card:opacity-100"
                      >
                         <Trash2 size={12} />
                      </button>
                   </div>
                )}
             </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-2 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 rounded-b-xl gap-2">
            <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-emerald-300 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                  disabled={isGenerating}
                >
                  <ImageIcon size={14} className="text-blue-500" />
                  <span>Add Photo</span>
                </button>

                <button
                  onClick={() => setIsLinkInputOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-emerald-300 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                  disabled={isGenerating}
                >
                  <LinkIcon size={14} className="text-red-500" />
                  <span>Add Link</span>
                </button>
            </div>

            {onSubmit && (
                <button 
                    onClick={onSubmit}
                    disabled={(!value && !image && !url) || isGenerating}
                    className={`
                        hidden sm:flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ml-auto
                        ${value || image || url 
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}
                    `}
                >
                    {isGenerating ? <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" /> : <Wand2 size={14} />}
                    {submitLabel}
                </button>
            )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {isLinkInputOpen && (
          <div className="absolute bottom-full left-0 mb-2 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-scaleIn origin-bottom-left w-full max-w-sm">
             <div className="p-3">
                <label className="block text-[10px] font-bold uppercase text-gray-900 dark:text-white mb-2">Reference URL</label>
                <div className="flex gap-2">
                    <input
                        autoFocus
                        type="text"
                        value={tempLink}
                        onChange={(e) => setTempLink(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <button
                        onClick={handleAddLink}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                    >
                        Add
                    </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
