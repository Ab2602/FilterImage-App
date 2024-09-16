import React from 'react';
import { ImageProvider } from './contexts/ImageContext';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  return (
    <ImageProvider>
      <div className="App">
        <h1>Image Processing App</h1>
        <ImageEditor />
      </div>
    </ImageProvider>
  );
};

export default App;
