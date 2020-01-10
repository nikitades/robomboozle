import React from 'react';
import 'bulma/css/bulma.css'
import '../styles/App.css';
import ModeSelector from './ModeSelector';
import SteermanUI from './SteermanUI';

function App() {
  return (
    <div className="container">
      {/* <ModeSelector /> */}
      <SteermanUI />
    </div>
  );
}

export default App;
