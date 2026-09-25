import React, { useState, useRef } from 'react';
import { Upload, Camera, Link, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { optimizeImageFile } from '../../utils/imageOptimizer';

interface ImageUploadFieldProps {
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Foto del Producto'
}) => {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      const optimizedDataUrl = await optimizeImageFile(file);
      onChange(optimizedDataUrl);
    } catch (err) {
      console.error(err);
      setError('No se pudo procesar la imagen. Probá con otra foto.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-zinc-300 font-bold text-xs">
          {label} <span className="text-purple-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          {isUrlMode ? (
            <>
              <Upload className="w-3 h-3" />
              <span>Subir archivo desde PC / Celular</span>
            </>
          ) : (
            <>
              <Link className="w-3 h-3" />
              <span>Pegar URL web directa</span>
            </>
          )}
        </button>
      </div>

      {isUrlMode ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... o enlace de tu imagen"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:border-purple-500 focus:outline-none"
          />
          {value && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700">
              <img
                src={value}
                alt="Vista previa"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="flex items-center gap-3 p-3 bg-zinc-900/90 border border-purple-900/60 rounded-xl">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 shrink-0 bg-black">
                <img
                  src={value}
                  alt="Vista previa cargada"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Foto cargada correctamente</span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {value.startsWith('data:') ? 'Imagen real optimizada' : value}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2"
                  >
                    Cambiar foto
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="text-[11px] text-zinc-500 hover:text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-purple-400 bg-purple-950/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'border-zinc-700 bg-zinc-900/40 hover:border-purple-600 hover:bg-zinc-900/80'
              }`}
            >
              {isProcessing ? (
                <div className="py-3 text-purple-300 text-xs flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Optimizando foto real...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-1">
                  <div className="w-10 h-10 rounded-full bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">
                      Arrastrá acá tu foto o hacé clic para elegir
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Soporta fotos de WhatsApp, cámara o galería (JPG, PNG, WebP)
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[11px] font-bold mt-1 shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                    Seleccionar Foto Real
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-[11px] text-red-400 mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};
