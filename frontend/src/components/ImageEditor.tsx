import React, { useEffect, useState } from 'react';
import { useImage } from '../contexts/ImageContext';

const ImageEditor: React.FC = () => {
  const { image, setImage, brightness, setBrightness, contrast, setContrast, saturation, setSaturation, rotation, setRotation } = useImage();
  const [preview, setPreview] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      const formData = new FormData();
      formData.append('image', event.target.files[0]);

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  useEffect(() => {
    if (image) {
      const processImage = async () => {
        const formData = new FormData();
        formData.append('filePath', 'uploads/' + image.name);
        formData.append('brightness', brightness.toString());
        formData.append('contrast', contrast.toString());
        formData.append('saturation', saturation.toString());
        formData.append('rotation', rotation.toString());
        formData.append('format', 'jpeg'); // or 'png'

        try {
          const response = await fetch('http://localhost:5000/process', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to process image');
          }

          const result = await response.json();
          setPreview(`http://localhost:5000/${result.previewPath}`);
          setDownloadUrl(`http://localhost:5000/${result.downloadPath}`);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      };
      processImage();
    }
  }, [brightness, contrast, saturation, rotation, image]);

  return (
    <div>
      <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} />
      <div>
        <label>
          Brightness:
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Contrast:
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={contrast}
            onChange={(e) => setContrast(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Saturation:
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={saturation}
            onChange={(e) => setSaturation(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Rotation:
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseFloat(e.target.value))}
          />
        </label>
      </div>
      {preview && (
        <div>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          {downloadUrl && (
            <a href={downloadUrl} download="processed-image.jpeg">
              <button>Download Image</button>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
