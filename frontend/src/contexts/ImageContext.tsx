import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageContextType {
  image: File | null;
  setImage: (image: File) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
  contrast: number;
  setContrast: (contrast: number) => void;
  saturation: number;
  setSaturation: (saturation: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [image, setImage] = useState<File | null>(null);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [rotation, setRotation] = useState(0);

  return (
    <ImageContext.Provider
      value={{ image, setImage, brightness, setBrightness, contrast, setContrast, saturation, setSaturation, rotation, setRotation }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
