import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import './QRGenerator.css';
import '../App.css';

const QRGenerator = () => {
  const [mode, setMode] = useState('links');
  const [input, setInput] = useState(mode === 'wifi' ? { ssid: '', password: '', encryption: 'WPA' } : '');
  const [logo, setLogo] = useState(null); 

const handleModeChange = (newMode) => {
  setMode(newMode);
  if (newMode === 'wifi') {
    setInput({ ssid: '', password: '', encryption: 'WPA' });
  } else {
    setInput('');
  }
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
  } else if (mode === 'wifi') {
    return `WIFI:S:${input.ssid};T:${input.encryption};P:${input.password};;`;
  }
  return ''; // Return an empty string or handle unexpected mode cases
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
              value={input.ssid}
              onChange={(e) => setInput({ ...input, ssid: e.target.value })}
            />
            
            <input
              type="text"
              placeholder="Password"
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
            <select
              value={input.encryption}
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
        <button
          className="upload-btn"
          type="button"
          onClick={() => document.getElementById('logo-upload').click()}
        >

          <FontAwesomeIcon icon={faUpload} size="2x" style={{ color: '#ffffff' }} />
        </button>
        <input
          id="logo-upload"
          type="file"
          accept="image/*" 
          onChange={handleLogoChange}
          style={{ display: 'none' }}
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
        <button aria-label="Share QR code" onClick={handleShare}>
        <FontAwesomeIcon icon={faShareAlt} size="2x" />
 
        </button>
      </div>
    </div>
  );
};

export default QRGenerator;
