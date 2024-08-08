import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import './QRGenerator.css'; // Import QRGenerator-specific styles
import '../App.css'; // Import App-wide styles

const QRGenerator = () => {
  const [mode, setMode] = useState('links'); // 'links' or 'wifi'
  const [input, setInput] = useState('');
  const [logo, setLogo] = useState(null); // State to manage logo

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const getQRValue = () => {
    if (mode === 'links') {
      return input;
    }
    // Construct WiFi QR code format
    return `WIFI:S:${input.ssid};T:${input.encryption};P:${input.password};;`;
  };

  const downloadQRCode = (type) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qrcode.${type}`;
    link.href = canvas.toDataURL(`image/${type}`);
    link.click();
  };

  const handleShare = () => {
    // Function to share QR code, could be implemented based on requirements
    // For demonstration, this just opens a new window with the QR code image
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const imageUrl = canvas.toDataURL('image/png');
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="qr-code-generator">
      <div className="qr-code-types">
        <button
          className={`mode-button ${mode === 'links' ? 'active' : ''}`}
          onClick={() => handleModeChange('links')}
        >
          Links
        </button>
        <button
          className={`mode-button ${mode === 'wifi' ? 'active' : ''}`}
          onClick={() => handleModeChange('wifi')}
        >
          WiFi
        </button>
      </div>

      <div className="input-section">
        {mode === 'links' && (
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter link, number, or text"
              value={input}
              onChange={handleInputChange}
            />
          </div>
        )}
        {mode === 'wifi' && (
          <div className="input-container">
            <input
              type="text"
              placeholder="SSID"
              onChange={(e) => setInput({ ...input, ssid: e.target.value })}
            />
            <input
              type="text"
              placeholder="Password"
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
            <select
              onChange={(e) => setInput({ ...input, encryption: e.target.value })}
            >
              <option value="WEP">WEP</option>
              <option value="WPA">WPA</option>
              <option value="nopass">No password</option>
            </select>
          </div>
        )}
      </div>

      <div className="logo-upload">
        <label htmlFor="logo-upload">
          <i className="fas fa-upload fa-2x" style={{ color: '#ffffff' }}></i> {/* FontAwesome icon */}
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          style={{ display: 'none' }} // Hide the actual input
        />
      </div>

      <div className="qr-code-container">
        <QRCode
          value={getQRValue()}
          size={256}
          includeMargin={true}
          renderAs="svg"
          imageSettings={logo ? { src: logo, height: 60, width: 60, excavate: true } : null}
        />
      </div>

      <div className="download-buttons">
        <button onClick={() => downloadQRCode('jpg')}>JPG</button>
        <button onClick={() => downloadQRCode('pdf')}>PDF</button>
        <button onClick={() => downloadQRCode('svg')}>SVG</button>
        <button onClick={handleShare}>
          <i className="fas fa-share-alt fa-2x"></i> 
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;
