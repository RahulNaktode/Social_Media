import { useState, useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

function PhotoPreview({ imageUrl, show, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (show) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className='fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-2 md:p-10 backdrop-blur-md'
      onClick={onClose}
    >
      {/* Close button - Mobile friendly size and position */}
      <button 
        onClick={onClose} 
        className='absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full md:bg-transparent'
      >
        <X size={window.innerWidth < 768 ? 28 : 40} />
      </button>
      
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className='max-w-full max-h-[90vh] md:max-h-full rounded-sm md:rounded-lg shadow-2xl object-contain'
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

function PhotoViewer({ imageUrl, onDelete, showDelete = false }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className='group relative w-full flex items-center justify-center rounded-xl overflow-hidden bg-gray-100 border border-gray-200'>
      <img 
        src={imageUrl} 
        alt="Thumbnail"
        className='w-full aspect-auto md:max-h-125 object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105' 
        onClick={() => setShowPreview(true)}
      />

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(imageUrl);
          }}
          className='absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-full shadow-md md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 active:scale-90'
        >
          <Trash2 size={20} />
        </button>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

      <PhotoPreview 
        imageUrl={imageUrl} 
        show={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </div>
  );
}

export default PhotoViewer;