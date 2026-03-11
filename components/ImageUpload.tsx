
import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Camera, Mountain, RotateCcw, Compass } from 'lucide-react';
import { ViewType } from '../types';

interface ImageUploadProps {
  view: ViewType;
  image: string | null;
  onUpload: (view: ViewType, base64: string) => void;
  onClear: (view: ViewType) => void;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ view, image, onUpload, onClear, required }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error("Camera API not available.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false 
        });
        
        if (mounted && isCameraOpen) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Video play error:", e));
          }
        } else {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err: any) {
        if (mounted) {
          setCameraError(err.message || "Could not access camera.");
        }
      }
    };

    if (isCameraOpen) {
      startCamera();
    }

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        onUpload(view, base64);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(view, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderGuidanceOverlay = () => {
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-full h-px bg-white/50 absolute top-1/2 -translate-y-1/2"></div>
        <div className="h-full w-px bg-white/50 absolute left-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-[10px] font-semibold drop-shadow-md">
           Align horizon and capture the landscape
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full animate-fadeIn">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider flex items-center gap-2">
          {view} View {required && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
        </label>
        {image && (
          <button
            onClick={() => onClear(view)}
            className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-1 font-bold uppercase bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md transition-colors"
          >
            <X size={10} /> Remove
          </button>
        )}
      </div>

      <div className={`
          relative overflow-hidden transition-all duration-300 aspect-video w-full
          ${image || isCameraOpen 
            ? 'rounded-2xl border-2 border-emerald-500 bg-black shadow-emerald-500/20 shadow-lg' 
            : 'rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-800'}
        `}>
        
        {image && (
          <>
            <img 
              src={image} 
              alt={`${view} view`} 
              className="w-full h-full object-cover" 
            />
            <div 
              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm"
              onClick={() => onClear(view)}
            >
              <span className="text-white text-xs font-bold flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                <RotateCcw size={14} /> Reset Site Photo
              </span>
            </div>
          </>
        )}

        {!image && isCameraOpen && (
          <div className="relative w-full h-full bg-black">
             {cameraError ? (
               <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                 <p className="text-white text-xs mb-4 bg-red-500/20 p-3 rounded-lg border border-red-500/50">{cameraError}</p>
                 <button onClick={stopCamera} className="text-white text-xs font-medium hover:underline">Cancel</button>
               </div>
             ) : (
               <>
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted 
                   className="w-full h-full object-cover" 
                 />
                 {renderGuidanceOverlay()}
                 <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 z-10 pointer-events-auto">
                    <button onClick={stopCamera} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
                      <X size={20} />
                    </button>
                    <button onClick={capturePhoto} className="p-1.5 rounded-full border-4 border-white/80 hover:scale-105 hover:border-white transition-all shadow-lg">
                      <div className="w-10 h-10 bg-white rounded-full"></div>
                    </button>
                    <div className="w-12"></div>
                 </div>
               </>
             )}
          </div>
        )}

        {!image && !isCameraOpen && (
          <div className="flex flex-col items-center justify-center h-full p-4 group cursor-pointer" onClick={() => inputRef.current?.click()}>
             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
               <Mountain size={20} className="text-slate-400" />
             </div>
             
             <p className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center uppercase tracking-wide">Add Landscape</p>
             <p className="text-[10px] text-slate-400 text-center mb-4">Aerial or Wide View</p>
             
             <div className="flex gap-2 w-full justify-center opacity-80 group-hover:opacity-100 transition-opacity max-w-[160px]">
               <button
                 onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }}
                 className="px-3 py-1.5 text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors w-1/2"
               >
                  Live
               </button>
               
               <button
                 onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                 className="px-3 py-1.5 text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors w-1/2"
               >
                  Browse
               </button>
             </div>
          </div>
        )}
        
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
};
