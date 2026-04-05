import { useState, useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

function PhotoPreview({ imageUrl, show, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (show) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm'
      onClick={onClose} // Close when clicking the background
    >
      <button 
        onClick={onClose} 
        className='absolute top-6 right-6 text-white hover:text-gray-300 transition-colors'
      >
        <X size={40} />
      </button>
      
      <img 
        src={imageUrl} 
        alt="Preview" 
        className='max-w-full max-h-full rounded-lg shadow-2xl object-contain'
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
      />
    </div>
  );
}

function PhotoViewer({ imageUrl, onDelete, showDelete = false }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className='group relative inline-flex items-center justify-center rounded-md overflow-hidden bg-gray-100'>
      <img 
        src={imageUrl} 
        alt="Thumbnail"
        className='w-24 h-24 md:w-full md:h-full object-cover cursor-zoom-in transition-transform duration-200 group-hover:scale-105' 
        onClick={() => setShowPreview(true)}
      />

      {showDelete && (
        <button
          onClick={() => onDelete(imageUrl)}
          className='absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <Trash2 size={16} />
        </button>
      )}

      <PhotoPreview 
        imageUrl={imageUrl} 
        show={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </div>
  );
}

export default PhotoViewer;