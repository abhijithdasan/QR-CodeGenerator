import React from 'react';
import QRCodeGenerator from './Components/QRGenerator';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>QR Code Generator</h1>
      </header>
      <main>
        <QRCodeGenerator />
      </main>
    </div>
  );
}

export default App;
