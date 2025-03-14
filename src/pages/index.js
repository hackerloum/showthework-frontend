import { useState, useEffect } from 'react';
import { imagesService } from '../services';

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await imagesService.getPublic();
        setImages(response.images);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Show The Work</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image._id} className="border rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{image.title}</h2>
                <p className="text-gray-600">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
