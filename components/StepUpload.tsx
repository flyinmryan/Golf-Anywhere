
import React, { useState } from 'react';
import { ArrowRight, Mountain, Map, Compass } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { UploadedImages, ViewType, GeneratedImage } from '../types';

interface StepUploadProps {
  images: UploadedImages;
  history?: GeneratedImage[];
  onUpload: (view: ViewType, base64: string) => void;
  onClear: (view: ViewType) => void;
  onNext: () => void;
  onJumpToResult: (result: GeneratedImage) => void;
}

// Using some generic landscape/golf placeholders
const PREVIEW_IMAGES = [
    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592919016381-f07ecd5a244a?q=80&w=1000&auto=format&fit=crop"
];

export const StepUpload: React.FC<StepUploadProps> = ({ images, history, onUpload, onClear, onNext, onJumpToResult }) => {
  return (
    <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start pb-20">
      
      {/* Left Column: Hero & Preview */}
      <div className="w-full lg:w-5/12 flex flex-col gap-6">
            <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
                    Design your dream course <br />
                    <span className="text-emerald-600">in seconds.</span>
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                    Transform any landscape into a world-class golf course using advanced AI. Upload your site photos, select an architectural style, and watch your vision come to life.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Preview Mode: Parkland Classic</span>
                    <div className="w-8"></div> 
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800">
                    <div className="grid grid-cols-1 gap-2 h-40 sm:h-56">
                         <div className="relative rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 h-full">
                                <img 
                                    src={PREVIEW_IMAGES[0]} 
                                    alt="Golf Course Preview" 
                                    className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                    <span className="text-white text-xs font-bold">St. Andrews Inspiration</span>
                                </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 justify-center lg:justify-start pt-1">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                    <Mountain className="text-emerald-600" size={18} />
                    Terrain Analysis
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                    <Map className="text-emerald-600" size={18} />
                    Hole Routing
                </div>
            </div>
      </div>

      {/* Right Column: Upload Canvas */}
      <div className="w-full lg:w-7/12">
            <div className="bg-card-light dark:bg-card-dark rounded-3xl p-6 shadow-soft dark:shadow-none border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 1: The Landscape</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Upload a photo of the potential course site.</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                        Required: Main View
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                         <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 pl-1">Main Landscape</span>
                         <ImageUpload
                            view="main"
                            image={images.main}
                            onUpload={onUpload}
                            onClear={onClear}
                            required
                        />
                    </div>
                     <div className="flex flex-col gap-2">
                         <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 pl-1">Aerial View</span>
                         <ImageUpload
                            view="aerial"
                            image={images.aerial}
                            onUpload={onUpload}
                            onClear={onClear}
                        />
                    </div>
                     <div className="flex flex-col gap-2">
                         <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 pl-1">Perspective</span>
                         <ImageUpload
                            view="perspective"
                            image={images.perspective}
                            onUpload={onUpload}
                            onClear={onClear}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 max-w-xs text-center sm:text-left leading-tight">
                        Landscape photos are processed securely and used only for architectural visualization.
                    </p>
                    <button 
                        className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all whitespace-nowrap
                            ${images.main 
                                ? 'bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25 hover:bg-emerald-700 cursor-pointer' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-500 cursor-not-allowed'}`}
                        disabled={!images.main}
                        onClick={onNext}
                    >
                        Define Your Design
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Resume Session Block */}
            {history && history.length > 0 && (
                <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        You have {history.length} designs in this session.
                     </span>
                     <button 
                        onClick={() => onJumpToResult(history[0])}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm hover:underline"
                    >
                        View Gallery
                     </button>
                </div>
            )}
      </div>
    </div>
  );
};
